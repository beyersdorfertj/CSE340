import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';

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
    const title = 'Our Partner Organizations';
    res.render('organizations', { title });
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
  app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  });
};

startServer();