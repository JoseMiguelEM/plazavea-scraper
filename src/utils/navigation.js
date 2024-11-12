// src/utils/navigation.js
import { SELECTORS, EXCLUDED_CATEGORIES } from '../config/selectors.js';
import { Logger } from './logger.js';
import { formatCategories } from './formatter.js';
import { BASE_URL } from '../config/config.js';

// Función auxiliar para pausas
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function navigateToCategory(page, category) {
  try {
    const url = `${BASE_URL}/${category.nameFormatted}`;
    Logger.info(`Navegando a categoría: ${category.name} (${url})`);
    
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    const currentUrl = page.url();
    Logger.success(`Navegación exitosa a ${currentUrl}`);
    
    return true;
  } catch (error) {
    Logger.error(`Error navegando a categoría ${category.name}:`, error);
    return false;
  }
}

export async function getCategories(page) {
  try {
    Logger.info('Esperando a que el botón del menú esté disponible...');
    
    const menuButton = await page.waitForSelector(SELECTORS.NAVIGATION.MENU_BUTTON, {
      visible: true,
      timeout: 30000
    });

    if (!menuButton) {
      throw new Error('No se pudo encontrar el botón del menú');
    }

    Logger.info('Haciendo clic en el botón del menú...');
    
    await menuButton.click();
    await page.waitForSelector(SELECTORS.NAVIGATION.CATEGORIES, {
      visible: true,
      timeout: 5000
    });

    const categories = await page.evaluate(() => {
      const categories = document.querySelectorAll('span[data-section="categories"]');
      return [...categories].map(category => ({
        name: category.textContent.trim(),
        url: ''
      }));
    });

    if (categories.length === 0) {
      throw new Error('No se encontraron categorías');
    }

    const formattedCategories = formatCategories(categories);
    Logger.info(`Se encontraron ${formattedCategories.length} categorías en total`);

    return formattedCategories;
  } catch (error) {
    Logger.error('Error al obtener las categorías:', error);
    throw error;
  }
}

export async function navigateAllCategories(page, categories) {
  Logger.info('Iniciando navegación secuencial por categorías...');
  let processedCount = 0;
  let skippedCount = 0;
  
  for (const category of categories) {
    if (EXCLUDED_CATEGORIES.includes(category.nameFormatted)) {
      Logger.info(`Saltando categoría excluida: ${category.name}`);
      skippedCount++;
      continue;
    }

    await navigateToCategory(page, category);
    // Usar la nueva función wait en lugar de waitForTimeout
    await wait(1000);
    processedCount++;
  }
  
  Logger.success(`Navegación completada - Procesadas: ${processedCount}, Excluidas: ${skippedCount}`);
}