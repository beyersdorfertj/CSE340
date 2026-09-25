import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import session from 'express-session';
import flash from './src/middleware/flash.js';
import { testConnection } from './src/models/db.js';
import router from './src/routes.js';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;

// Fail fast with a clear message if required configuration is missing.
// Without this, a missing SESSION_SECRET makes express-session throw on every
// request, which surfaces only as a generic "Internal Server Error".
const REQUIRED_ENV = ['SESSION_SECRET', 'DB_URL'];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`FATAL: Missing required environment variable(s): ${missingEnv.join(', ')}`);
  console.error('Set these in your hosting environment (e.g. Render > Environment) or in a local .env file.');
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
  * Configure Express middleware
  */

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // Session expires after 1 hour of inactivity
}));

// Allow Express to receive and process common POST data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));  // Serve static files from the public directory
app.set('view engine', 'ejs');  // Set EJS as the templating engine
app.set('views', path.join(__dirname, 'src/views'));  // Tell Express where to find your templates

// Middleware to log all incoming requests and to make NODE_ENV available to all templates
app.use((req, res, next) => {
  if (NODE_ENV === 'development') {
    console.log(`${req.method} ${req.url}`);
  }
  res.locals.NODE_ENV = NODE_ENV;
  next(); // Pass control to the next middleware or route
});

app.use(flash);  // Use flash message middleware
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

  // Prepare data for the template. NODE_ENV is passed explicitly because the
  // res.locals middleware may not have run if the error happened earlier in the
  // middleware chain (e.g. a failing session middleware).
  const context = {
    title: status === 404 ? 'Page Not Found' : 'Server Error',
    error: err.message,
    stack: err.stack,
    NODE_ENV
  };

  // Render the error template, but fall back to a plain-text response if the
  // template itself cannot render (e.g. session/flash is unavailable). This
  // guarantees a meaningful message instead of a bare "Internal Server Error".
  res.status(status).render(`errors/${template}`, context, (renderErr, html) => {
    if (renderErr) {
      console.error('Failed to render error page:', renderErr.message);
      const detail = NODE_ENV === 'development' ? `\n\n${err.stack}` : '';
      res.type('text/plain').send(`${context.title} (${status})\n\n${err.message}${detail}`);
      return;
    }
    res.send(html);
  });
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