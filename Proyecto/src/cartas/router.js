import express from 'express';
import { viewCreateCard, doCreateCard, doModifyCard, viewEliminateCard, doEliminateCard, doEliminateCardsUsuario, administrarCartas, viewGestionarCartas, preModificarCard,
    modificarCartaConRelleno, viewEliminateCardsUsuario, viewAddCardInventario

} from './controllers.js';

import { uploadImg } from '../../static/js/upload.js';
const cartasRouter = express.Router();

cartasRouter.get('/createCard', viewCreateCard);

cartasRouter.post('/createCard',
    uploadImg.single('imagen'),
    doCreateCard,
  );
  
  cartasRouter.post('/modificarCard',
    uploadImg.single('imagen'),
    doModifyCard,
  );
  
cartasRouter.get('/addCardInventario', viewAddCardInventario);
cartasRouter.get('/eliminarCarta', viewEliminateCard);
cartasRouter.post('/eliminarCarta', doEliminateCard);
cartasRouter.post('/eliminarCartas', doEliminateCardsUsuario);
cartasRouter.get('/eliminarCartas', viewEliminateCardsUsuario);
cartasRouter.get('/administrarCartas', administrarCartas);
cartasRouter.get('/gestionarCartas', viewGestionarCartas);
cartasRouter.get('/preModificarCard', preModificarCard);
cartasRouter.post('/preModificarCard', modificarCartaConRelleno);

export default cartasRouter;