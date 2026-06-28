import { defineField, defineType } from "sanity";

export default defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 2,
      description: "Short summary shown in the list.",
    }),
    defineField({
      name: "date",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "content",
      type: "text",
      rows: 20,
      description: "Markdown — supports # headings, **bold**, `code`, lists, links.",
    }),
    defineField({
      name: "image",
      title: "Cover image (optional)",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  orderings: [
    { title: "Newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] },
  ],
  preview: { select: { title: "title", subtitle: "date", media: "image" } },
});
