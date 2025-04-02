// src/routes/api/shorten/+server.js
import { json } from '@sveltejs/kit';
import { generateShortCode } from '$lib/shorten';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, env }) {
  try {
    const { longUrl } = await request.json();
    console.log(env);
    console.log(env.LINKS_KV);
    // Validate the URL
    try {
      new URL(longUrl);
    } catch (e) {
      return json({ error: 'Invalid URL provided' }, { status: 400 });
    }

    // Generate a unique short code (with collision detection)
    let shortCode;
    let exists = true;
    let attempts = 0;
    while (exists && attempts < 5) {
      shortCode = generateShortCode();
      const existing = await env.LINKS_KV.get(shortCode);
      if (!existing) {
        exists = false;
      }
      attempts++;
    }
    if (exists) {
      return json({ error: 'Failed to generate a unique short code, please try again.' }, { status: 500 });
    }

    // Store the mapping in Cloudflare KV: shortCode -> longUrl
    await env.LINKS_KV.put(shortCode, longUrl);

    // Construct the full short URL.
    // Note: In production, you might know your domain ahead of time.
    const host = request.headers.get('host');
    const shortUrl = `https://${host}/${shortCode}`;
    return json({ shortUrl });
  } catch (error) {
    console.error('Error in /api/shorten:', error);
    return json({ error: 'Server error' }, { status: 500 });
  }
}
