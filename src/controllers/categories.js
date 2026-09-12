import { getAllCategories } from '../models/categories.js';

export async function showCategoriesPage(req, res) {
  const title = 'Service Categories';
  const categories = await getAllCategories();
  res.render('categories', { title, categories });
}