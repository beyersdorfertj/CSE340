import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';

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
    console.log(organizations);
    res.render('organizations', { title, organizations});
  } catch (error) {
    console.error('Error loading organizations:', error);
    res.status(500).send('Unable to load organizations. Check your database connection on Render.');
  }
};

const renderProjects = async (req, res) => {
    const title = 'Service Projects';
    res.render('projects', { title });
};

const renderCategories = async (req, res) => {
    const title = 'Service Categories';
    res.render('categories', { title });
};

app.get('/', renderHome);
app.get('/organizations', renderOrganizations);
app.get('/projects', renderProjects);
app.get('/categories', renderCategories);

const startServer = () => {
  app.listen(PORT, async () => {
    try {
      await testConnection();
      console.log(`Server is running at http://127.0.0.1:${PORT}`);
      console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  });
};

startServer();