import express from 'express';
import { viewAddMazo, doAddMazo, viewModificarMazo, doModificarMazo, viewEliminarMazo, doEliminarMazo, viewMisMazos, doMisMazos,
    doModificarMazoAdmin, doEliminarMazoAdmin, viewTodosMazos, viewEliminarMazoAdmin, viewModificarMazoAdmin, doEliminarMazos

} from './controllers.js';

const mazosRouter = express.Router();

mazosRouter.get('/addMazo', viewAddMazo);
mazosRouter.post('/addMazo', doAddMazo);
mazosRouter.get('/modificarMazo', viewModificarMazo);
mazosRouter.post('/modificarMazo', doModificarMazo);
mazosRouter.get('/eliminarMazo', viewEliminarMazo);
mazosRouter.post('/eliminarMazo', doEliminarMazo);
mazosRouter.get('/misMazos', viewMisMazos);
mazosRouter.post('/misMazos', doMisMazos); //sobra
mazosRouter.get('/modificarMazoAdmin', viewModificarMazoAdmin);
mazosRouter.post('/modificarMazoAdmin', doModificarMazoAdmin);
mazosRouter.get('/eliminarMazoAdmin', viewEliminarMazoAdmin);
mazosRouter.post('/eliminarMazoAdmin', doEliminarMazoAdmin);
mazosRouter.post('/eliminarMazos', doEliminarMazos);
mazosRouter.get('/todosMazos', viewTodosMazos);
//mazosRouter.post('/todosMazos', doTodosMazos); //no hace falta
export default mazosRouter;