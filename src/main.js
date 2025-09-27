import './css/base.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions';

const form = document.getElementById('search-form');
const input = form.elements['search-text'];

form.addEventListener('submit', onSearchSubmit);

function onSearchSubmit(e) {
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

  clearGallery();
  showLoader();

  getImagesByQuery(query)
    .then(({ hits, totalHits }) => {
      if (!hits || hits.length === 0) {
        iziToast.warning({
          title: 'Нічого не знайдено',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
        });
        return;
      }

      createGallery(hits);

      iziToast.success({
        title: 'Готово',
        message: `Знайдено ${totalHits} зображень (показано ${hits.length}).`,
        position: 'topRight',
        timeout: 1800,
      });
    })
    .catch(err => {
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
    })
    .finally(() => {
      hideLoader();
    });
}