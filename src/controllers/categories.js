import { getAllCategories, getCategoryById, updateCategoryAssignements, getCategoriesByProjectId } from '../models/categories.js';
import { getProjectsByCategoryId, getProjectDetails } from '../models/projects.js';

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

const showAssignCategoryForm = async (req, res) => {
  const projectId = parseInt(req.params.id, 10) || 0;

  const projectDetails = await getProjectDetails(projectId);
  const categories = await getAllCategories();
  const assignedCategories = await getCategoriesByProjectId(projectId);

  const title = 'Assign Categories to Project';
  res.render('categoriesAssign', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
  const projectId = parseInt(req.params.id, 10) || 0;
  const selectedCategories = req.body.categoryIds || [];

  const categoryIdsArray = Array.isArray(selectedCategories) ? selectedCategories : [selectedCategories];
  await updateCategoryAssignements(projectId, categoryIdsArray);
  req.flash('success', 'Categories updated successfully.');
  res.redirect(`/project/${projectId}`);
};

export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoryForm, processAssignCategoriesForm };