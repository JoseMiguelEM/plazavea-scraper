// src/utils/navigation.js
import { selectors } from '../config/selectors.js';

export async function getCategories(page) {
  await page.waitForSelector(selectors.categoryMenu);
  // Implementar lógica
}