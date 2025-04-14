import express from 'express';
import { viewContenidoAdmin, viewContenidoNormal, viewContenidoUser, viewContenidoMiembros } from './controllers.js';

const contenidoRouter = express.Router();

contenidoRouter.get('/normal', viewContenidoNormal);

contenidoRouter.get('/admin', viewContenidoAdmin);

contenidoRouter.get('/user', viewContenidoUser);

contenidoRouter.get('/miembros', viewContenidoMiembros);


export default contenidoRouter;