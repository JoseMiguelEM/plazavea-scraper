# Plaza Vea Web Scraper

Un scraper robusto y modular desarrollado en Node.js para extraer información de productos de Plaza Vea. Utiliza Puppeteer para la automatización del navegador y está diseñado con una arquitectura modular para facilitar el mantenimiento y la escalabilidad.
Este proyecto fue diseñado como parte del reto técnico propuesto en el bootcamp de Krowdy.

## 🚀 Características

- Extracción automática de productos por categorías
- Sistema de logging detallado
- Manejo robusto de errores
- Guardado automático de progreso
- Reintentos automáticos en caso de fallos
- Exclusión configurable de categorías
- Desarrollo con hot-reload

## 📋 Prerequisitos

- Node.js (v14 o superior)
- npm o yarn
- Chromium/Chrome instalado

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone <https://github.com/JoseMiguelEM/plazavea-scraper.git>
cd plazavea-scraper
```

2. Instalar dependencias:
```bash
npm install
```

## 💻 Uso

Para desarrollo (con hot-reload):
```bash
npm run dev
```



## 🛠️ Configuración

### Configuración de Categorías Excluidas
En `src/config/selectors.js`:
```javascript
export const EXCLUDED_CATEGORIES = ['supermercado', 'marcas-aliadas'];
```

### Configuración de la URL Base
En `src/config/config.js`:
```javascript
export const BASE_URL = 'https://www.plazavea.com.pe';
```

## 📄 Formato de Datos

Los productos se guardan en archivos JSON con la siguiente estructura:
```json
{
  "category": "Nombre de la Categoría",
  "total": 100,
  "lastUpdate": "2024-11-12T12:00:00.000Z",
  "products": [
    {
      "name": "Nombre del Producto",
      "seller": "Vendedor",
      "price": "S/ 99.90",
      "timestamp": "2024-11-12T12:00:00.000Z"
    }
  ]
}
```

## 🔍 Logging


## 📝 Notas de Desarrollo

- El scraper utiliza una estrategia de reintentos para manejar fallos de red
- Los productos se guardan automáticamente cada 10 páginas para prevenir pérdida de datos
- Se implementa scrolling suave para evitar detección de automatización
- Incluye delays configurables entre acciones para evitar sobrecarga del servidor


## ⚠️ Limitaciones Conocidas

- El scraper puede requerir ajustes si la estructura del sitio cambia
- Algunas categorías están excluidas por diseño
- El rendimiento depende de la conexión a internet y recursos del sistema

