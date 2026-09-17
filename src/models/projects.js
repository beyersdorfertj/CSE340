import db from './db.js'

const getAllProjectsWithOrganizations = async() => {
  const query = `
    SELECT o.organization_id,
      o.name,
      o.description AS organization_description,
      o.contact_email,
      o.logo_filename,
      p.project_id,
      p.title AS project_title,
      p.description AS project_description,
      p.location,
      p.date
    FROM public.organizations o
    JOIN public.projects p ON o.organization_id = p.organization_id;
  `;

  const result = await db.query(query);

  return result.rows;
}

const getUpcomingProjects = async (number_of_projects) => {
  const query = `
    SELECT o.organization_id,
      o.name,
      o.description AS organization_description,
      o.contact_email,
      o.logo_filename,
      p.project_id,
      p.title AS project_title,
      p.description AS project_description,
      p.location,
      p.date
    FROM public.organizations o
    JOIN public.projects p ON o.organization_id = p.organization_id
    WHERE p.date >= CURRENT_DATE
    ORDER BY p.date ASC
    LIMIT $1;
  `;

  const queryParams = [number_of_projects];
  const result = await db.query(query, queryParams);

  return result.rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
    SELECT
      project_id,
      organization_id,
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
      p.project_id,
      p.title,
      p.description,
      p.location,
      p.date,
      o.organization_id,
      o.name AS organization_name,
      o.description AS organization_description,
      o.contact_email,
      o.logo_filename,
      COALESCE(
        json_agg(
          json_build_object('category_id', c.category_id, 'name', c.name)
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
      p.project_id,
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

export {getAllProjectsWithOrganizations, getUpcomingProjects, getProjectsByOrganizationId, getProjectsByCategoryId, getProjectDetails};