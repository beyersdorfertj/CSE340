import { getAllOrganizations, getOrganizationDetails, createOrganization, updateOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// Define validation and sanitization rules for organization form
// Define validation rules for organization form
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
    body('contactEmail')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

const showOrganizationsPage = async (req, res) => {
  const title = 'Our Partner Organizations';
  const organizations = await getAllOrganizations();
  res.render('organizations', { title, organizations });
};

const showOrganizationDetailsPage = async (req, res) => {
  const organizationId = parseInt(req.params.id, 10) || 0;
  const organizationDetails = await getOrganizationDetails(organizationId);
  const projects = await getProjectsByOrganizationId(organizationId);
  const title = organizationDetails ? 'Organization Details' : 'Organization Not Found';
  res.render('organization', {title, organizationDetails, projects});
};

const showNewOrganizationForm = async (req, res) => {
  const title = 'Add New Organization';
  res.render('organizationNew', { title });
};

const processNewOrganizationForm = async (req, res) => {
  // Check for validation errors
  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash('error', error.msg);
    });

    // Redirect back to the new organization form
    return res.redirect('/organization/new');
  }
  const { name, description, contactEmail } = req.body;
  const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations

  const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
  req.flash('success', 'Organization added successfully!');  // Set a success flash message
  res.redirect(`/organization/${organizationId}`);
};

const showEditOrganizationForm = async (req, res) => {
  const organizationId = parseInt(req.params.id, 10) || 0;
  const organizationDetails = await getOrganizationDetails(organizationId);
  if (!organizationDetails) {
    req.flash('error', 'Organization not found');
    return res.redirect('/organizations');
  }
  const title = 'Edit Organization';
  res.render('organizationEdit', { title, organizationDetails });
};

const processEditOrganizationForm = async (req, res) => {
  const organizationId = parseInt(req.params.id, 10) || 0;

  // Check for validation errors
  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash('error', error.msg);
    });

    // Redirect back to the edit organization form
    return res.redirect(`/organization/${organizationId}/edit`);
  }

  const { name, description, contactEmail, logoFilename } = req.body;
  const updated = await updateOrganization(organizationId, name, description, contactEmail, logoFilename);
  if (updated) {
    req.flash('success', 'Organization updated successfully!');
  } else {
    req.flash('error', 'Failed to update organization.');
  }
  res.redirect(`/organization/${organizationId}`);
};

export {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  showEditOrganizationForm,
  processEditOrganizationForm,
  organizationValidation
};