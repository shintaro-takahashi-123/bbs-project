import { createClient } from 'microcms-js-sdk';

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN || 'dummy-domain';
const apiKey = process.env.MICROCMS_API_KEY || 'dummy-key';

export const client = createClient({
  serviceDomain,
  apiKey,
});