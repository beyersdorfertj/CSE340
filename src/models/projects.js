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

export {getAllProjectsWithOrganizations, getProjectsByOrganizationId};