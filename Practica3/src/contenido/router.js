import express from 'express';
import { viewContenidoAdmin, viewContenidoNormal, viewContenidoUser } from './controllers.js';

const contenidoRouter = express.Router();

contenidoRouter.get('/normal', viewContenidoNormal);

contenidoRouter.get('/admin', viewContenidoAdmin);

contenidoRouter.get('/user', viewContenidoUser);


export default contenidoRouter;