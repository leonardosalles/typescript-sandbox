export async function fetchPokemons(page, limit = 10) {
  const offset = page * limit;

  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );

  if (!res.ok) {
    throw new Error('Fetch error')
  }

  return res.json();
}
