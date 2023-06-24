import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import TomSelect from 'tom-select';
import 'tom-select/dist/css/tom-select.bootstrap4.min.css';

import { fetchBreeds } from './cat-api';
import { fetchCatByBreed } from './cat-api';

const breedSelect = document.querySelector('.breed-select');
const loaderElement = document.querySelector('.loader');
const errorElement = document.querySelector('.error');
const catInfoElement = document.querySelector('.cat-info');

const tomSelect = new TomSelect(breedSelect, {});

hideElement(tomSelect.wrapper);
hideElement(errorElement);

function showElement(element) {
  element.style.display = 'block';
}

function hideElement(element) {
  element.style.display = 'none';
}

fetchBreeds()
  .then(data => {
    createList(data);
    hideElement(loaderElement);
    showElement(tomSelect.wrapper);
  })
  .catch(err => {
    showElement(errorElement);
    hideElement(loaderElement);
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!',
      {
        width: '500px',
        timeout: '5000',
        fontSize: '25px',
        opacity: 0.7,
      }
    );
  });

function createList(data) {
  data.forEach(breed => {
    tomSelect.addOption({
      value: breed.id,
      text: breed.name,
    });
  });
}

tomSelect.on('change', onChange);

function onChange(event) {
  const breedId = tomSelect.getValue();
  hideElement(catInfoElement);
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

            const html = `
                <div style="display: flex; align-items: center; margin-top: 20px; max-width: 100%;">
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
            showElement(catInfoElement);
          })
          .catch(err => {
            showElement(errorElement);
            hideElement(loaderElement);
            Notiflix.Notify.failure(
              'Oops! Something went wrong! Try reloading the page!',
              {
                width: '500px',
                timeout: '5000',
                fontSize: '25px',
                opacity: 0.7,
              }
            );
          });
      }
    })
    .catch(err => {
      showElement(errorElement);
      hideElement(loaderElement);
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!',
        {
          width: '500px',
          timeout: '5000',
          fontSize: '25px',
          opacity: 0.7,
        }
      );
    });
}
