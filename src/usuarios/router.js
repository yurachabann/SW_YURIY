import express from 'express';
import { body } from 'express-validator';
import { viewLogin, doLogin, doLogout, viewRegister, doRegister, aniadirUsuario, viewAdd,  viewEliminate ,eliminateUser,
     administrarUsuarios, viewPreModify, doModify,
     doPreModify

} from './controllers.js';

const usuariosRouter = express.Router();

usuariosRouter.get('/login', viewLogin);
//usuariosRouter.post('/login', doLogin);
usuariosRouter.post(
  '/login',
  body('username')
    .trim()
    .notEmpty()
    .withMessage('El nombre de usuario es obligatorio'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('La contraseña es obligatoria'),
  doLogin
);
usuariosRouter.get('/register', viewRegister);  // Ruta GET para mostrar el formulario de registro
//usuariosRouter.post('/register', doRegister);    // Ruta POST para procesar el registro
usuariosRouter.post(
  '/register',
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre completo es obligatorio'),
  body('usernameRegister')
    .trim()
    .notEmpty()
    .withMessage('El nombre de usuario es obligatorio'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Debes proporcionar un correo válido'),
  body('password1')
    .trim()
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('password2')
    .trim()
    .notEmpty()
    .withMessage('Debes confirmar la contraseña'),
  doRegister
);
usuariosRouter.get('/logout', doLogout);
usuariosRouter.get('/addUser', viewAdd);
//usuariosRouter.post('/addUser', aniadirUsuario);
usuariosRouter.post(
  '/addUser',
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre completo es obligatorio'),

  body('username')
    .trim()
    .notEmpty()
    .withMessage('El nombre de usuario es obligatorio'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Debes proporcionar un correo válido'),

  body('pass')
    .trim()
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),

  body('tipoUsuario')
    .trim()
    .isIn(['A', 'U'])
    .withMessage('Tipo de usuario no válido'),

  aniadirUsuario
);
usuariosRouter.get('/eliminate', viewEliminate);
//usuariosRouter.post('/eliminate', eliminateUser);
usuariosRouter.post(
  '/eliminate',
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Debes seleccionar un usuario'),
  eliminateUser
);
//usuariosRouter.get('/modifyUser', viewModify);
//usuariosRouter.post('/modifyUser', doModify);
usuariosRouter.post(
  '/modifyUser',
  body('username')
    .trim()
    .notEmpty()
    .withMessage('El usuario original es obligatorio'),
  body('usuario2')
    .optional({ checkFalsy: true })
    .trim()
    .notEmpty()
    .withMessage('El nuevo nombre de usuario no puede estar vacío'),
  body('pass2')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 4 })
    .withMessage('La nueva contraseña debe tener al menos 4 caracteres'),
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Debes ingresar un email válido'),
  body('tipoUsuario')
    .isIn(['A', 'U'])
    .withMessage('Tipo de usuario no válido'),
  doModify
);

usuariosRouter.get('/administrarUsuarios', administrarUsuarios);
usuariosRouter.get('/preModifyUser', viewPreModify);
//usuariosRouter.post('/preModifyUser', doPreModify);

usuariosRouter.post(
  '/preModifyUser',
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Debes seleccionar un usuario'),
  doPreModify
);

export default usuariosRouter;