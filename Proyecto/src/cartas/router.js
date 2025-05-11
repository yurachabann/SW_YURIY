import express from 'express';
import { viewAddCard, doAddCard, viewModifyCard, doModifyCard, viewEliminateCard, doEliminateCard, doEliminateCardsUsuario, administrarCartas, viewGestionarCartas, preModificarCard,
    modificarCartaConRelleno, viewEliminateCardsUsuario

} from './controllers.js';

import { uploadImg } from '../../static/js/upload.js';
const cartasRouter = express.Router();

cartasRouter.get('/addCard', viewAddCard);

cartasRouter.post('/addCard',
    uploadImg.single('imagen'),
    doAddCard,
  );
  
  cartasRouter.post('/modificarCard',
    uploadImg.single('imagen'),
    doModifyCard,
  );
  
cartasRouter.get('/modificarCard', viewModifyCard);
cartasRouter.get('/eliminarCarta', viewEliminateCard);
cartasRouter.post('/eliminarCarta', doEliminateCard);
cartasRouter.post('/eliminarCartas', doEliminateCardsUsuario);
cartasRouter.get('/eliminarCartas', viewEliminateCardsUsuario);
cartasRouter.get('/administrarCartas', administrarCartas);
cartasRouter.get('/gestionarCartas', viewGestionarCartas);
cartasRouter.get('/preModificarCard', preModificarCard);
cartasRouter.post('/preModificarCard', modificarCartaConRelleno);

export default cartasRouter;