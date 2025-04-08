import express from 'express';
import indexRoutes from './routes/routes.js';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import cors from 'cors';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT;

// Configurar Helmet
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'", "https://cdnjs.cloudflare.com"],
            "style-src": ["'self'", "https://cdnjs.cloudflare.com"],
            "connect-src": ["'self'", "http://localhost:4000", "http://localhost:3000"] // ✅ Permitimos conexiones entre front y back
        }
    }
}));

// Configurar CORS
const corsOptions = {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // ✅ Ahora está correctamente en minúsculas
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(indexRoutes);

app.use(express.static(__dirname + "/public"));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
