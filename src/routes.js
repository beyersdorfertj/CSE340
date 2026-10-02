import express from 'express';

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
import {
  showUserRegistrationForm, processUserRegistrationForm,
  showDashboard, showUsersPage, requireLogin, requireRole,
  showLoginForm, processLoginForm, processLogout
} from './controllers/users.js';

const router = express.Router();

// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);

// organization routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/organization/new', requireRole('admin'), showNewOrganizationForm);
router.post('/organization/new', requireRole('admin'), organizationValidation, processNewOrganizationForm);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/organization/:id/edit', requireRole('admin'), showEditOrganizationForm);
router.post('/organization/:id/edit', requireRole('admin'), organizationValidation, processEditOrganizationForm);

// project routes
router.get('/projects', showProjectsPage);
router.get('/project/new', requireRole('admin'), showNewProjectForm);
router.post('/project/new', requireRole('admin'), projectValidation, processNewProjectForm);
router.get('/project/:id', showProjectDetailsPage);
router.get('/project/:id/assign-categories', requireRole('admin'), showAssignCategoryForm);
router.post('/project/:id/assign-categories', requireRole('admin'), processAssignCategoriesForm);
router.get('/project/:id/edit', requireRole('admin'), showEditProjectForm);
router.post('/project/:id/edit', requireRole('admin'), projectValidation, processEditProjectForm);

// category routes
router.get('/categories', showCategoriesPage);
router.get('/category/new', requireRole('admin'), showNewCategoryForm);
router.post('/category/new', requireRole('admin'), categoryValidation, processNewCategoryForm);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/category/:id/edit', requireRole('admin'), showEditCategoryForm);
router.post('/category/:id/edit', requireRole('admin'), categoryValidation, processEditCategoryForm);

// user routes
router.get('/users', requireRole('admin'), showUsersPage);

router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// error-handling routes
router.get('/test-error', showTestErrorPage);

export default router;