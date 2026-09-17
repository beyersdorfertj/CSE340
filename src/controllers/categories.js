import { getAllCategories, getCategoryById } from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/projects.js';

const showCategoriesPage = async (req, res) => {
  const title = 'Service Categories';
  const categories = await getAllCategories();
  res.render('categories', { title, categories });
}

const showCategoryDetailsPage = async (req, res) => {
  const categoryId = parseInt(req.params.id, 10) || 0;
  const category = await getCategoryById(categoryId);
  const projects = await getProjectsByCategoryId(categoryId);
  const title = category ? 'Category Details' : 'Category Not Found';
  res.render('category', { title, category, projects });
};

export { showCategoriesPage, showCategoryDetailsPage };