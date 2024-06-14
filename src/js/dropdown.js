export function initializeDropdown(toggleSelector, listSelector) {
    const toggleButton = document.querySelector(toggleSelector);
    const categoryList = document.querySelector(listSelector);

    const hideDropdown = () => {
        if (window.innerWidth <= 768) {
            toggleButton.setAttribute('aria-expanded', 'false');
            categoryList.classList.remove('dropdown-visible');
        }
    };

    toggleButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
        toggleButton.setAttribute('aria-expanded', !isExpanded);
        if (!isExpanded && window.innerWidth <= 768) {
            categoryList.classList.add('dropdown-visible');
        } else {
            categoryList.classList.remove('dropdown-visible');
        }
    });

    document.addEventListener('click', (event) => {
        if (window.innerWidth <= 768 && !categoryList.contains(event.target) && !toggleButton.contains(event.target)) {
            hideDropdown();
        }
    });

    return { hideDropdown };
}
