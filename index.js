import helmet from 'helmet';
import express from 'express';
import { config } from 'dotenv';
import userRoutes from './routes/user.js';
import homeRoutes from './routes/home.js';
import sesRoutes from './routes/session.js';
import { getMongoDBConnected } from './dbConfig/MongoDB.js';

config();
getMongoDBConnected();
const app = express();

app.use(helmet());
app.use(express.json());
app.use("/home", homeRoutes);
app.use("/user", userRoutes);
app.use("/session", sesRoutes);

app.get('/', (req, res) => (res.send('Hey; there!')));
const port = process.env.PORT || 3030;

app.listen(port, (error) => {
    console.log(`The app is running on http://localhost:${port}`);
});
