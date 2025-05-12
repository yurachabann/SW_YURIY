import express from 'express';
import { viewContenidoAdmin, viewContenidoUser, viewContenidoMiembros } from './controllers.js';

const contenidoRouter = express.Router();

contenidoRouter.get('/admin', viewContenidoAdmin);
contenidoRouter.get('/miembros', viewContenidoMiembros);
contenidoRouter.get('/user', viewContenidoUser);
contenidoRouter.get('/miembros', viewContenidoMiembros);


export default contenidoRouter;