import express from 'express';
import { viewSolicitarIntercambio, doSolicitarIntercambio, viewContenidoIntercambios

} from './controllers.js';

const intercambiosRouter = express.Router();

intercambiosRouter.get('/solicitarIntercambio', viewSolicitarIntercambio);
intercambiosRouter.get('/intercambios', viewContenidoIntercambios);
intercambiosRouter.post('/solicitarIntercambio', doSolicitarIntercambio);

export default intercambiosRouter;