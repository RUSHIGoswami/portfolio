import { defineField, defineType } from "sanity";

// iconName values MUST match the IconMap keys in the frontend (BentoLayout.tsx).
const ICONS = ["bot", "code", "database", "terminal", "microscope", "brain", "cloud"];

export default defineType({
  name: "skillCategory",
  title: "Skill Category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "iconName",
      title: "Icon",
      type: "string",
      options: { list: ICONS.map((i) => ({ title: i, value: i })) },
      initialValue: "terminal",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "skills",
      title: "Skills",
      type: "array",
      of: [{ type: "reference", to: [{ type: "skill" }] }],
      validation: (r) => r.required().min(1),
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
  preview: { select: { title: "title", subtitle: "iconName" } },
});
