import { getAllOrganizations } from '../models/organizations.js';

export async function showOrganizationsPage(req, res) {
  const title = 'Our Partner Organizations';
  const organizations = await getAllOrganizations();
  res.render('organizations', { title, organizations });
}