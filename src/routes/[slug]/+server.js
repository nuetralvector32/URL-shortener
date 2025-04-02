// src/routes/[slug]/+server.js
import { redirect, error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, env }) {
  const { slug } = params;
  const longUrl = await env.LINKS_KV.get(slug);

  if (longUrl) {
    // Redirect with a 302 status
    throw redirect(302, longUrl);
  } else {
    // If no URL is found, throw a 404 error
    throw error(404, 'Short URL not found');
  }
}
