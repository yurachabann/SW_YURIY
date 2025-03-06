import express from 'express';
import { viewLogin, doLogin, doLogout, viewRegister, doRegister } from './controllers.js';

const usuariosRouter = express.Router();

usuariosRouter.get('/login', viewLogin);
usuariosRouter.post('/login', doLogin);
usuariosRouter.get('/register', viewRegister);  // Ruta GET para mostrar el formulario de registro
usuariosRouter.post('/register', doRegister);    // Ruta POST para procesar el registro
usuariosRouter.get('/logout', doLogout);

export default usuariosRouter;