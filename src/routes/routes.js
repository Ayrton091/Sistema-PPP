import Router from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();
import { methods as authentication } from "../controllers/auth.conttroller.js";
import { methods as authorization } from "../middlewares/authorization.js";
// Construir la ruta absoluta correctamente

const viewslogin = path.join(__dirname, "..", "views", "login.html");
const viewsregister = path.join(__dirname, "..", "views", "register.html");
const viewsadmin = path.join(__dirname, "..", "views", "admin" , "admin.html");
const viewsSolicitud = path.join(__dirname, "..", "views", "alumno" , "solicitud.html");
const viewsrSolicitudes = path.join(__dirname, "..", "views", "docente" , "rSolicitudes.html");
const viewsnocumple = path.join(__dirname, "..", "views", "nocumple.html");
const imgunas = path.join(__dirname, "..", "public", "assets","images.jpg");

router.use(cookieParser());

router.get("/", (req, res) => {
    res.sendFile(viewslogin);
});
router.get("/registro",authorization.soloPublico, (req, res) => {
    res.sendFile(viewsregister);
});
router.get("/admin",authorization.permitirAcceso(["Administrador"]), (req, res) => {
    res.sendFile(viewsadmin);
});
router.get("/solicitud",/* authorization.permitirAcceso(["Alumno"]),*/(req, res) => {
    res.sendFile(viewsSolicitud);
});
router.get("/Nocumple", authorization.permitirAcceso(["Alumno"]),(req, res) => {
    res.sendFile(viewsnocumple);
});
router.get("/Peticiones",authorization.permitirAcceso(["Docente"]), (req, res) => {
    res.sendFile(viewsrSolicitudes);
});
/*router.post("/api/registro", authentication.register);*/
router.post("/api/login", authentication.login);

export default router;
