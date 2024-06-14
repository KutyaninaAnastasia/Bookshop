import defaultCover from '../img/alt-book.png';

class BookService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.startIndex = 0;
        this.booksPerPage = 6;
    }

    async fetchBooks(category) {
        const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${category}&startIndex=${this.startIndex}&maxResults=${this.booksPerPage}&key=${this.apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error('Error fetching books:', error);
            return [];
        }
    }

    incrementStartIndex() {
        this.startIndex += this.booksPerPage;
    }

    resetStartIndex() {
        this.startIndex = 0;
    }
}

class BookCard {
    constructor(book, inCart) {
        this.book = book;
        this.inCart = inCart;
        this.cardElement = this.createCardElement();
    }

    createCardElement() {
        const { title, authors, description, imageLinks, averageRating, ratingsCount } = this.book.volumeInfo;
        const price = this.book.saleInfo?.retailPrice ? `$${this.book.saleInfo.retailPrice.amount}` : '';

        const shortDescription = description ? (description.length > 100 ? `${description.substring(0, 100)}...` : description) : 'No description available';
        const thumbnail = imageLinks?.thumbnail || defaultCover;

        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');

        bookCard.innerHTML = `
            <img src="${thumbnail}" alt="${title || 'Unknown Title'}" class="book-cover">
            <div class="book-info">
                <p class="author">${authors ? authors.join(', ') : 'Unknown Author'}</p>
                <h3 class="title">${title || 'Unknown Title'}</h3>
                ${this.createRating(averageRating, ratingsCount)}
                <p class="description">${shortDescription}</p>
                ${price ? `<p class="price">${price}</p>` : ''}
                <button class="buy-button ${this.inCart ? 'in-cart' : ''}" data-book-id="${this.book.id}">
                    ${this.inCart ? 'In the cart' : 'Buy now'}
                </button>
            </div>
        `;

        return bookCard;
    }

    createRating(averageRating, ratingsCount) {
        if (!averageRating) return '';

        const fullStars = Math.floor(averageRating);
        const emptyStars = 5 - fullStars;

        return `
            <div class="rating">
                ${'<span class="star">&#9733;</span>'.repeat(fullStars)}
                ${'<span class="empty-star">&#9733;</span>'.repeat(emptyStars)}
                <span class="reviews-count">${ratingsCount || 0} reviews</span>
            </div>
        `;
    }

    render(container) {
        container.appendChild(this.cardElement);
    }
}

export default class BookStore {
    constructor(apiKey) {
        this.bookService = new BookService(apiKey);
        this.booksContainer = document.querySelector('.books__content');
        this.cartCounter = document.querySelector('.cart__counter__number');
        this.cartCounterContainer = document.querySelector('.cart__counter');
        this.cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.currentCategory = '';
        this.updateCartCounter();
    }

    async loadBooks(category) {
        try {
            this.currentCategory = category;
            this.bookService.resetStartIndex();
            this.booksContainer.innerHTML = '';
            const books = await this.bookService.fetchBooks(category);
            this.displayBooks(books);
        } catch (error) {
            console.error('Error loading books:', error);
        }
    }

    async loadMoreBooks() {
        try {
            this.bookService.incrementStartIndex();
            const books = await this.bookService.fetchBooks(this.currentCategory);
            this.displayBooks(books);
        } catch (error) {
            console.error('Error loading more books:', error);
        }
    }

    displayBooks(books) {
        books.forEach(book => {
            const inCart = this.cartItems.includes(book.id);
            const bookCard = new BookCard(book, inCart);
            bookCard.render(this.booksContainer);
            this.attachBuyButtonListener(bookCard.cardElement.querySelector('.buy-button'));
        });
    }

    attachBuyButtonListener(button) {
        button.addEventListener('click', () => {
            const bookId = button.getAttribute('data-book-id');
            this.toggleCartItem(bookId);
            this.updateCartButton(button, bookId);
            this.updateCartCounter();
        });
    }

    updateCartCounter() {
        const count = this.cartItems.length;
        this.cartCounter.textContent = count;
        this.cartCounterContainer.classList.toggle('visible', count > 0);
        this.cartCounter.style.display = count > 0 ? 'flex' : 'none';
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }

    toggleCartItem(bookId) {
        const index = this.cartItems.indexOf(bookId);
        if (index === -1) {
            this.cartItems.push(bookId);
        } else {
            this.cartItems.splice(index, 1);
        }
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }

    updateCartButton(button, bookId) {
        const inCart = this.cartItems.includes(bookId);
        button.classList.toggle('in-cart', inCart);
        button.textContent = inCart ? 'In the cart' : 'Buy now';
    }

    updateActiveCategory(category) {
        document.querySelectorAll('.categories__list__item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.categories__list__item a').forEach(link => {
            if (link.textContent.toLowerCase() === category) {
                link.parentElement.classList.add('active');
            }
        });
    }
}
