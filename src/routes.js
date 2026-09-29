import express from 'express';
import { showLoginForm, processLoginForm, processLogout } from './controllers/users.js';

import {
  showCategoriesPage, showCategoryDetailsPage,
  showNewCategoryForm, processNewCategoryForm,
  showEditCategoryForm, processEditCategoryForm,
  showAssignCategoryForm, processAssignCategoriesForm,
  categoryValidation
} from './controllers/categories.js';
import { showTestErrorPage } from './controllers/errors.js';
import { showHomePage } from './controllers/index.js';
import {
  showOrganizationsPage, showOrganizationDetailsPage,
  showNewOrganizationForm, processNewOrganizationForm,
  showEditOrganizationForm, processEditOrganizationForm,
  organizationValidation
} from './controllers/organizations.js';
import {
  showProjectsPage, showProjectDetailsPage,
  showNewProjectForm, processNewProjectForm,
  showEditProjectForm, processEditProjectForm,
  projectValidation
} from './controllers/projects.js';
import { showUserRegistrationForm, processUserRegistrationForm, showDashboard, requireLogin } from './controllers/users.js';

const router = express.Router();

// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);

// organization routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/organization/new', showNewOrganizationForm);
router.post('/organization/new', organizationValidation, processNewOrganizationForm);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/organization/:id/edit', showEditOrganizationForm);
router.post('/organization/:id/edit', organizationValidation, processEditOrganizationForm);

// project routes
router.get('/projects', showProjectsPage);
router.get('/project/new', showNewProjectForm);
router.post('/project/new', projectValidation, processNewProjectForm);
router.get('/project/:id', showProjectDetailsPage);
router.get('/project/:id/assign-categories', showAssignCategoryForm);
router.post('/project/:id/assign-categories', processAssignCategoriesForm);
router.get('/project/:id/edit', showEditProjectForm);
router.post('/project/:id/edit', projectValidation, processEditProjectForm);

// category routes
router.get('/categories', showCategoriesPage);
router.get('/category/new', showNewCategoryForm);
router.post('/category/new', categoryValidation, processNewCategoryForm);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/category/:id/edit', showEditCategoryForm);
router.post('/category/:id/edit', categoryValidation, processEditCategoryForm);

router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// error-handling routes
router.get('/test-error', showTestErrorPage);

export default router;