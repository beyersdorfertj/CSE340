import db from './db.js'

const getAllCategories = async() => {
  const query = `
    SELECT category_id, name
    FROM public.categories;
  `;

  const result = await db.query(query);

  return result.rows;
}

const getCategoryById = async(categoryId) => {
  const query = `
    SELECT category_id, name
    FROM public.categories
    WHERE category_id = $1;
  `;

  const result = await db.query(query, [categoryId]);

  return result.rows[0];
};

const getCategoriesByProjectId = async(projectId) => {
  const query = `
    SELECT c.category_id, c.name
    FROM public.categories c
    INNER JOIN public.project_categories pc on pc.category_id = c.category_id
    WHERE pc.project_id = $1;
  `;

  const result = await db.query(query, [projectId]);

  return result.rows;
};

export {getAllCategories, getCategoryById, getCategoriesByProjectId};