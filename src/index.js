// src/index.js
import { setupBrowser } from './utils/browser.js';
import { BASE_URL } from './config/config.js';
import { Logger } from './utils/logger.js';

async function main() {
  try {
    Logger.info('Iniciando scraper...');
    const { browser, page } = await setupBrowser();
    
    Logger.info(`Navegando a ${BASE_URL}...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    
    Logger.success('Navegación exitosa!');
    const title = await page.title();
    Logger.info(`Título de la página: ${title}`);
    
    await browser.close();
    Logger.success('Browser cerrado correctamente');
  } catch (error) {
    Logger.error('Error en la ejecución:', error);
    process.exit(1);
  }
}

main();