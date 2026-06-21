"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  title: "Ferdilan Portfolio — Sanity Studio",
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Projects")
              .child(S.documentTypeList("project")),
            S.listItem()
              .title("Blog Posts")
              .child(S.documentTypeList("blogPost")),
            S.listItem()
              .title("Certificates")
              .child(S.documentTypeList("certificate")),
            S.listItem()
              .title("Experience & Education")
              .child(S.documentTypeList("experience")),
          ]),
    }),
    visionTool(),
  ],
});
