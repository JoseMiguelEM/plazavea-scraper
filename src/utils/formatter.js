// src/utils/formatter.js
export const formatCategories = (categories) => {
    return categories.map((category) => ({
      ...category,
      nameFormatted: category.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Elimina acentos
        .toLowerCase()
        .replace(/,/g, "-")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "")
    }));
  };