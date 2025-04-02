<script>
  import { onMount } from 'svelte';
  let longUrl = '';
  let shortUrl = '';
  let error = '';

  async function shorten() {
    error = '';
    shortUrl = '';
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longUrl })
      });
      const data = await res.json();
      if (res.ok) {
        shortUrl = data.shortUrl;
      } else {
        error = data.error;
      }
    } catch (err) {
      error = 'An error occurred';
    }
  }
</script>

<!-- Include Pico.css via CDN -->
<link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.min.css">

<main class="container">
  <h1>URL Shortener</h1>
  <form on:submit|preventDefault={shorten}>
    <label for="url">Enter a long URL:</label>
    <input type="url" id="url" bind:value={longUrl} placeholder="https://example.com" required />
    <button type="submit">Shorten URL</button>
  </form>
  {#if shortUrl}
    <p>Your short URL is: <a href={shortUrl}>{shortUrl}</a></p>
  {/if}
  {#if error}
    <p style="color: red;">{error}</p>
  {/if}
</main>
