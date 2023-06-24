import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

import { fetchBreeds } from './cat-api';
import { fetchCatByBreed } from './cat-api';


const breedSelect = document.querySelector('.breed-select');

fetchBreeds()
  .then(data => createList(data))
  .catch(err => console.log(err));

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
          })
          .catch(() => {
            Notiflix.Notify.failure(
              'Oops!!! There is no cat!!! &#128008 Maybe he was scared by an angry dog!!! &#128021',
              {
                width: '500px',
                timeout: '3000',
                fontSize: '30px',
                opacity: 0.7,
              }
            );
          });
      }
    })
    .catch(err => console.log(err));
}
