import { defineField, defineType } from "sanity";

/**
 * A skill is a first-class entity. Skill categories and projects both REFERENCE
 * skills (rather than repeating free-text), so each skill is a single shared
 * record — edit it once and every category/project that points to it updates.
 */
export default defineType({
  name: "skill",
  title: "Skill",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "order",
      title: "Sort order (lower shows first)",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: "Name", name: "nameAsc", by: [{ field: "name", direction: "asc" }] },
    { title: "Sort order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "name" } },
});
