import express from 'express';
import { viewLogin, doLogin, doLogout, viewRegister, doRegister, aniadirUsuario, viewAdd,  viewEliminate ,eliminateUser, viewModify, doModify} from './controllers.js';

const usuariosRouter = express.Router();

usuariosRouter.get('/login', viewLogin);
usuariosRouter.post('/login', doLogin);
usuariosRouter.get('/register', viewRegister);  // Ruta GET para mostrar el formulario de registro
usuariosRouter.post('/register', doRegister);    // Ruta POST para procesar el registro
usuariosRouter.get('/logout', doLogout);
usuariosRouter.get('/addUser', viewAdd);
usuariosRouter.post('/addUser', aniadirUsuario);
usuariosRouter.get('/eliminate', viewEliminate);
usuariosRouter.post('/eliminate', eliminateUser);
usuariosRouter.get('/modifyUser', viewModify);
usuariosRouter.post('/modifyUser', doModify);

export default usuariosRouter;