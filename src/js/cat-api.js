const COLLECTION_URL = 'https://api.thecatapi.com/v1';
const API_KEY =
  'live_ A4uQRkWoEQrTluzgDKPM0ddlnKUdvm ThTsjvv8waN5NQM033CzZ35AE4bty8 fEH8';

export function fetchBreeds() {
  return fetch(`${COLLECTION_URL}/breeds?key=${API_KEY}`).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp.json();
  });
};

export function fetchCatByBreed(breedId) {
    return fetch(
      `${COLLECTION_URL}/images/search?breed_ids=${breedId}&api_key=${API_KEY}`
    ).then(resp => {
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      return resp.json();
    });
};
