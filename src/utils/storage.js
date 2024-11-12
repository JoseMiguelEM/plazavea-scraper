// src/utils/storage.js
import fs from 'fs/promises';
import { STORAGE_FILE } from '../config/config.js';
import path from 'path';
import { Logger } from './logger.js';

export async function saveProducts(categoryName, products) {
  try {
    // Crear directorio data si no existe
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });

    const fileName = path.join(dataDir, `products_${categoryName}.json`);
    const data = {
      category: categoryName,
      total: products.length,
      lastUpdate: new Date().toISOString(),
      products
    };

    await fs.writeFile(fileName, JSON.stringify(data, null, 2));
    Logger.info(`Guardados ${products.length} productos de ${categoryName} en ${fileName}`);
  } catch (error) {
    Logger.error(`Error guardando productos de ${categoryName}:`, error);
    // No lanzamos el error para que el scraping continúe
  }
}