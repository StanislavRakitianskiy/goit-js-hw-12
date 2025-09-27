import axios from 'axios';

const API_KEY = '52384777-c1c022b2fee3dc7bb99322d83'
const instance = axios.create({
  baseURL: 'https://pixabay.com/api/',
  params: {
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
  },
});
export function getImagesByQuery(query) {
  return instance
    .get('', { params: { q: query } })
    .then(res => res.data);
}
