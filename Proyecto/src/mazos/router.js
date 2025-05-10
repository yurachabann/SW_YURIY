import express from 'express';
import { viewAddMazo, doAddMazo, viewModificarMazo, doModificarMazo, viewEliminarMazo, doEliminarMazo, gestionarMazos,
 doEliminarMazoAdmin, viewEliminarMazoAdmin, doEliminarMazosUsuario, administrarMazos, preModificarMazo, modificarMazoConRelleno, viewEliminarMazos

} from './controllers.js';

const mazosRouter = express.Router();

mazosRouter.get('/addMazo', viewAddMazo);
mazosRouter.post('/addMazo', doAddMazo);
mazosRouter.get('/modificarMazo', viewModificarMazo);
mazosRouter.post('/modificarMazo', doModificarMazo);
mazosRouter.get('/eliminarMazo', viewEliminarMazo);
mazosRouter.post('/eliminarMazo', doEliminarMazo);
mazosRouter.get('/gestionarMazos', gestionarMazos);
mazosRouter.get('/modificarMazoAdmin', viewModificarMazo);
mazosRouter.get('/eliminarMazoAdmin', viewEliminarMazoAdmin);
mazosRouter.post('/eliminarMazoAdmin', doEliminarMazoAdmin);
mazosRouter.get('/eliminarMazos', viewEliminarMazos);
mazosRouter.post('/eliminarMazos', doEliminarMazosUsuario);
mazosRouter.get('/administrarMazos', administrarMazos);
mazosRouter.get('/preModificarMazo', preModificarMazo);
mazosRouter.post('/preModificarMazo', modificarMazoConRelleno);
export default mazosRouter;