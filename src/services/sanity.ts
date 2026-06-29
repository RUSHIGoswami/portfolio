import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import {
  fallbackEducations,
  fallbackExperiences,
  fallbackProjects,
  fallbackSkills,
  fallbackArticles,
  fallbackContact,
  Education,
  ExperienceData,
  Project,
  SkillCategory,
  Article,
  ContactInfo,
} from "../data/fallbackData";

// Try to get environment variables. 
// If they are missing, we'll gracefully fallback to local mock data.
const projectId = (import.meta as any).env.VITE_SANITY_PROJECT_ID;
const dataset = (import.meta as any).env.VITE_SANITY_DATASET || "production";

let sanityClient: ReturnType<typeof createClient> | null = null;
let builder: ReturnType<typeof createImageUrlBuilder> | null = null;

if (projectId) {
  sanityClient = createClient({
    projectId,
    dataset,
    useCdn: true, // edge cache for speed; self-invalidates a few minutes after each publish
    apiVersion: "2023-05-03", // use current date (YYYY-MM-DD) to target the latest API version
  });
  builder = createImageUrlBuilder(sanityClient);
}

export function urlFor(source: any) {
  if (!builder) return "";
  return builder.image(source).url();
}

/**
 * Data Fetching Hooks / Functions
 * These functions attempt to fetch from Sanity CMS.
 * If the CMS is not configured (or fails), they return the fallbackData.
 */

export const fetchEducations = async (): Promise<Education[]> => {
  if (sanityClient) {
    try {
      const data = await sanityClient.fetch(`*[_type == "education"] | order(order asc)`);
      if (data && data.length > 0) return data;
    } catch (e) {
      console.warn("Failed to fetch education from Sanity. Using fallback.", e);
    }
  }
  return fallbackEducations;
};

export const fetchExperiences = async (): Promise<ExperienceData[]> => {
  if (sanityClient) {
    try {
      const data = await sanityClient.fetch(`*[_type == "experience"] | order(order asc)`);
      if (data && data.length > 0) return data;
    } catch (e) {
      console.warn("Failed to fetch experience from Sanity. Using fallback.", e);
    }
  }
  return fallbackExperiences;
};

export const fetchProjects = async (): Promise<Project[]> => {
  if (sanityClient) {
    try {
      const data = await sanityClient.fetch(
        `*[_type == "project"] | order(order asc){
          ...,
          "imageUrl": image.asset->url,
          "tools": tools[]->{ "id": _id, name }
        }`
      );
      // Drop unresolved references (null) so the UI never sees a half-formed skill.
      if (data && data.length > 0)
        return data.map((p: Project) => ({ ...p, tools: (p.tools ?? []).filter(Boolean) }));
    } catch (e) {
      console.warn("Failed to fetch projects from Sanity. Using fallback.", e);
    }
  }
  return fallbackProjects;
};

export const fetchSkills = async (): Promise<SkillCategory[]> => {
  if (sanityClient) {
    try {
      const data = await sanityClient.fetch(
        `*[_type == "skillCategory"] | order(order asc){
          title,
          iconName,
          order,
          "skills": skills[]->{ "id": _id, name }
        }`
      );
      if (data && data.length > 0)
        return data.map((c: SkillCategory) => ({ ...c, skills: (c.skills ?? []).filter(Boolean) }));
    } catch (e) {
      console.warn("Failed to fetch skills from Sanity. Using fallback.", e);
    }
  }
  return fallbackSkills;
};

export const fetchArticles = async (): Promise<Article[]> => {
  if (sanityClient) {
    try {
      const data = await sanityClient.fetch(
        `*[_type == "article"] | order(date desc){..., "id": _id, "imageUrl": image.asset->url}`
      );
      if (data && data.length > 0) return data;
    } catch (e) {
      console.warn("Failed to fetch articles from Sanity. Using fallback.", e);
    }
  }
  return fallbackArticles;
};

export const fetchContact = async (): Promise<ContactInfo[]> => {
  if (sanityClient) {
    try {
      const data = await sanityClient.fetch(`*[_type == "contactInfo"] | order(order asc)`);
      if (data && data.length > 0) return data;
    } catch (e) {
      console.warn("Failed to fetch contact from Sanity. Using fallback.", e);
    }
  }
  return fallbackContact;
};
