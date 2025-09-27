import './css/base.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

const form = document.getElementById('search-form');
const input = form.elements['search-text'];
const loadMoreBtn = document.querySelector('.btn__load');

let currentQuery = '';
let page = 1;
const PER_PAGE = 15;
let totalHits = 0;
let loadedCount = 0;

hideLoadMoreButton();

form.addEventListener('submit', onSearchSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearchSubmit(e) {
  e.preventDefault();

  const query = input.value.trim();
  if (!query) {
    iziToast.info({
      title: 'Увага',
      message: 'Введи слово для пошуку.',
      position: 'topRight',
    });
    return;
  }
  currentQuery = query;
  page = 1;
  totalHits = 0;
  loadedCount = 0;

  hideLoadMoreButton();
  clearGallery();

  showLoader();
  try {
    const data = await getImagesByQuery(currentQuery, page);
    const { hits = [], totalHits: total = 0 } = data || {};
    totalHits = total;

    if (!hits.length) {
      iziToast.warning({
        title: 'Нічого не знайдено',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(hits);
    loadedCount += hits.length;

    iziToast.success({
      title: 'Готово',
      message: `Знайдено ${totalHits} зображень (показано ${loadedCount}).`,
      position: 'topRight',
      timeout: 1800,
    });

    if (loadedCount < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        title: 'Кінець колекції',
        message: `We're sorry, but you've reached the end of search results.`,
        position: 'topRight',
      });
    }
  } catch (err) {
    console.error(err);
    const msg =
      err?.response?.status === 400
        ? 'Некоректний запит до API.'
        : 'Сталася помилка під час завантаження. Спробуй пізніше.';
    iziToast.error({
      title: 'Помилка',
      message: msg,
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  page += 1;

  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(currentQuery, page);
    const { hits = [] } = data || {};

    if (!hits.length) {
      iziToast.info({
        title: 'Кінець колекції',
        message: `We're sorry, but you've reached the end of search results.`,
        position: 'topRight',
      });
      hideLoadMoreButton();
      return;
    }

    const prevLastCard = document.querySelector('.gallery .card:last-child');
    createGallery(hits);
    loadedCount += hits.length;

    smoothScrollByTwoCards(prevLastCard);
    if (loadedCount >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'Кінець колекції',
        message: `We're sorry, but you've reached the end of search results.`,
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (err) {
    console.error(err);
    const msg =
      err?.response?.status === 400
        ? 'Некоректний запит до API.'
        : 'Сталася помилка під час завантаження. Спробуй пізніше.';
    iziToast.error({
      title: 'Помилка',
      message: msg,
      position: 'topRight',
    });
    showLoadMoreButton();
  } finally {
    hideLoader();
  }
}

function smoothScrollByTwoCards(prevLastCard) {
  const firstCard = document.querySelector('.gallery .card');
  if (!firstCard) return;

  const rect =
    (prevLastCard && prevLastCard.getBoundingClientRect()) ||
    firstCard.getBoundingClientRect();

  const scrollBy = rect.height * 2;
  window.scrollBy({
    top: scrollBy,
    behavior: 'smooth',
  });
}
