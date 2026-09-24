import db from './db.js'

const getAllProjectsWithOrganizations = async() => {
  const query = `
    SELECT o.organization_id AS "organizationId",
      o.name,
      o.description AS "organizationDescription",
      o.contact_email AS "contactEmail",
      o.logo_filename AS "logoFilename",
      p.project_id AS "projectId",
      p.title AS "projectTitle",
      p.description AS "projectDescription",
      p.location,
      p.date
    FROM public.organizations o
    JOIN public.projects p ON o.organization_id = p.organization_id
    ORDER BY p.date ASC;
  `;

  const result = await db.query(query);

  return result.rows;
}

const getUpcomingProjects = async (numberOfProjects) => {
  const query = `
    SELECT o.organization_id AS "organizationId",
      o.name,
      o.description AS "organizationDescription",
      o.contact_email AS "contactEmail",
      o.logo_filename AS "logoFilename",
      p.project_id AS "projectId",
      p.title AS "projectTitle",
      p.description AS "projectDescription",
      p.location,
      p.date
    FROM public.organizations o
    JOIN public.projects p ON o.organization_id = p.organization_id
    WHERE p.date >= CURRENT_DATE
    ORDER BY p.date ASC
    LIMIT $1;
  `;

  const queryParams = [numberOfProjects];
  const result = await db.query(query, queryParams);

  return result.rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
    SELECT
      project_id AS "projectId",
      organization_id AS "organizationId",
      title,
      description,
      location,
      date
    FROM projects
    WHERE organization_id = $1
    ORDER BY date;
  `;

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const getProjectDetails = async (projectId) => {
  const query = `
    SELECT
      p.project_id AS "projectId",
      p.title,
      p.description,
      p.location,
      p.date,
      o.organization_id AS "organizationId",
      o.name AS "organizationName",
      o.description AS "organizationDescription",
      o.contact_email AS "contactEmail",
      o.logo_filename AS "logoFilename",
      COALESCE(
        json_agg(
          json_build_object('categoryId', c.category_id, 'name', c.name)
          ORDER BY c.name
        ) FILTER (WHERE c.category_id IS NOT NULL),
        '[]'
      ) AS categories
    FROM projects p
    JOIN organizations o ON o.organization_id = p.organization_id
    LEFT JOIN project_categories pc ON pc.project_id = p.project_id
    LEFT JOIN categories c ON c.category_id = pc.category_id
    WHERE p.project_id = $1
    GROUP BY p.project_id, o.organization_id;
  `;

  const queryParams = [projectId];
  const result = await db.query(query, queryParams);

  return result.rows[0];
};

const getProjectsByCategoryId = async (categoryId) => {
  const query = `
    SELECT
      p.project_id AS "projectId",
      p.title,
      p.description,
      p.location,
      p.date
    FROM public.projects p
    JOIN public.organizations o ON o.organization_id = p.organization_id
    JOIN public.project_categories pc ON pc.project_id = p.project_id
    WHERE pc.category_id = $1
    ORDER BY p.date ASC;
  `;

  const queryParams = [categoryId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const createProject = async (title, description, location, date, organizationId) => {
  const query = `
    INSERT INTO projects (title, description, location, date, organization_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id AS "projectId";
  `;

  const queryParams = [title, description, location, date, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Failed to create project');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Created new project with ID:', result.rows[0].projectId);
  }

  return result.rows[0].projectId;
};

export {getAllProjectsWithOrganizations, getUpcomingProjects, getProjectsByOrganizationId, getProjectsByCategoryId, getProjectDetails, createProject};
