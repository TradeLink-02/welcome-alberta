import { createClient, type SanityClient } from '@sanity/client';
import type { Step } from '../types/Step';
import type { Service } from '../types/Service';

const PROJECT_ID = process.env.EXPO_PUBLIC_SANITY_PROJECT_ID ?? '';
const DATASET = process.env.EXPO_PUBLIC_SANITY_DATASET ?? 'production';
const API_VERSION = '2024-01-01';

// Lazy — only created when PROJECT_ID is present to avoid startup crash
let _client: SanityClient | null = null;

function getClient(): SanityClient {
  if (!PROJECT_ID) throw new Error('EXPO_PUBLIC_SANITY_PROJECT_ID not set');
  if (!_client) {
    _client = createClient({ projectId: PROJECT_ID, dataset: DATASET, apiVersion: API_VERSION, useCdn: true });
  }
  return _client;
}

export async function fetchStepsFromSanity(): Promise<Step[]> {
  const query = `*[_type == "step"] | order(stepNumber asc) {
    "id": slug.current, stepNumber, title, timing, offlineAvailable, whyItMatters,
    "actions": actions[] { id, text },
    "documents": documents[] { id, name, whyNeeded, whereToGet },
    "resources": resources[] { label, url },
    "personaNotes": personaNotes[] { status, note }
  }`;
  return getClient().fetch<Step[]>(query);
}

export async function fetchServicesFromSanity(): Promise<Service[]> {
  const query = `*[_type == "service"] | order(name asc) {
    "id": slug.current, name, category, address, phone, website,
    hours, languagesServed, description, latitude, longitude
  }`;
  return getClient().fetch<Service[]>(query);
}
