import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEl = document.querySelector('.gallery');
const loaderEl = document.getElementById('loader');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function createGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <li class="card">
        <a href="${largeImageURL}">
          <img class="card__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="card__meta">
          <div><p class="cart__title">Likes</p><p class="cart__text">${likes}</p></div>
          <div><p class="cart__title">Views</p><p class="cart__text">${views}</p></div>
          <div><p class="cart__title">Comments</p><p class="cart__text">${comments}</p></div>
          <div><p class="cart__title">Downloads</p><p class="cart__text">${downloads}</p></div>
        </div>
      </li>`
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
}

export function clearGallery() {
  galleryEl.innerHTML = '';
}

export function showLoader() {
  loaderEl.classList.add('is-active');
  loaderEl.setAttribute('aria-busy', 'true');
}

export function hideLoader() {
  loaderEl.classList.remove('is-active');
  loaderEl.setAttribute('aria-busy', 'false');
}
