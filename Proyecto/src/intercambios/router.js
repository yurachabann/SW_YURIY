import express from 'express';
import { viewSolicitarIntercambio, doSolicitarIntercambio

} from './controllers.js';

const intercambiosRouter = express.Router();

intercambiosRouter.get('/solicitarIntercambio', viewSolicitarIntercambio);
intercambiosRouter.post('/solicitarIntercambio', doSolicitarIntercambio);

export default intercambiosRouter;