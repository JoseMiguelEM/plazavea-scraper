// src/index.js
import { setupBrowser } from './utils/browser.js';
import { getCategories, navigateAllCategories } from './utils/navigation.js';
import { Logger } from './utils/logger.js';
import { BASE_URL } from './config/config.js';

async function main() {
  let browser;
  try {
    Logger.info('Iniciando scraper...');
    const { browser: instanceBrowser, page } = await setupBrowser();
    browser = instanceBrowser;
    
    Logger.info(`Navegando a ${BASE_URL}...`);
    await page.goto(BASE_URL, { 
      waitUntil: 'networkidle0',
      timeout: 40000 
    });
    
    Logger.info('Obteniendo categorías...');
    const categories = await getCategories(page);
    
    Logger.info(`Iniciando navegación por ${categories.length} categorías...`);
    await navigateAllCategories(page, categories);
    
    Logger.success('Proceso completado exitosamente');
    await browser.close();
  } catch (error) {
    Logger.error('Error en la ejecución:', error);
    if (browser) {
      await browser.close();
    }
    process.exit(1);
  }
}

main();