// src/utils/browser.js
import puppeteer from 'puppeteer';

export async function setupBrowser() {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1366, height: 768 }
  });
  return browser;
}