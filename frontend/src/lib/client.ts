import { createClient } from 'microcms-js-sdk';

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

if (!serviceDomain || !apiKey) {
  throw new Error('MICROCMS_SERVICE_DOMAIN と MICROCMS_API_KEY を .env に設定してください。');
}

export const client = createClient({
  serviceDomain,
  apiKey,
});