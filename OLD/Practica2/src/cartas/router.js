import express from 'express';
import { viewAddCard, doAddCard, viewModifyCard, doModifyCard, viewEliminateCard, doEliminateCard, viewAllCartas

} from './controllers.js';

const cartasRouter = express.Router();

cartasRouter.get('/addCard', viewAddCard);
cartasRouter.post('/addCard', doAddCard);
cartasRouter.get('/modificarCard', viewModifyCard);
cartasRouter.post('/modificarCard', doModifyCard);
cartasRouter.get('/eliminarCarta', viewEliminateCard);
cartasRouter.post('/eliminarCarta', doEliminateCard);
cartasRouter.get('/viewAllCartas', viewAllCartas);

export default cartasRouter;