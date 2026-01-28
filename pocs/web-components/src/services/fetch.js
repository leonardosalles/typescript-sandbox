export async function fetchClient(url, options = {}) {
  console.log('[FETCH REQUEST]', url, options);

  const start = performance.now();

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  console.log('[FETCH RESPONSE]', response.status, response);

  if (!response.ok) {
    console.error('[FETCH ERROR]', response.status);
    throw new Error(`Fetch error: ${response.status}`);
  }

  const data = await response.json();

  console.log(
    `[FETCH TIMING] ${Math.round(performance.now() - start)}ms`,
  );

  return data;
}

export async function fetchPokemons(page, limit = 10) {
  const offset = page * limit;

  return fetchClient(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
  );
}
