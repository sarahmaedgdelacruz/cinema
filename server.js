// // app.js (Express version)
// const express = require('express');
// const path = require('path');
// const fs = require('fs');

// const app = express();
// const PORT = 7890;

// // -------- Middlewares
// // Parse application/x-www-form-urlencoded (for your form POST)
// app.use(express.urlencoded({ extended: true }));

// // Serve static assets
// // e.g., /stylesheets/style.css -> ./stylesheets/style.css
// app.use('/stylesheets', express.static(path.join(__dirname, 'stylesheets')));
// app.use('/images', express.static(path.join(__dirname, 'images')));
// app.use('/static', express.static(path.join(__dirname, 'static')));

// // -------- Helpers
// function sendNotFound(res) {
//   const notFound = path.join(__dirname, 'views', '404.html');
//   if (fs.existsSync(notFound)) {
//     return res.status(404).sendFile(notFound);
//   }
//   return res.status(404).type('text/plain').send('404 Not Found');
// }

// function sendInternalError(res) {
//   return res.status(500).type('text/plain').send('Internal Server Error');
// }

// function escapeHtml(str) {
//   return String(str)
//     .replace(/&/g, '&amp;')
//     .replace(/</g, '&lt;')
//     .replace(/>/g, '&gt;')
//     .replace(/"/g, '&quot;')
//     .replace(/'/g, '&#39;');
// }

// // Utility to safely send a file if it exists (replaces your serveFile)
// function safeSendFile(res, filePath, statusCode = 200) {
//   fs.stat(filePath, (err, stats) => {
//     if (err || !stats.isFile()) return sendNotFound(res);
//     res.status(statusCode).sendFile(filePath);
//   });
// }

// // -------- Routes (converted from your if/else)
// // Home / Welcome
// app.get(['/', '/welcome', '/welcome.html'], (req, res) => {
//   safeSendFile(res, path.join(__dirname, 'views', 'welcome.html'));
// });

// // Movies
// app.get(['/movies', '/movies.html'], (req, res) => {
//   safeSendFile(res, path.join(__dirname, 'views', 'movies.html'));
// });

// // Theaters
// app.get(['/theaters', '/theaters.html'], (req, res) => {
//   safeSendFile(res, path.join(__dirname, 'views', 'theaters.html'));
// });

// // Form
// app.get(['/form.html', '/form', '/movies/new'], (req, res) => {
//   safeSendFile(res, path.join(__dirname, 'views', 'form.html'));
// });

// // Handle POST from the form (/submit)
// app.post('/submit', (req, res) => {
//   const title = req.body?.title || 'Untitled';
//   res
//     .status(200)
//     .type('text/html')
//     .send(`<!doctype html>
// <html><head><meta charset="utf-8"><title>Submitted</title></head>
// <body>
//   <h1>Movie submitted</h1>
//   <p>Title: ${escapeHtml(title)}</p>
//   <p><a href="/movies">Back to Movies</a></p>
// </body></html>`);
// });

// // Optional: serve any direct *.html under /views (e.g., /foo.html)
// app.get(/^\/[^?]*\.html$/, (req, res) => {
//   const file = path.join(__dirname, 'views', path.basename(req.path));
//   safeSendFile(res, file);
// });

// // -------- 404 fallback (last)
// app.use((req, res) => sendNotFound(res));

// // -------- Error handler (500)
// app.use((err, req, res, next) => {
//   console.error(err);
//   sendInternalError(res);
// });

// // -------- Start server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });




const express = require('express');
const path = require('path');

const app = express();
const PORT = 8000; // per assignment

// One-liner: serve everything inside /static at the root URL
app.use(express.static(path.join(__dirname, 'static')));

// // (Optional) custom 404 if file not found — still no views folder
// app.use((req, res) => {
//   res.status(404).type('text/plain').send('404 Not Found');
// });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
