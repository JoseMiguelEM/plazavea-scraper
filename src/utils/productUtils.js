// src/utils/productUtils.js
import { Logger } from './logger.js';
import fs from 'fs/promises';
import path from 'path';
import { saveProducts } from './storage.js';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function elementExists(page, selector) {
    try {
      const element = await page.$(selector);
      if (!element) return false;
      
      const isDisabled = await page.evaluate(sel => {
        const el = document.querySelector(sel);
        return el ? el.classList.contains('disabled') : true;
      }, selector);
      
      return !isDisabled;
    } catch (error) {
      Logger.error('Error al verificar elemento:', error);
      return false;
    }
  }
  
export async function getProductsFromPage(page) {
  try {
    await page.waitForSelector('.showcase-grid > div > .Showcase__content', {
      timeout: 30000
    });

    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll('.showcase-grid > div > .Showcase__content');
      
      return [...productElements].map(product => ({
        name: product.querySelector('.Showcase__name')?.innerText?.trim() || 'Sin nombre',
        seller: product.querySelector('.Showcase__SellerName')?.innerText?.trim() || 'Sin vendedor',
        price: product.querySelector('.Showcase__salePrice')?.innerText?.trim() || 'Sin precio',
        timestamp: new Date().toISOString()
      }));
    });

    return products;
  } catch (error) {
    Logger.error('Error extrayendo productos de la página:', error);
    return [];
  }
}

async function ensureElementIsClickable(page, selector) {
  await page.waitForSelector(selector, { visible: true });
  
  await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, selector);
  
  await page.waitForFunction(
    (selector) => {
      const element = document.querySelector(selector);
      if (!element) return false;
      
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
      );
    },
    {},
    selector
  );
  
  await wait(500);
}

export async function getAllProductsFromCategory(page, categoryName) {
    if (!categoryName) {
      throw new Error('Category name is required');
    }
  
    const products = [];
    let pageNum = 1;
    const nextPageSelector = '.page-control.next';
    
    while (true) {
      try {
        Logger.info(`Extrayendo productos de la página ${pageNum} para ${categoryName}...`);
        
        const pageProducts = await getProductsFromPage(page);
        products.push(...pageProducts);
        Logger.info(`Se encontraron ${pageProducts.length} productos en la página ${pageNum}`);
  
        // Guardar progreso cada 10 páginas
        if (pageNum % 10 === 0) {
          try {
            await saveProducts(categoryName, products);
            Logger.info(`Guardado progreso de ${categoryName}: ${products.length} productos hasta ahora`);
          } catch (saveError) {
            Logger.error(`Error al guardar progreso de ${categoryName}:`, saveError);
            // Continuamos aunque falle el guardado
          }
        }
  
        // Verificar si existe siguiente página
        const hasNextPage = await elementExists(page, nextPageSelector);
        
        if (!hasNextPage) {
          Logger.info(`Fin de la paginación alcanzado para ${categoryName}`);
          break;
        }
  
        // Click en siguiente página
        await page.evaluate(selector => {
          const element = document.querySelector(selector);
          if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, nextPageSelector);
        
        await wait(1000);
  
        try {
          await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }),
            page.click(nextPageSelector)
          ]);
        } catch (clickError) {
          Logger.error(`Error al hacer click en siguiente página: ${clickError.message}`);
          break;
        }
  
        pageNum++;
        await wait(1000);
      } catch (error) {
        Logger.error(`Error procesando página ${pageNum} de ${categoryName}:`, error);
        break;
      }
    }
  
    // Guardar resultados finales
    if (products.length > 0) {
      try {
        await saveProducts(categoryName, products);
        Logger.success(`Extracción completa para ${categoryName}: ${products.length} productos`);
      } catch (finalSaveError) {
        Logger.error(`Error al guardar resultados finales de ${categoryName}:`, finalSaveError);
      }
    }
  
    return products;
  }