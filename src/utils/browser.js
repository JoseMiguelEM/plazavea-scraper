// src/utils/browser.js
import puppeteer from 'puppeteer';
import { BASE_URL } from '../config/config.js';

export async function setupBrowser() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,  // Esto permitirá que la ventana se ajuste al tamaño máximo
    args: [
      '--start-maximized',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();
  
  // Configurar timeouts
  await page.setDefaultNavigationTimeout(30000);
  await page.setDefaultTimeout(30000);
  
  // Configurar user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');

  // Habilitar JavaScript
  await page.setJavaScriptEnabled(true);

  return { browser, page };
}