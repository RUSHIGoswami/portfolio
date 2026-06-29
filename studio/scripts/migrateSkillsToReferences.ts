/**
 * One-off migration: string skill/tool arrays  ->  references to `skill` documents.
 *
 * Run from the studio folder:
 *   npx sanity exec scripts/migrateSkillsToReferences.ts --with-user-token
 *
 * What it does (idempotent — safe to re-run):
 *   1. Reads every skillCategory + project.
 *   2. Builds ONE canonical `skill` doc per distinct name, normalizing so that
 *      case/spacing variants collapse ("LangChain" == "Langchain" == "Langgraph"
 *      grouping etc.). Names seen in a skillCategory are the curated source of
 *      truth; a name seen only in a project is still created (so the project keeps
 *      its full stack) but is not "curated".
 *   3. createOrReplace's the skill docs with deterministic ids (skill.<key>).
 *   4. Rewrites each category.skills and project.tools to arrays of references.
 *   5. Commits everything in a single transaction.
 *
 * Sanity keeps full document history, so this is revertable.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2023-05-03" });

// Normalize a display name to a dedup key (alphanumerics only, lowercased).
const keyOf = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "");

interface Doc {
  _id: string;
  _type: string;
  skills?: string[] | null;
  tools?: string[] | null;
}

async function run() {
  const docs: Doc[] = await client.fetch(
    `*[_type in ["skillCategory","project"]]{ _id, _type, skills, tools }`
  );

  // Build the canonical skill set.
  const canon = new Map<string, { id: string; name: string }>();
  const register = (raw: string) => {
    const name = raw.trim();
    const key = keyOf(name);
    if (!key) return null;
    // Dot-free id: Sanity treats the pre-dot segment as a reserved namespace
    // (drafts./versions.), which blocks anonymous reads.
    if (!canon.has(key)) canon.set(key, { id: `skill-${key}`, name });
    return canon.get(key)!;
  };

  // Categories first so their spelling wins as the canonical display name.
  for (const d of docs) {
    if (d._type === "skillCategory") (d.skills ?? []).forEach(register);
  }
  for (const d of docs) {
    if (d._type === "project") (d.tools ?? []).forEach(register);
  }

  const tx = client.transaction();

  // 1. Upsert skill documents.
  let order = 0;
  for (const { id, name } of canon.values()) {
    tx.createOrReplace({ _id: id, _type: "skill", name, order: order++ });
  }

  // 2. Rewrite each doc's array to references (deduped within the array).
  const toRefs = (names: string[] | null | undefined) => {
    const seen = new Set<string>();
    const refs: { _type: "reference"; _ref: string; _key: string }[] = [];
    for (const raw of names ?? []) {
      const entry = register(raw);
      if (!entry || seen.has(entry.id)) continue;
      seen.add(entry.id);
      refs.push({ _type: "reference", _ref: entry.id, _key: keyOf(raw) });
    }
    return refs;
  };

  for (const d of docs) {
    if (d._type === "skillCategory") tx.patch(d._id, (p) => p.set({ skills: toRefs(d.skills) }));
    if (d._type === "project") tx.patch(d._id, (p) => p.set({ tools: toRefs(d.tools) }));
  }

  await tx.commit({ visibility: "sync" });
  console.log(
    `Migrated: ${canon.size} skill docs created/updated, ${docs.length} documents rewired to references.`
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
