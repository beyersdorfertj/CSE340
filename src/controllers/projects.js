export async function showProjectsPage(req, res) {
  const title = 'Service Projects';
  const projects = await getAllProjectsWithOrganizations();
  res.render('projects', { title, projects });
}