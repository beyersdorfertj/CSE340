import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllProjectsWithOrganizations } from './src/models/projects.js';
import { getAllCategories } from './src/models/categories.js';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
  * Configure Express middleware
  */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

// Middleware to log all incoming requests
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next(); // Pass control to the next middleware or route
});

/**
  * Routes
  */
const renderHome = async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
};

const renderOrganizations = async (req, res) => {
  try {
    const title = 'Our Partner Organizations';
    const organizations = await getAllOrganizations();
    res.render('organizations', { title, organizations});
  } catch (error) {
    console.error('Error loading organizations:', error);
    res.status(500).send('Unable to load organizations. Check your database connection on Render.');
  }
};

const renderProjects = async (req, res) => {
  try {
    const title = 'Service Projects';
    const projects = await getAllProjectsWithOrganizations();
    res.render('projects', { title, projects });
  } catch (error) {
    console.error('Error loading projects:', error);
    res.status(500).send('Unable to load projects. Check your database connection on Render.');
  }
};

const renderCategories = async (req, res) => {
  try {
    const title = 'Service Categories';
    const categories = await getAllCategories();
    res.render('categories', { title, categories });
  } catch (error) {
    console.error('Error loading categories:', error);
    res.status(500).send('Unable to load categories. Check your database connection on Render.');
  }
};

app.get('/', renderHome);
app.get('/organizations', renderOrganizations);
app.get('/projects', renderProjects);
app.get('/categories', renderCategories);

const startServer = () => {
  const server = app.listen(PORT, async () => {
    try {
      await testConnection();
      console.log(`Server is running at http://127.0.0.1:${PORT}`);
      console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Is another server already running?`);
      console.error(`Check with: Get-NetTCPConnection -LocalPort ${PORT} -State Listen`);
    } else {
      console.error('Server error:', error);
    }
    process.exit(1); // exit cleanly instead of hanging silently
  });
};

startServer();