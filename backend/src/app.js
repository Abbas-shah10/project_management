import express from 'express';
import cors from 'cors'

const app = express();

// basic configurations
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))


// cors configurations
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', "PUT", 'POST', "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

// import routes
import healthCheckRouter from './routes/healthcheck.routes.js';
import authRouter from './routes/auth.routes.js'

app.use('/api/v1/healthcheck', healthCheckRouter);
app.use('/api/v1/auth', authRouter);

export default app;