import express from 'express';
import { viewAddMazo, doAddMazo, viewModificarMazo, doModificarMazo, viewEliminarMazo, doEliminarMazo, gestionarMazos,
    doModificarMazoAdmin, doEliminarMazoAdmin, viewEliminarMazoAdmin, viewModificarMazoAdmin, doEliminarMazos, administrarMazos

} from './controllers.js';

const mazosRouter = express.Router();

mazosRouter.get('/addMazo', viewAddMazo);
mazosRouter.post('/addMazo', doAddMazo);
mazosRouter.get('/modificarMazo', viewModificarMazo);
mazosRouter.post('/modificarMazo', doModificarMazo);
mazosRouter.get('/eliminarMazo', viewEliminarMazo);
mazosRouter.post('/eliminarMazo', doEliminarMazo);
mazosRouter.get('/gestionarMazos', gestionarMazos);
mazosRouter.get('/modificarMazoAdmin', viewModificarMazoAdmin);
mazosRouter.post('/modificarMazoAdmin', doModificarMazoAdmin);
mazosRouter.get('/eliminarMazoAdmin', viewEliminarMazoAdmin);
mazosRouter.post('/eliminarMazoAdmin', doEliminarMazoAdmin);
mazosRouter.post('/eliminarMazos', doEliminarMazos);
mazosRouter.get('/administrarMazos', administrarMazos);
export default mazosRouter;