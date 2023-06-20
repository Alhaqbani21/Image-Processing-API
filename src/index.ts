import express, { Application } from 'express';
import routes from './routes/router';

const app: Application = express();
const port = 3000;

app.use('/', routes);

app.listen(port, (): void => {
    console.log(`Server running on port http://localhost:${port}`);
});

export default app;
