import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
});

/**
 * Returns true when the Sanity client is properly configured.
 * Use this guard before making fetch calls to avoid build-time failures.
 */
export const isSanityConfigured = projectId !== "placeholder";
