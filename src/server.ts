import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 * For HTML responses, injects window.__env before </head> so the browser-side
 * Supabase client can read credentials without them being baked into the bundle.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then(async (response) => {
      if (!response) return next();

      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.includes('text/html')) {
        return writeResponseToNodeResponse(response, res);
      }

      const html = await response.text();
      const envScript =
        `<script>window['__env']={` +
        `supabaseUrl:'${process.env['SUPABASE_URL'] ?? ''}',` +
        `supabaseKey:'${process.env['SUPABASE_KEY'] ?? ''}'};</script>`;
      const modified = html.replace('</head>', `${envScript}</head>`);

      res.status(response.status);
      response.headers.forEach((value, key) => {
        // Skip content-length — the injected script changes the byte count
        if (key.toLowerCase() !== 'content-length') {
          res.setHeader(key, value);
        }
      });
      res.send(modified);
    })
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
