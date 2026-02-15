import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { sessionConfig } from './config/session';
import passportConfig from './config/passport';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { env } from './config/env';

const app = express();

app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(sessionConfig);
app.use(passportConfig.initialize());
app.use(passportConfig.session());

app.use('/api', routes);

app.use(errorHandler);

export default app;
