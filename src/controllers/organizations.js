import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

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

export { showOrganizationsPage, showOrganizationDetailsPage };