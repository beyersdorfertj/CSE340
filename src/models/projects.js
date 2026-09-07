import db from './db.js'

const getAllProjectsWithOrganizations = async() => {
    const query = `
        SELECT o.organization_id,
               o.name,
               o.description AS organization_description,
               o.contact_email,
               o.logo_filename,
               p.project_id,
               p.description AS project_description,
               p.location,
               p.date
        FROM public.organization o
        JOIN public.projects p ON o.organization_id = p.organization_id;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllProjectsWithOrganizations}