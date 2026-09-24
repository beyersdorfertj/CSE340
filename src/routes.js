import express from 'express';

import { showHomePage } from './controllers/index.js';
import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  showEditOrganizationForm,
  processEditOrganizationForm,
  organizationValidation
} from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage, showAssignCategoryForm, processAssignCategoriesForm } from './controllers/categories.js';
import { showTestErrorPage } from './controllers/errors.js';

const router = express.Router();

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

// category routes
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// error-handling routes
router.get('/test-error', showTestErrorPage);

export default router;