import express from 'express';
import { body } from 'express-validator';
import { viewCreateCard, doCreateCard, doModifyCard, viewEliminateCard, doEliminateCard, doEliminateCardsUsuario, administrarCartas, viewGestionarCartas, preModificarCard,
    modificarCartaConRelleno, viewEliminateCardsUsuario, viewAddCardInventario, viewAddCardInventarioEstandar, doAddCardInventarioEstandar,
    viewAddCardInventarioCustom, doAddCardInventarioCustom, viewAddCardInventarioTodos, doAddCardInventarioTodos, viewRemoveCardInventario, doRemoveCardInventario

} from './controllers.js';

import { uploadImg } from '../../static/js/upload.js';
const cartasRouter = express.Router();

cartasRouter.get('/createCard', viewCreateCard);

cartasRouter.post(
  '/createCard',
  uploadImg.single('imagen'),
  // validaciones:
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio'),
  body('vida')
    .trim()
    .isInt({ min: 1, max: 1000 })
    .withMessage('La vida debe estar entre 1 y 1000'),
  body('rareza')
    .trim()
    .isInt({ min: 1, max: 4 })
    .withMessage('La rareza debe ser entre 1 y 4'),
  doCreateCard
);
  
cartasRouter.post(
  '/modificarCard',
  uploadImg.single('imagen'),
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('No sabemos cuál es la carta a modificar'),
  body('nombre2')
    .optional({ checkFalsy: true })
    .trim()
    .notEmpty()
    .withMessage('El nuevo nombre, de llegar, no puede estar vacío'),
  body('rareza')
    .trim()
    .isInt({ min: 1, max: 4 })
    .withMessage('La rareza debe ser un valor entre 1 y 4'),
  body('vida')
    .trim()
    .isInt({ min: 1, max: 1000 })
    .withMessage('La vida debe estar entre 1 y 1000'),
  doModifyCard
);
  
cartasRouter.get('/addCardInventario', viewAddCardInventario);
cartasRouter.get('/eliminarCarta', viewEliminateCard);
//cartasRouter.post('/eliminarCarta', doEliminateCard);
//cartasRouter.post('/eliminarCartas', doEliminateCardsUsuario);
cartasRouter.post(
  '/eliminarCarta',
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Debes seleccionar una carta'), 
  doEliminateCard
);

cartasRouter.get('/eliminarCartas', viewEliminateCardsUsuario);

cartasRouter.post(
  '/eliminarCartas',
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Debes seleccionar un usuario'),
  doEliminateCardsUsuario
);

cartasRouter.get('/administrarCartas', administrarCartas);
cartasRouter.get('/gestionarCartas', viewGestionarCartas);
cartasRouter.get('/preModificarCard', preModificarCard);
//cartasRouter.post('/preModificarCard', modificarCartaConRelleno);

cartasRouter.post(
  '/preModificarCard',
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('Debes seleccionar una carta para modificar'),
  modificarCartaConRelleno
);

cartasRouter.get('/addCardInventarioEstandar', viewAddCardInventarioEstandar);

cartasRouter.get('/addCardInventarioCustom', viewAddCardInventarioCustom);
cartasRouter.post('/addCardInventarioCustom', doAddCardInventarioCustom);
cartasRouter.post('/addCardInventarioEstandar', doAddCardInventarioEstandar);

cartasRouter.get('/addCardInventarioTodos', viewAddCardInventarioTodos);
cartasRouter.post('/addCardInventarioTodos', doAddCardInventarioTodos);
cartasRouter.get('/removeCardInventario', viewRemoveCardInventario);
//cartasRouter.post('/removeCardInventario', doRemoveCardInventario);
cartasRouter.post(
  '/removeCardInventario',
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Debes seleccionar una carta'),
  doRemoveCardInventario
);

export default cartasRouter;