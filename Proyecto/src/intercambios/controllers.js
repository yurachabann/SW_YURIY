import { body } from 'express-validator';
import { Carta, EnumColecciones, EnumRarezas } from '../cartas/Cartas.js'
import { Intercambio } from './Intercambio.js';

export function viewSolicitarIntercambio(req, res) {
    const cartasObtener = Carta.obtenerCartas();
    const cartasDar = Carta.obtenerCartas();
    res.render('pagina', {
        contenido: 'paginas/solicitarIntercambio',
        session: req.session,
        EnumColecciones,
        EnumRarezas,
        cartasObtener,
        cartasDar
    });
}

export function doSolicitarIntercambio(req, res) {
    const cartaQueQuiere = req.body.cartasObtener.trim();
    const cartaQueDa = req.body.cartasDar.trim();
    const existe = Intercambio.comprobarSiExiste(req.session.nombre,cartaQueQuiere)

    const cartasObtener = Carta.obtenerCartas();
    const cartasDar = Carta.obtenerCartas();

    if(existe == 0){
        return res.render('pagina', {
            contenido: 'paginas/solicitarIntercambio',
            mensaje: 'Ese intercambio ya existe',
            session: req.session,
            EnumColecciones,
            EnumRarezas,
            cartasObtener,
            cartasDar
          });
    }
    Intercambio.guardarIntercambio(req.session.nombre,cartaQueQuiere, cartaQueDa);
    res.render('pagina', {
        contenido: 'paginas/normal',
        session: req.session,
        //EnumColecciones,
       // EnumRarezas,
       // cartasObtener,
       // cartasDar
    });
}
