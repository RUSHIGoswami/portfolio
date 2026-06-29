import { defineField, defineType } from "sanity";

// iconName values MUST match the ContactIconMap keys in BentoLayout.tsx.
const ICONS = ["mail", "phone", "linkedin", "github"];

export default defineType({
  name: "contactInfo",
  title: "Contact Link",
  type: "document",
  fields: [
    defineField({
      name: "iconName",
      title: "Icon",
      type: "string",
      options: { list: ICONS.map((i) => ({ title: i, value: i })) },
      validation: (r) => r.required(),
    }),
    defineField({ name: "label", type: "string", description: "e.g. Email, GitHub" }),
    defineField({ name: "value", type: "string", description: "Displayed text, e.g. you@mail.com" }),
    defineField({
      name: "link",
      type: "url",
      description: "mailto:, tel:, or https:// URL",
      validation: (r) => r.uri({ scheme: ["http", "https", "mailto", "tel"] }),
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
  preview: { select: { title: "label", subtitle: "value" } },
});
