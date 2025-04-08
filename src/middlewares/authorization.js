import jsonwebtoken from "jsonwebtoken"
import dotenv from "dotenv";


dotenv.config();

function permitirAcceso(tiposPermitidos) {
    return (req, res, next) => {
        const usuario = revisarCookie(req, res);
        
        if (!usuario) {
            return res.redirect("/");  // Redirigir si no está autenticado
        }

        console.log("Tipo de Usuario:", usuario.tipo);

        if (!tiposPermitidos.includes(usuario.tipo)) {
            return res.status(403).send("Acceso denegado"); // Denegar acceso si el tipo no está permitido
        }

        next();  // Si el usuario tiene permiso, continuar
    };
}



function soloPublico(req,res,next){
    const logueado = revisarCookie(req,res);
    if (!logueado)return next();
    return res.redirect("/admin");   
}




function revisarCookie(req, res) {
    try {
        const cookieJWT = req.headers.cookie?.split("; ").find(cookie => cookie.startsWith("jwt="))?.slice(4);
        if (!cookieJWT) return null;

        const usuario = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
        return usuario; // Devolver el objeto usuario completo
    } catch (error) {
        console.error("Error verificando cookie JWT:", error);
        return null;
    }
}



export const methods = {
    permitirAcceso,
    soloPublico
}