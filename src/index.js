import './css/style.css';
import Notiflix from 'notiflix';

const axios = require('axios').default;
const BASIC_URL = 'https://pixabay.com/api/';
const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const buttonEl = document.querySelector('.load-more');

const page = 40;
let pageCounter = 1;
let totalHits = 0;
let value = '';

formEl.addEventListener('submit', imageNameValue);
buttonEl.addEventListener('click', moreImage);

function imageNameValue(e) {
  e.preventDefault();
  clearMurcap();
  value = e.currentTarget.searchQuery.value;

  if (value === '') {
    return Notiflix.Notify.failure('Need input search text.');
  }

  const searchParams = new URLSearchParams({
    key: '34878247-d7f93aeb6758d56eb43c829d6',
    q: value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,

    page: 1,
    per_page: 40,
  });
  const url = `${BASIC_URL}?${searchParams}`;
  searchImage(url);
}

function moreImage() {
  buttonEl.classList.add('is-hidden');
  if (totalHits - pageCounter * page <= page) {
    buttonEl.classList.remove('is-hidden');
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }

  const searchParams = new URLSearchParams({
    key: '34878247-d7f93aeb6758d56eb43c829d6',
    q: value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,

    page: (pageCounter += 1),
    per_page: 40,
  });
  const url = `${BASIC_URL}?${searchParams}`;
  searchImage(url);
}

async function searchImage(url) {
  try {
    const response = await axios.get(url);
    totalHits = response.data.totalHits;

    if (response.data.hits.length === 0) {
      throw new Error();
    } else {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      murcapImageCart(response);
    }

    return response.data;
  } catch {
    buttonEl.classList.add('is-hidden');
    Notiflix.Notify.failure(
      '"Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function murcapImageCart(response) {
  const marcup = response.data.hits
    .map(e => {
      return `<div class="photo-card">
    <img src="${e.largeImageURL}" alt="${e.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b> ${e.likes}
      </p>
      <p class="info-item">
        <b>Views</b> ${e.views}
      </p>
      <p class="info-item">
        <b>Comments</b> ${e.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b> ${e.downloads}
      </p>
    </div>
  </div>`;
    })
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', marcup);
  buttonEl.classList.toggle('is-hidden');
}

function clearMurcap() {
  galleryEl.innerHTML = '';
}
