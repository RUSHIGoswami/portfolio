/**
 * Fix-up: skill document ids used a dot ("skill.langchain"). Sanity treats the
 * pre-dot segment as a reserved namespace (drafts./versions.), so those docs are
 * NOT readable by anonymous/public clients. Re-id them dot-free ("skill-langchain")
 * and repoint every reference.
 *
 *   npx sanity exec scripts/fixSkillIds.ts --with-user-token
 *
 * Idempotent: once ids contain no dots, re-running is a no-op.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2023-05-03" });

const safe = (id: string) => id.replace(/\./g, "-"); // skill.langchain -> skill-langchain

interface Ref { _type: "reference"; _ref: string; _key: string }
interface Doc { _id: string; _type: string; skills?: Ref[] | null; tools?: Ref[] | null }

async function run() {
  const skills: { _id: string; name: string; order?: number }[] = await client.fetch(
    `*[_type=="skill"]{ _id, name, order }`
  );
  const dotted = skills.filter((s) => s._id.includes("."));
  if (!dotted.length) {
    console.log("Nothing to fix — all skill ids are already dot-free.");
    return;
  }

  const docs: Doc[] = await client.fetch(
    `*[_type in ["skillCategory","project"]]{ _id, _type, skills, tools }`
  );

  const tx = client.transaction();

  // 1. Recreate each skill under a dot-free id.
  for (const s of dotted) {
    tx.createOrReplace({ _id: safe(s._id), _type: "skill", name: s.name, order: s.order ?? 0 });
  }

  // 2. Repoint references in categories/projects.
  const remap = (refs: Ref[] | null | undefined) =>
    (refs ?? [])
      .filter((r) => r && r._ref)
      .map((r) => ({ ...r, _ref: safe(r._ref) }));

  for (const d of docs) {
    if (d._type === "skillCategory") tx.patch(d._id, (p) => p.set({ skills: remap(d.skills) }));
    if (d._type === "project") tx.patch(d._id, (p) => p.set({ tools: remap(d.tools) }));
  }

  // 3. Delete the old dotted skill docs.
  for (const s of dotted) tx.delete(s._id);

  await tx.commit({ visibility: "sync" });
  console.log(`Fixed ${dotted.length} skill ids (dot -> dash) and repointed references.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
