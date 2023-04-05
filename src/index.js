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

function urlMacker(value) {
  const searchParams = new URLSearchParams({
    key: '34878247-d7f93aeb6758d56eb43c829d6',
    q: value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: pageCounter,
    per_page: 40,
  });
  return `${BASIC_URL}?${searchParams}`;
}

async function imageNameValue(e) {
  e.preventDefault();
  clearMurcap();
  addHiddenForBtn();
  pageCounter = 1;
  value = e.currentTarget.searchQuery.value.trim();
  if (value === '') {
    return textMsg();
  }
  const url = urlMacker(value);
  const response = await searchImage(url);
  totalHits = response.data.totalHits;

  sortResponseForMarcup(response);
}

async function moreImage() {
  pageCounter += 1;
  const url = urlMacker(value);
  const response = await searchImage(url);
  sortResponseForMarcup(response);
}

async function searchImage(url) {
  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.log(error);
  }
}

function sortResponseForMarcup(response) {
  if (response.data.hits.length === 0) {
    return failureMessage();
  }
  if (pageCounter > 1 && response.data.hits.length < 40) {
    addHiddenForBtn();
    failureBtnMessage();
    return murcapImageCart(response);
  }
  if (response.data.hits.length < 40) {
    addHiddenForBtn();
    successMessage();
    failureBtnMessage();
    return murcapImageCart(response);
  }
  if (pageCounter === 1) {
    successMessage();
    removeHiddenForBtn();
    return murcapImageCart(response);
  } else {
    murcapImageCart(response);
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
}

function clearMurcap() {
  galleryEl.innerHTML = '';
}

function successMessage() {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}
function failureMessage() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
function failureBtnMessage() {
  Notiflix.Notify.failure(
    "We're sorry, but you've reached the end of search results."
  );
}

function textMsg() {
  Notiflix.Notify.failure('Need input search text.');
}
function addHiddenForBtn() {
  buttonEl.classList.add('is-hidden');
}
function removeHiddenForBtn() {
  buttonEl.classList.remove('is-hidden');
}
