import db from './db.js'

const getAllCategories = async() => {
  const query = `
    SELECT category_id AS "categoryId", name
    FROM public.categories;
  `;

  const result = await db.query(query);

  return result.rows;
}

const getCategoryById = async(categoryId) => {
  const query = `
    SELECT category_id AS "categoryId", name
    FROM public.categories
    WHERE category_id = $1;
  `;

  const result = await db.query(query, [categoryId]);

  return result.rows[0];
};

const getCategoriesByProjectId = async(projectId) => {
  const query = `
    SELECT c.category_id AS "categoryId", c.name
    FROM public.categories c
    INNER JOIN public.project_categories pc on pc.category_id = c.category_id
    WHERE pc.project_id = $1;
  `;

  const result = await db.query(query, [projectId]);

  return result.rows;
};

const assignCategoryToProject = async(projectId, categoryId) => {
  const query = `
    INSERT INTO public.project_categories (project_id, category_id)
    VALUES ($1, $2);
  `;
  await db.query(query, [projectId, categoryId]);
};

const updateCategoryAssignements = async(projectId, categoryIds) => {
  const deleteQuery = `
    DELETE FROM public.project_categories
    WHERE project_id = $1;
  `;
  await db.query(deleteQuery, [projectId]);

  for (const categoryId of categoryIds) {
    await assignCategoryToProject(projectId, categoryId);
  }
};

export {getAllCategories, getCategoryById, getCategoriesByProjectId, updateCategoryAssignements};
