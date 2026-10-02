import { addVolunteer, removeVolunteer } from '../models/volunteers.js';

const addVolunteerSignup = async (req, res) => {
  const projectId = parseInt(req.params.id, 10) || 0;
  const userId = req.session.user.userId;

  try {
    const added = await addVolunteer(userId, projectId);
    if (added) {
      req.flash('success', 'You are now volunteering for this project!');
    } else {
      req.flash('info', 'You are already volunteering for this project.');
    }
  } catch (error) {
    console.error('Error adding volunteer:', error);
    req.flash('error', 'There was an error signing you up for this project.');
  }

  res.redirect(`/project/${projectId}`);
};

const removeVolunteerSignup = async (req, res) => {
  const projectId = parseInt(req.params.id, 10) || 0;
  const userId = req.session.user.userId;

  // Where to return to afterwards: the dashboard sends redirectTo, the project
  // details page falls back to itself. Only allow known in-app targets.
  // Note: in Express 5 req.body is undefined when no body was parsed.
  const redirectTo = req.body?.redirectTo === '/dashboard'
    ? '/dashboard'
    : `/project/${projectId}`;

  try {
    const removed = await removeVolunteer(userId, projectId);
    if (removed) {
      req.flash('success', 'You have been removed as a volunteer for this project.');
    } else {
      req.flash('info', 'You were not signed up as a volunteer for this project.');
    }
  } catch (error) {
    console.error('Error removing volunteer:', error);
    req.flash('error', 'There was an error removing you from this project.');
  }

  res.redirect(redirectTo);
};

export { addVolunteerSignup, removeVolunteerSignup };
