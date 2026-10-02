import db from './db.js'

const addVolunteer = async (userId, projectId) => {
  const query = `
    INSERT INTO project_volunteers (user_id, project_id)
    VALUES ($1, $2)
    ON CONFLICT (project_id, user_id) DO NOTHING
    RETURNING project_id AS "projectId";
  `;
  const queryParams = [userId, projectId];
  const result = await db.query(query, queryParams);

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Added volunteer:', { userId, projectId, inserted: result.rowCount > 0 });
  }

  // rowCount === 0 means the user was already volunteering (ON CONFLICT).
  return result.rowCount > 0;
};

const removeVolunteer = async (userId, projectId) => {
  const query = `
    DELETE FROM project_volunteers
    WHERE user_id = $1 AND project_id = $2
    RETURNING project_id AS "projectId";
  `;
  const queryParams = [userId, projectId];
  const result = await db.query(query, queryParams);

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Removed volunteer:', { userId, projectId, removed: result.rowCount > 0 });
  }

  // rowCount === 0 means there was no signup to remove.
  return result.rowCount > 0;
};

const getProjectsByVolunteer = async (userId) => {
  const query = `
    SELECT
      p.project_id AS "projectId",
      p.title,
      p.date,
      o.organization_id AS "organizationId",
      o.name AS "organizationName"
    FROM project_volunteers pv
    JOIN projects p ON p.project_id = pv.project_id
    JOIN organizations o ON o.organization_id = p.organization_id
    WHERE pv.user_id = $1
    ORDER BY p.date ASC;
  `;
  const queryParams = [userId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const isUserVolunteering = async (userId, projectId) => {
  const query = `
    SELECT 1
    FROM project_volunteers
    WHERE user_id = $1 AND project_id = $2
    LIMIT 1;
  `;
  const queryParams = [userId, projectId];
  const result = await db.query(query, queryParams);

  return result.rowCount > 0;
};

export { addVolunteer, removeVolunteer, getProjectsByVolunteer, isUserVolunteering };
