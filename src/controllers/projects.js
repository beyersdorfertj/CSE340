import { getUpcomingProjects, getAllProjectsWithOrganizations, getProjectDetails } from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

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

export { showProjectsPage, showProjectDetailsPage };