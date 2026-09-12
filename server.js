import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import { testConnection } from './src/models/db.js';
import router from './src/routes.js';

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

// Middleware to log all incoming requests and to make NODE_ENV available to all templates
app.use((req, res, next) => {
  if (NODE_ENV === 'development') {
    console.log(`${req.method} ${req.url}`);
  }
  res.locals.NODE_ENV = NODE_ENV;
  next(); // Pass control to the next middleware or route
});

app.use(router);

// Catch-all route for 404 errors
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  // Log error details for debugging
  console.error('Error occurred:', err.message);
  console.error('Stack trace:', err.stack);
    
  // Determine status and template
  const status = err.status || 500;
  const template = status === 404 ? '404' : '500';
    
  // Prepare data for the template
  const context = {
    title: status === 404 ? 'Page Not Found' : 'Server Error',
    error: err.message,
    stack: err.stack
  };
    
  // Render the appropriate error template
  res.status(status).render(`errors/${template}`, context);
});

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