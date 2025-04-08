import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios"; // Importamos axios para hacer la petición HTTP

dotenv.config();

async function login(req, res) {
    const { codigo, password } = req.body;

    if (!codigo || !password) {
        return res.status(400).send({ status: "error", message: "Faltan datos" });
    }

    try {
        // 1️⃣ Hacemos la petición a la API externa para obtener los datos del usuario
        const response = await axios.get(`http://localhost:4000/api/estudiante/${codigo}`);

        // 2️⃣ Verificamos si la API devolvió datos
        if (!response.data) {
            return res.status(400).send({ status: "error", message: "Usuario no encontrado" });
        }

        const usuarioRevisar = response.data;

        // 3️⃣ Validamos la contraseña con bcryptjs
        const loginValido = await bcryptjs.compare(password, usuarioRevisar.password);
        if (!loginValido) {
            return res.status(400).send({ status: "error", message: "Contraseña incorrecta" });
        }

        // 4️⃣ Generamos el token JWT con los datos del usuario
        const token = jsonwebtoken.sign(
            { 
                user: usuarioRevisar.codigo, 
                nombre: usuarioRevisar.nombre, 
                tipo: usuarioRevisar.tUsuario,
                creditos: usuarioRevisar.creditosAprobados // Incluimos créditos si es estudiante
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // 5️⃣ Guardamos el token en una cookie
        const cookieOption = {
            expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
            path: "/"
        };

        res.cookie("jwt", token, cookieOption);
        res.status(200).send({ status: "ok", message: "Login exitoso", redirect: "/admin" });

    } catch (error) {
        console.error("Error al consultar la API:", error.message);
        return res.status(500).send({ status: "error", message: "Error en el servidor al consultar la API" });
    }
}

export const methods = {
     login 
    };
