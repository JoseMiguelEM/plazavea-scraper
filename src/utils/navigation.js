// src/utils/navigation.js
import { SELECTORS } from '../config/selectors.js';
import { Logger } from './logger.js';
import { formatCategories } from './formatter.js';

export async function getCategories(page) {
  try {
    Logger.info('Esperando a que el botón del menú esté disponible...');
    
    // 1. Esperar por el botón del menú y asegurarse que es interactuable
    const menuButton = await page.waitForSelector(SELECTORS.NAVIGATION.MENU_BUTTON, {
      visible: true,
      timeout: 30000
    });

    if (!menuButton) {
      throw new Error('No se pudo encontrar el botón del menú');
    }

    Logger.info('Haciendo clic en el botón del menú...');
    
    // 2. Hacer clic y esperar a que el menú se expanda
    await Promise.all([
      menuButton.click(),
      page.waitForSelector('span[data-section="categories"]', {
        visible: true,
        timeout: 5000
      }).catch(() => null) // Ignoramos error si no aparece inmediatamente
    ]);

    // 3. Dar tiempo adicional para que el menú se expanda completamente
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));

    // 4. Extraer las categorías
    const categories = await page.evaluate(() => {
      const categories = document.querySelectorAll('span[data-section="categories"]');
      const results = [];
      
      categories.forEach(category => {
        const link = category.closest('a');
        if (link && category.textContent) {
          results.push({
            name: category.textContent.trim(),
            url: link.href
          });
        }
      });
      
      return results;
    });

    Logger.debug(`Categorías encontradas inicialmente: ${categories.length}`);

    if (categories.length === 0) {
      // Intentar con selectores alternativos si el principal falla
      const alternativeCategories = await page.evaluate(() => {
        const alternativeSelectors = [
          '.MainMenu__wrapper a',
          '#menu-categories a',
          'div[data-menu-content="true"] a'
        ];
        
        for (const selector of alternativeSelectors) {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            return Array.from(elements)
              .map(el => ({
                name: el.textContent.trim(),
                url: el.href
              }))
              .filter(item => item.name && item.url && item.url.includes('plazavea.com.pe'));
          }
        }
        return [];
      });

      if (alternativeCategories.length > 0) {
        Logger.info(`Se encontraron ${alternativeCategories.length} categorías usando selectores alternativos`);
        return alternativeCategories;
      }

      // Si aún no hay categorías, capturar el estado actual
      const debugInfo = await page.evaluate(() => ({
        menuHTML: document.querySelector('#menu-button-desktop')?.outerHTML || 'No encontrado',
        menuComputedStyle: window.getComputedStyle(document.querySelector('#menu-button-desktop') || {}).cssText,
        visibleElements: Array.from(document.querySelectorAll('*'))
          .filter(el => el.offsetWidth > 0 && el.offsetHeight > 0)
          .map(el => ({
            tag: el.tagName,
            id: el.id,
            classes: Array.from(el.classList),
            text: el.textContent.slice(0, 50)
          }))
          .slice(0, 10)
      }));

      Logger.debug('Estado del DOM:', debugInfo);
      throw new Error('No se encontraron categorías');
    }

    // Formatear las categorías encontradas
    const formattedCategories = formatCategories(categories);

    Logger.success(`Se encontraron ${formattedCategories.length} categorías`);
    formattedCategories.forEach(category => {
      Logger.debug(`- ${category.name} (${category.nameFormatted}): ${category.url}`);
    });

    // Guardar resultados para debugging
    const fs = await import('fs/promises');
    await fs.writeFile(
      'temp-categories.json', 
      JSON.stringify(formattedCategories, null, 2)
    );

    return formattedCategories;
  } catch (error) {
    Logger.error('Error al obtener las categorías:', error);
    
    try {
      await page.screenshot({
        path: 'error-categories.png',
        fullPage: true
      });
      
      const html = await page.content();
      const fs = await import('fs/promises');
      await fs.writeFile('error-page.html', html);
    } catch (debugError) {
      Logger.error('Error al guardar datos de debugging:', debugError);
    }
    
    throw error;
  }
}