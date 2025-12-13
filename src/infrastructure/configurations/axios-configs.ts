import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REST_API_URL,
  //baseURL: 'serverApis',
  // timeout: 1000,
});

//
// INTERCEPTORS

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

//////////////////////////////

// Définition de la constante pour le nombre maximum de requêtes
const MAX_REQUESTS = 1;

// Intercepteur qui évite des requêtes en double
const requestMap = new Map<string, number>(); // Utilisation d'un nombre pour le compteur

axiosInstance.interceptors.request.use((config) => {
  const key = JSON.stringify(config);

  // Vérifier si la requête est déjà en cours et si le nombre maximum de requêtes est atteint
  if ((requestMap.get(key) || 0) >= MAX_REQUESTS) {
    return Promise.reject('Request limit reached or request in progress');
  }

  // Marquer la requête comme en cours
  requestMap.set(key, (requestMap.get(key) || 0) + 1); // Incrémenter le compteur pour cette requête

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    const key = JSON.stringify(response.config);

    // Supprimer la requête de la carte et décrémenter le compteur
    const count = requestMap.get(key);

    if (count && count > 1) {
      requestMap.set(key, count - 1); // Décrémenter le compteur
    } else {
      requestMap.delete(key); // Supprimer la requête si le compteur atteint zéro
    }

    return response;
  },
  (error) => {
    const key = JSON.stringify(error.config);

    // Supprimer la requête de la carte et décrémenter le compteur
    const count = requestMap.get(key);

    if (count && count > 1) {
      requestMap.set(key, count - 1); // Décrémenter le compteur
    } else {
      requestMap.delete(key); // Supprimer la requête si le compteur atteint zéro
    }

    return Promise.reject(error);
  }
);
