import { body } from 'express-validator';
import { Carta, EnumColecciones, EnumRarezas } from '../cartas/Cartas.js'
import { Intercambio } from './Intercambio.js';

export function viewSolicitarIntercambio(req, res) {
    const cartasObtener = Carta.obtenerCartasAPedir(req.session.nombre);
    const cartasDar = Carta.getCartasUsuario(req.session.nombre);
    res.render('pagina', {
        contenido: 'paginas/solicitarIntercambio',
        session: req.session,
        EnumColecciones,
        EnumRarezas,
        cartasObtener,
        cartasDar
    });
}

export function viewContenidoIntercambios(req, res) {
  if (!req.session.login) {
    return res.render('pagina', {
      contenido: 'paginas/noPermisosLogin',
      session: req.session
    });
  }
  if (req.session.esAdmin) {
    return res.render('pagina', {
      contenido: 'paginas/noPermisosUsuario',
      session: req.session
    });
  }

  const intercambiosRaw = Intercambio.obtenerIntercambios();
  console.log('INTERCAMBIOS RAW:', intercambiosRaw);

  const intercambiosCartas = intercambiosRaw.map(ix => {
    const idQuiere = ix.CartaQueQuiere;
    const idDa     = ix.CartaQueDa;

    return {
      usuarioQueSolicita: ix.UsuarioQueSolicita,
      cartaQueQuiere:     idQuiere,
      imagenQuiere:       Carta.getImagenPorId(idQuiere), 
      cartaQueDa:         idDa,
      imagenDa:           Carta.getImagenPorId(idDa)
    };
  });

  return res.render('pagina', {
    contenido:    'paginas/intercambios',
    session:      req.session,
    intercambiosCartas
  });
}


export function doSolicitarIntercambio(req, res) {
    const cartaQueQuiere = req.body.cartasObtener.trim();
    const cartaQueDa = req.body.cartasDar.trim();
    const existe = Intercambio.comprobarSiExiste(req.session.nombre,cartaQueQuiere)

    const cartasObtener = Carta.obtenerCartasAPedir(req.session.nombre);
    const cartasDar = Carta.getCartasUsuario(req.session.nombre);

    if(existe){
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
        mensaje: 'Intercambio guardado y disponible para otros usuarios',
        contenido: 'paginas/normal',
        session: req.session,
    });
}

