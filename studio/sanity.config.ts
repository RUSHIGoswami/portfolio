import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
  name: "default",
  title: "Rushi Goswami — Portfolio",

  // Set SANITY_STUDIO_PROJECT_ID in studio/.env (see studio/.env.example).
  projectId: process.env.SANITY_STUDIO_PROJECT_ID as string,
  dataset: "production",

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
