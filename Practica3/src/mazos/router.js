import express from 'express';
import { viewAddMazo, doAddMazo, viewModificarMazo, doModificarMazo, viewEliminarMazo, doEliminarMazo, viewMisMazos, doMisMazos

} from './controllers.js';

const mazosRouter = express.Router();

mazosRouter.get('/addMazo', viewAddMazo);
mazosRouter.post('/addMazo', doAddMazo);
mazosRouter.get('/modificarMazo', viewModificarMazo);
mazosRouter.post('/modificarMazo', doModificarMazo);
mazosRouter.get('/eliminarMazo', viewEliminarMazo);
mazosRouter.post('/eliminarMazo', doEliminarMazo);
mazosRouter.get('/misMazos', viewMisMazos);
mazosRouter.post('/misMazos', doMisMazos);

export default mazosRouter;