import './styles/main.scss';
import './js/images';
import { initializeSlider } from './js/slider';
import BookStore from './js/books';
import { initializeDropdown } from './js/dropdown';
import { initializeBurgerMenu } from './js/burger';

const API_KEY = 'AIzaSyCazs-Xwd1V9DP9oZvm75prFudVUpxWDFc';

document.addEventListener('DOMContentLoaded', () => {
    initializeSlider('.main__slider');
    const bookStore = new BookStore(API_KEY);
    bookStore.loadBooks('architecture');

    const { hideDropdown } = initializeDropdown('.categories__toggle', '.categories__list');

    document.querySelectorAll('.categories__list__item a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const category = link.textContent.toLowerCase();
            bookStore.loadBooks(category);
            bookStore.updateActiveCategory(category);
            hideDropdown();
        });
    });

    const loadMoreButton = document.querySelector('.books_load-more__button');
    loadMoreButton.addEventListener('click', () => {
        bookStore.loadMoreBooks();
    });

    initializeBurgerMenu('.burger-icon', '.header__burger-nav__list');
});
