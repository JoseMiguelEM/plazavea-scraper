// src/index.js
import { setupBrowser } from './utils/browser.js';
import { BASE_URL } from './config/config.js';

async function main() {
  try {
    console.log('Iniciando scraper...');
    const { browser, page } = await setupBrowser();
    
    console.log(`Navegando a ${BASE_URL}...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    
    console.log('Navegación exitosa!');
    const title = await page.title();
    console.log(`Título de la página: ${title}`);
    
    await browser.close();
    console.log('Browser cerrado correctamente');
  } catch (error) {
    console.error('Error en la ejecución:', error);
    process.exit(1);
  }
}

main();