import { defineField, defineType } from "sanity";

export default defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({ name: "role", type: "string", validation: (r) => r.required() }),
    defineField({ name: "company", type: "string", validation: (r) => r.required() }),
    defineField({ name: "duration", type: "string", description: "e.g. January 2023 - Present" }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({
      name: "achievements",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "responsibilities",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "order",
      title: "Sort order (lower shows first)",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: "Sort order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "role", subtitle: "company" } },
});
