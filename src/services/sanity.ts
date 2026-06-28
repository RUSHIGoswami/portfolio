import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import {
  fallbackEducation,
  fallbackExperience,
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
let builder: ReturnType<typeof imageUrlBuilder> | null = null;

if (projectId) {
  sanityClient = createClient({
    projectId,
    dataset,
    useCdn: true, // set to `false` to bypass the edge cache
    apiVersion: "2023-05-03", // use current date (YYYY-MM-DD) to target the latest API version
  });
  builder = imageUrlBuilder(sanityClient);
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

export const fetchEducation = async (): Promise<Education> => {
  if (sanityClient) {
    try {
      const data = await sanityClient.fetch(`*[_type == "education"][0]`);
      if (data) return data;
    } catch (e) {
      console.warn("Failed to fetch education from Sanity. Using fallback.", e);
    }
  }
  return fallbackEducation;
};

export const fetchExperience = async (): Promise<ExperienceData> => {
  if (sanityClient) {
    try {
      const data = await sanityClient.fetch(`*[_type == "experience"][0]`);
      if (data) return data;
    } catch (e) {
      console.warn("Failed to fetch experience from Sanity. Using fallback.", e);
    }
  }
  return fallbackExperience;
};

export const fetchProjects = async (): Promise<Project[]> => {
  if (sanityClient) {
    try {
      const data = await sanityClient.fetch(
        `*[_type == "project"] | order(order asc){..., "imageUrl": image.asset->url}`
      );
      if (data && data.length > 0) return data;
    } catch (e) {
      console.warn("Failed to fetch projects from Sanity. Using fallback.", e);
    }
  }
  return fallbackProjects;
};

export const fetchSkills = async (): Promise<SkillCategory[]> => {
  if (sanityClient) {
    try {
      const data = await sanityClient.fetch(`*[_type == "skillCategory"] | order(order asc)`);
      if (data && data.length > 0) return data;
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
