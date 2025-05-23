import { body } from 'express-validator';
import { Carta, EnumColecciones, EnumRarezas } from '../cartas/Cartas.js'
import { Intercambio } from './Intercambio.js';
import { validationResult } from 'express-validator';

export function viewSolicitarIntercambio(req, res) {
    const cartasObtener = Carta.obtenerCartasAPedir(req.session.nombre);
    const cartasDar = Carta.obtenerCartasPertenecientesAlUsuario(req.session.nombre);
    const mensaje = req.query.mensaje || null;
    res.render('pagina', {
        contenido: 'paginas/solicitarIntercambio',
        session: req.session,
        EnumColecciones,
        EnumRarezas,
        cartasDar,
        cartasObtener,
        mensaje
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

  const intercambiosRaw= Intercambio.obtenerIntercambios(req.session.nombre);
  const mensaje = req.query.mensaje || null;
  return res.render('pagina', {
    contenido:    'paginas/intercambios',
    session:      req.session,
    mensaje,
    intercambiosCartas: normalizarIntercambios(intercambiosRaw)
  });
}


export function doSolicitarIntercambio(req, res) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const cartasObtener = Carta.obtenerCartasAPedir(req.session.nombre);
    const cartasDar = Carta.obtenerCartasPertenecientesAlUsuario(req.session.nombre);
    return res.render('pagina', {
      contenido:       'paginas/solicitarIntercambio',
      session:         req.session,
      EnumColecciones,
      EnumRarezas,
      cartasDar,
      cartasObtener,
      mensaje:         errors.array()[0].msg
    });
  }

  const usuario = req.session.nombre;
  const cartaQueQuiere = req.body.cartaObtener?.trim();
  const cartaQueDa     = req.body.cartaDar?.trim();

  if (cartaQueQuiere === cartaQueDa) {
    const msg = encodeURIComponent('No puedes solicitar un intercambio de la misma carta.');
    return res.redirect(`/intercambios/solicitarIntercambio?mensaje=${msg}`);
  }

  const existe = Intercambio.comprobarSiExiste(usuario, cartaQueQuiere);
  if (existe) {
    const msg = encodeURIComponent('Ese intercambio ya existe');
    return res.redirect(`/intercambios/solicitarIntercambio?mensaje=${msg}`);
  }

  const nuevo = new Intercambio(usuario, cartaQueQuiere, cartaQueDa);
  Intercambio.guardarIntercambio(nuevo);

  const msg = encodeURIComponent('Intercambio guardado y disponible para otros usuarios');
  return res.redirect(`/intercambios/intercambios?mensaje=${msg}`);
}


export function doRealizarIntercambio(req, res) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = encodeURIComponent(errors.array()[0].msg);
    return res.redirect(`/intercambios/intercambios?mensaje=${msg}`);
  }

  const usuarioQueSolicita = req.body.usuarioQueSolicita;
  const cartaQueQuiere = Number(req.body.cartaQueQuiere);
  const cartaDa = Number(req.body.cartaDa);
  const usuarioAcepta = req.session.nombre;

  // 1) Validación básica
  if (isNaN(cartaQueQuiere) || isNaN(cartaDa)) {
    const err = encodeURIComponent('IDs de carta inválidos');
    return res.redirect(`/intercambios/intercambios?mensaje=${err}`);
  }

  try {
    const cartaQuiereObj = Carta.getCardPorId(cartaQueQuiere);
    const cartaDarObj    = Carta.getCardPorId(cartaDa);

    if (!cartaQuiereObj) {
      console.error('ERROR: no se encontró la carta que quiere con id=', cartaQueQuiere);
    }
    if (!cartaDarObj) {
      console.error('ERROR: no se encontró la carta que da con id=', cartaDa);
    }

    /*
    if (cartaQuiereObj && cartaDarObj) {
      console.log('--- Realizando Intercambio ---');
      console.log('Carta que quiere el usuario:', {
        id:        cartaQuiereObj.id,
        nombre:    cartaQuiereObj.nombre,
        coleccion: cartaQuiereObj.coleccion,
        rareza:    cartaQuiereObj.rareza,
        vida:      cartaQuiereObj.vida,
        creador:   cartaQuiereObj.creador,
        imagen:    cartaQuiereObj.Imagen
      });
      console.log('Carta que da el usuario:', {
        id:        cartaDarObj.id,
        nombre:    cartaDarObj.nombre,
        coleccion: cartaDarObj.coleccion,
        rareza:    cartaDarObj.rareza,
        vida:      cartaDarObj.vida,
        creador:   cartaDarObj.creador,
        imagen:    cartaDarObj.Imagen
      });
      console.log('------------------------------');
    }
    */

    Carta.intercambiar(usuarioQueSolicita, usuarioAcepta, cartaQueQuiere, cartaDa);
    Intercambio.eliminarIntercambio(usuarioQueSolicita, cartaQueQuiere, cartaDa);

    const msg = encodeURIComponent(
      'Intercambio realizado exitosamente. Revisa tu nueva carta en el inventario!'
    );
    return res.redirect(`/intercambios/intercambios?mensaje=${msg}`);

  } catch (e) {
    console.error('Error al realizar intercambio:', e);
    const err = encodeURIComponent('No se pudo realizar el intercambio: ' + e.message);
    return res.redirect(`/intercambios/intercambios?mensaje=${err}`);
  }
}


function normalizarIntercambios(intercambiosRaw){
  //const intercambiosRaw = Intercambio.obtenerIntercambios();
  const intercambiosCartas = intercambiosRaw.map(ix => {
    const usuario = ix.UsuarioQueSolicita;
    const idQuiere = ix.CartaQueQuiere;
    const idDa = ix.CartaQueDa;
    
    const imagenQuiere = Carta.getImagenPorId(idQuiere);
    const imagenDa     = Carta.getImagenPorId(idDa);

    return {
      usuarioQueSolicita: usuario,
      cartaQueQuiere:     idQuiere,
      imagenQuiere:       imagenQuiere,
      cartaDa:            idDa,
      imagenDa:           imagenDa
    };
  });

  return intercambiosCartas;
}
