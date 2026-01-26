import axios from 'axios'


export const axiosClient = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 5000,
});

axiosClient.interceptors.request.use(
  config => {
    console.log('[AXIOS MIDDLEWARE] Request:', {
      method: config.method,
      url: config.url,
    })

    return config;
  },
  error => {
    console.error('[AXIOS MIDDLEWARE] Request error:', error)
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  response => {
    console.log('[AXIOS MIDDLEWARE] Response:', {
      status: response.status,
      url: response.config.url,
    })

    return response
  },
  error => {
    console.error('[AXIOS MIDDLEWARE] Response error:', error)
    return Promise.reject(error)
  }
)

export async function axiosPokemons(page, limit = 10) {
  const offset = page * limit

  const res = await axiosClient.get('/pokemon', {
    params: { limit, offset },
  })

  return res.data
}

