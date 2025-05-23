import express from 'express';
import { body } from 'express-validator';
import { viewSolicitarIntercambio, doSolicitarIntercambio, viewContenidoIntercambios, doRealizarIntercambio

} from './controllers.js';

const intercambiosRouter = express.Router();

intercambiosRouter.get('/solicitarIntercambio', viewSolicitarIntercambio);
intercambiosRouter.get('/intercambios', viewContenidoIntercambios);
//intercambiosRouter.post('/solicitarIntercambio', doSolicitarIntercambio);
intercambiosRouter.post(
  '/solicitarIntercambio',
  body('cartaObtener')
    .trim()
    .notEmpty()
    .withMessage('Debes seleccionar la carta que quieres'),
  body('cartaDar')
    .trim()
    .notEmpty()
    .withMessage('Debes seleccionar la carta que ofreces'),
  doSolicitarIntercambio
);
//intercambiosRouter.post('/realizarIntercambio', doRealizarIntercambio);

intercambiosRouter.post(
  '/realizarIntercambio',
  body('usuarioQueSolicita')
    .trim()
    .notEmpty()
    .withMessage('Falta el usuario que solicita'),
  body('cartaQueQuiere')
    .trim()
    .isInt()
    .withMessage('ID de la carta que quieres inválido'),
  body('cartaDa')
    .trim()
    .isInt()
    .withMessage('ID de la carta que ofreces inválido'),
  doRealizarIntercambio
);

export default intercambiosRouter;