import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

import { fetchBreeds } from './cat-api';
import { fetchCatByBreed } from './cat-api';

const breedSelect = document.querySelector('.breed-select');
const loaderElement = document.querySelector('.loader');
const errorElement = document.querySelector('.error');

function showElement(element) {
  element.style.display = 'block';
}

function hideElement(element) {
  element.style.display = 'none';
}

hideElement(breedSelect);
hideElement(errorElement);

fetchBreeds()
  .then(data => {
    createList(data);
    hideElement(loaderElement);
    showElement(breedSelect);
  })
  .catch(err => showElement(errorElement));

function createList(data) {
  data.forEach(breed => {
    const option = document.createElement('option');
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });
}

breedSelect.addEventListener('change', onChange);

function onChange(event) {
  const breedId = event.target.value;
  showElement(loaderElement);
  fetchBreeds()
    .then(breeds => {
      const selectedBreed = breeds.find(breed => breed.id === breedId);
      if (selectedBreed) {
        const breedName = selectedBreed.name;
        const breedDescription = selectedBreed.description;
        const breedTemperament = selectedBreed.temperament;

        fetchCatByBreed(breedId)
          .then(response => {
            const catImage = response[0].url;

            const catInfoElement = document.querySelector('.cat-info');

            const html = `
                <div style="display: flex; align-items: center; max-width: 100%;">
                  <img src="${catImage}" alt="Cat Image" style="max-width: 500px;">
                  <div style="margin-left: 10px;">
                    <h1>${breedName}</h1>
                    <p>${breedDescription}</p>
                    <p><b>Temperament:</b> ${breedTemperament}</p>
                  </div>
                </div>
              `;

            catInfoElement.innerHTML = html;
            hideElement(loaderElement);
          })
          .catch(err => showElement(errorElement));
      }
    })
    .catch(err => showElement(errorElement));
}
