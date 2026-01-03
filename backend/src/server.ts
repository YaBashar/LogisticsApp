import express, { json, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from '../config.json';

const app = express();
app.use(json());
app.use(morgan('dev'));
app.use(cors());

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

const PORT: number = parseInt(process.env.port || config.port);
const HOST: string = process.env.host || '127.0.0.1';

const server = app.listen(PORT, HOST, () => {
  console.log(`Server listening on port ${PORT} at host ${HOST}`);
});

app.use((req: Request, res: Response) => {
  const error = `
    Route not found - This could be because:
      0. You have defined routes below (not above) this middleware in server.ts
      1. You have not implemented the route ${req.method} ${req.path}
      2. There is a typo in either your test or server, e.g. /posts/list in one
         and, incorrectly, /post/list in the other
      3. You are using ts-node (instead of ts-node-dev) to start your server and
         have forgotten to manually restart to load the new changes
      4. You've forgotten a leading slash (/), e.g. you have posts/list instead
         of /posts/list in your server.ts or test file
  `;
  res.status(404).json({ error });
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed gracefully');
    process.exit();
  });
});
