import { getUpcomingProjects, getAllProjectsWithOrganizations, getProjectDetails, createProject } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

const showProjectsPage = async (req, res) => {
  const upcomingOnly = req.query.upcoming === 'true';
  const projects = upcomingOnly
    ? await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS)
    : await getAllProjectsWithOrganizations();
  const title = upcomingOnly ? 'Upcoming Service Projects' : 'All Service Projects';
  res.render('projects', { title, projects, upcomingOnly });
};

const showProjectDetailsPage = async (req, res) => {
  const id = parseInt(req.params.id, 10) || 0;
  const project = await getProjectDetails(id);
  const title = project ? project.title : 'Project Not Found';
  res.render('project', { title, project });
};

const showNewProjectForm = async (req, res) => {
  const title = 'Add New Service Project';
  const organizations = await getAllOrganizations();
  res.render('projectNew', { title, organizations });
};

const processNewProjectForm = async (req, res) => {
  const { title, description, location, date, organizationId } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Loop through validation errors and flash them
    errors.array().forEach((error) => {
      req.flash('error', error.msg);
    });

    // Redirect back to the new project form
    return res.redirect('/project/new');
  }

  try {
    const newProjectId = await createProject(title, description, location, date, organizationId);
    req.flash('success', 'New service project created successfully!');
    res.redirect(`/projects`);
  } catch (error) {
    console.error('Error creating new project:', error);
    req.flash('error', 'There was an error creating the service project.');
    res.redirect('/project/new');
  }
};

export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation };