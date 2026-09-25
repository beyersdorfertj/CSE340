import { getAllCategories, createCategory, updateCategory, getCategoryById, updateCategoryAssignements, getCategoriesByProjectId } from '../models/categories.js';
import { getProjectsByCategoryId, getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// Server-side validation rules for the category form.
// Note: minimum length (3) is intentionally server-side only, so it is not
// enforced on the client and the server-side validation remains testable.
const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Category name must be between 3 and 100 characters')
];

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

const showNewCategoryForm = async (req, res) => {
  const title = 'Add New Category';
  res.render('categoryNew', { title });
};

const processNewCategoryForm = async (req, res) => {
  // Check for validation errors
  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash('error', error.msg);
    });

    // Redirect back to the new category form
    return res.redirect('/category/new');
  }

  const { name } = req.body;
  const categoryId = await createCategory(name);
  req.flash('success', 'Category added successfully!');
  res.redirect(`/category/${categoryId}`);
};

const showEditCategoryForm = async (req, res) => {
  const categoryId = parseInt(req.params.id, 10) || 0;
  const category = await getCategoryById(categoryId);
  if (!category) {
    req.flash('error', 'Category not found');
    return res.redirect('/categories');
  }
  const title = 'Edit Category';
  res.render('categoryEdit', { title, category });
};

const processEditCategoryForm = async (req, res) => {
  const categoryId = parseInt(req.params.id, 10) || 0;

  // Check for validation errors
  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash('error', error.msg);
    });

    // Redirect back to the edit category form
    return res.redirect(`/category/${categoryId}/edit`);
  }

  const { name } = req.body;
  const updated = await updateCategory(categoryId, name);
  if (updated) {
    req.flash('success', 'Category updated successfully!');
  } else {
    req.flash('error', 'Failed to update category.');
  }
  res.redirect(`/category/${categoryId}`);
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

export {
  showCategoriesPage,
  showCategoryDetailsPage,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  showAssignCategoryForm,
  processAssignCategoriesForm,
  categoryValidation
};