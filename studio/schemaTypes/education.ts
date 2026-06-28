import { defineField, defineType } from "sanity";

export default defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    defineField({ name: "degree", type: "string", validation: (r) => r.required() }),
    defineField({ name: "institution", type: "string", validation: (r) => r.required() }),
    defineField({ name: "duration", type: "string", description: "e.g. 2019-2023" }),
    defineField({ name: "gpa", title: "GPA", type: "string", description: "e.g. 8.9/10" }),
  ],
  preview: { select: { title: "degree", subtitle: "institution" } },
});
