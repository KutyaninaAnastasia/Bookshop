export default class BurgerMenu {
    constructor(burgerIconSelector, burgerMenuSelector) {
        this.burgerIcon = document.querySelector(burgerIconSelector);
        this.burgerMenu = document.querySelector(burgerMenuSelector);
        this.firstBurgerLine = document.getElementById('first-line');
        this.secondBurgerLine = document.getElementById('second-line');
        this.thirdBurgerLine = document.getElementById('third-line');

        this.toggleBurgerMenu = this.toggleBurgerMenu.bind(this);
    }

    init() {
        this.burgerIcon.addEventListener('click', this.toggleBurgerMenu);
    }

    toggleBurgerMenu() {
        this.firstBurgerLine.classList.toggle('burger__animation__first-line');
        this.secondBurgerLine.classList.toggle('burger__animation__second-line');
        this.thirdBurgerLine.classList.toggle('burger__animation__third-line');

        this.burgerMenu.classList.toggle('burger_list_active');
    }
}

export function initializeBurgerMenu(burgerIconSelector, burgerMenuSelector) {
    const burgerMenu = new BurgerMenu(burgerIconSelector, burgerMenuSelector);
    burgerMenu.init();
}
