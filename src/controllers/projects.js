import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
  const title = 'Upcoming Service Projects';
  const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
  res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
  const { id } = req.params;
  const project = await getProjectDetails(id);
  const title = project.title;
  res.render('project', { title, project });
};

export { showProjectsPage, showProjectDetailsPage };