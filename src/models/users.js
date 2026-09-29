import db from './db.js'
import bcrypt from 'bcrypt';


const createUser = async (name, email, passwordHash) => {
  const default_role = 'user';
  const query = `
    INSERT INTO users (name, email, password_hash, role_id) 
    VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
    RETURNING user_id AS "userId"
  `;
  const queryParams = [name, email, passwordHash, default_role];
    
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Failed to create user');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Created new user with ID:', result.rows[0].userId);
  }

  return result.rows[0].userId;
};

const findUserByEmail = async (email) => {
  const query = `
    SELECT u.user_id AS "userId", u.email, u.password_hash AS "passwordHash", r.role_name AS "roleName"
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    WHERE u.email = $1
  `;
  const queryParams = [email];
    
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    return null; // User not found
  }
    
  return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) return null;
  if (!await verifyPassword(password, user.passwordHash)) return null;
  delete user.passwordHash;
  return user;
}

export { createUser, findUserByEmail, verifyPassword, authenticateUser };