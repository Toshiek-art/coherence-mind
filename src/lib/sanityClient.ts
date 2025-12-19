import { createClient } from '@sanity/client';

const projectId = import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.SANITY_DATASET;
const apiVersion = import.meta.env.SANITY_API_VERSION ?? '2024-01-01';

if (!projectId || !dataset) {
  console.warn('Sanity credentials are missing; content will fall back to placeholders.');
}

export const sanityClient = projectId && dataset
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: import.meta.env.PROD,
      token: import.meta.env.SANITY_API_READ_TOKEN
    })
  : null;
