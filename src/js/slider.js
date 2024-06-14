import banner1 from '../img/banner.png';
import banner2 from '../img/banner2.png';
import banner3 from '../img/banner3.png';

let images = [
    {
        url: banner1,
        alt: 'black friday'
    },
    {
        url: banner2,
    },
    {
        url: banner3,
    }
];

export default class Slider {
    constructor(element, images) {
        this.element = element;
        this.images = images;
        this.currentIndex = 0;
        this.sliderImage = document.createElement('img'); 
        this.sliderImage.classList.add('slider__image');
        this.dotsContainer = this.element.querySelector('.slider__dots');
    }

    init() {
        this.createImageElement();
        this.createDots();
        this.updateImage();
        this.startAutoSlide();
        this.dots.forEach(dot => dot.addEventListener('click', (e) => this.onDotClick(e)));
    }

    createImageElement() {
        const sliderBox = this.element.querySelector('.slider__box');
        sliderBox.appendChild(this.sliderImage);
    }

    createDots() {
        this.dotsContainer.innerHTML = '';
        this.images.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.index = index;
            this.dotsContainer.appendChild(dot);
        });
        this.dots = Array.from(this.dotsContainer.children);
    }

    updateImage() {
        this.sliderImage.classList.remove('fade-in');
        this.sliderImage.classList.add('fade-out');
        setTimeout(() => {
            this.sliderImage.src = this.images[this.currentIndex].url;
            this.sliderImage.alt = this.images[this.currentIndex].alt;
            this.sliderImage.classList.remove('fade-out');
            this.sliderImage.classList.add('fade-in');
            this.updateDots();
        }, 500); 
    }

    updateDots() {
        this.dots.forEach(dot => dot.classList.remove('active'));
        this.dots[this.currentIndex].classList.add('active');
    }

    startAutoSlide() {
        this.interval = setInterval(() => {
            this.nextImage();
        }, 10000);
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateImage();
    }

    onDotClick(e) {
        clearInterval(this.interval);
        this.currentIndex = parseInt(e.target.dataset.index);
        this.updateImage();
        this.startAutoSlide();
    }
}

export function initializeSlider(selector) {
    const sliderElement = document.querySelector(selector);
    if (sliderElement) {
        const slider = new Slider(sliderElement, images);
        slider.init();
    }
}