const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 7890;

function sendInternalError(res) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
}

function serveFile(res, filePath, contentType, statusCode = 200) {
    fs.stat(filePath, function (err, stats) {
        if (err || !stats.isFile()) {
            const notFound = path.join(__dirname, 'views', '404.html');
            if (fs.existsSync(notFound)) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                fs.createReadStream(notFound).pipe(res);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            }
            return;
        }

        res.writeHead(statusCode, { 'Content-Type': contentType });
        const stream = fs.createReadStream(filePath);
        stream.on('error', function () {
            sendInternalError(res);
        });
        stream.pipe(res);
    });
}

function getContentTypeByExt(ext) {
    switch (ext.toLowerCase()) {
        case '.css': return 'text/css';
        case '.js': return 'application/javascript';
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.png': return 'image/png';
        case '.gif': return 'image/gif';
        case '.svg': return 'image/svg+xml';
        case '.html': return 'text/html';
        default: return 'application/octet-stream';
    }
}

const server = http.createServer(function (request, response) {
    const rawUrl = request.url || '/';
    const pathname = rawUrl.split('?')[0];

    // Handle POST from the form
    if (request.method === 'POST' && pathname === '/submit') {
        let body = '';
        request.on('data', chunk => { body += chunk.toString(); });
        request.on('end', () => {
            // parse application/x-www-form-urlencoded
            const params = new URLSearchParams(body);
            const title = params.get('title') || 'Untitled';

            // Simple response - could be extended to persist data
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(`<!doctype html><html><head><meta charset="utf-8"><title>Submitted</title></head><body><h1>Movie submitted</h1><p>Title: ${escapeHtml(title)}</p><p><a href="/movies">Back to Movies</a></p></body></html>`);
        });
        return;
    }

    // Serve HTML pages by explicit routes
    if (pathname === '/' || pathname === '/welcome' || pathname === '/welcome.html') {
        serveFile(response, path.join(__dirname, 'views', 'welcome.html'), 'text/html');
        return;
    }

    if (pathname === '/movies' || pathname === '/movies.html') {
        serveFile(response, path.join(__dirname, 'views', 'movies.html'), 'text/html');
        return;
    }

    if (pathname === '/theaters' || pathname === '/theaters.html') {
        serveFile(response, path.join(__dirname, 'views', 'theaters.html'), 'text/html');
        return;
    }

    if (pathname === '/form.html' || pathname === '/form' || pathname === '/movies/new') {
        serveFile(response, path.join(__dirname, 'views', 'form.html'), 'text/html');
        return;
    }

    // Serve static files: stylesheets and images
    if (pathname === '/stylesheets/style.css' || pathname === '/style.css') {
        serveFile(response, path.join(__dirname, 'stylesheets', 'style.css'), 'text/css');
        return;
    }

    if (pathname.startsWith('/images/')) {
        // strip any leading slashes so path.join works correctly on Windows
        const imgRelative = pathname.replace(/^\/+/,'').replace(/^\/+/, '');
        const imgPath = path.join(__dirname, imgRelative);
        const ext = path.extname(imgPath) || '.jpg';
        const contentType = getContentTypeByExt(ext);
        serveFile(response, imgPath, contentType);
        return;
    }

    // Fallback: attempt to serve matching file in views or return 404
    // If someone requests /foo.html directly and it exists in views, serve it
    if (pathname.endsWith('.html')) {
        const file = path.join(__dirname, 'views', path.basename(pathname));
        serveFile(response, file, 'text/html');
        return;
    }

    // Default 404
    serveFile(response, path.join(__dirname, 'views', '404.html'), 'text/html', 404);
});

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
