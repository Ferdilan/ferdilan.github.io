/**
 * This route is responsible for the built-in authoring environment using Sanity Studio v3.
 * All content is organized in the sanity.config.ts file, which is embedded here.
 */

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export const dynamic = "force-dynamic";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
