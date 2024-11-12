// src/config/selectors.js
export const SELECTORS = {
  NAVIGATION: {
    MENU_BUTTON: "#menu-button-desktop",
    CATEGORIES: 'span[data-section="categories"]',
    ALTERNATIVE_CATEGORIES: [
      '.MainMenu__wrapper a',
      '#menu-categories a',
      'div[data-menu-content="true"] a'
    ],
    MENU_WRAPPER: '.MainMenu__wrapper'
  }
};

export const EXCLUDED_CATEGORIES = ['supermercado', 'marcas-aliadas'];