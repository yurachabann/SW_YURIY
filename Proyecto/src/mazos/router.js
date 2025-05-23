import express from 'express';
import { body } from 'express-validator';
import { viewAddMazo, doAddMazo, viewModificarMazo, doModificarMazo, viewEliminarMazo, doEliminarMazo, gestionarMazos,
 doEliminarMazoAdmin, viewEliminarMazoAdmin, doEliminarMazosUsuario, administrarMazos, preModificarMazo, modificarMazoConRelleno, viewEliminarMazos

} from './controllers.js';

const mazosRouter = express.Router();

mazosRouter.get('/eliminarMazo', viewEliminarMazo);
//mazosRouter.post('/eliminarMazo', doEliminarMazo);

mazosRouter.post(
  '/eliminarMazo',
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Debes seleccionar un mazo para eliminar'),
  doEliminarMazo
);

mazosRouter.get('/gestionarMazos', gestionarMazos);
mazosRouter.get('/modificarMazoAdmin', viewModificarMazo);
mazosRouter.get('/eliminarMazoAdmin', viewEliminarMazoAdmin);
//mazosRouter.post('/eliminarMazoAdmin', doEliminarMazoAdmin);
mazosRouter.post(
  '/eliminarMazoAdmin',
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Debes seleccionar un mazo para eliminar'),
  doEliminarMazoAdmin
);
mazosRouter.get('/eliminarMazos', viewEliminarMazos);
//mazosRouter.post('/eliminarMazos', doEliminarMazosUsuario);
mazosRouter.post(
  '/eliminarMazos',
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Debes seleccionar un usuario para eliminar sus mazos'),
  doEliminarMazosUsuario
);
mazosRouter.get('/administrarMazos', administrarMazos);
mazosRouter.get('/preModificarMazo', preModificarMazo);
//mazosRouter.post('/preModificarMazo', modificarMazoConRelleno);

mazosRouter.post(
  '/preModificarMazo',
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('Debes seleccionar un mazo para modificar'),
  modificarMazoConRelleno
);

mazosRouter.get('/addMazo', viewAddMazo);
mazosRouter.post('/addMazo', doAddMazo);
mazosRouter.get('/modificarMazo', viewModificarMazo);
mazosRouter.post('/modificarMazo', doModificarMazo);
export default mazosRouter;