import { defineCliConfig } from "sanity/cli";

// Project ID comes from studio/.env (SANITY_STUDIO_PROJECT_ID). Dataset is "production".
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: "production",
  },
  studioHost: "rushi-portfolio",
  deployment: {
    appId: "jg4vtyyiekni8efynf1z70zj",
  },
});
