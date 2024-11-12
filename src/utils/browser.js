// src/utils/browser.js
import puppeteer from 'puppeteer';
import { BASE_URL } from '../config/config.js';

export async function setupBrowser() {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1366, height: 768 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    timeout: 30000
  });

  const page = await browser.newPage();
  
  // Configurar timeouts
  await page.setDefaultNavigationTimeout(30000);
  await page.setDefaultTimeout(30000);
  
  // Interceptar y bloquear recursos innecesarios
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
      request.abort();
    } else {
      request.continue();
    }
  });

  return { browser, page };
}

