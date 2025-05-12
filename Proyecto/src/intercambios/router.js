import express from 'express';
import { viewSolicitarIntercambio, doSolicitarIntercambio, viewContenidoIntercambios, doRealizarIntercambio

} from './controllers.js';

const intercambiosRouter = express.Router();

intercambiosRouter.get('/solicitarIntercambio', viewSolicitarIntercambio);
intercambiosRouter.get('/intercambios', viewContenidoIntercambios);
intercambiosRouter.post('/solicitarIntercambio', doSolicitarIntercambio);
intercambiosRouter.post('/realizarIntercambio', doRealizarIntercambio);

export default intercambiosRouter;