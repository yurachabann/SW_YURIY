import { body } from 'express-validator';
import { Carta, EnumColecciones, EnumRarezas } from '../cartas/Cartas.js'
import { Intercambio } from './Intercambio.js';

export function viewSolicitarIntercambio(req, res) {
    const cartasObtener = Carta.obtenerCartasAPedir(req.session.nombre);
    const cartasDar = Carta.obtenerCartasPertenecientesAlUsuario(req.session.nombre);

    res.render('pagina', {
        contenido: 'paginas/solicitarIntercambio',
        session: req.session,
        EnumColecciones,
        EnumRarezas,
        cartasDar,
        cartasObtener
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

  return res.render('pagina', {
    contenido:    'paginas/intercambios',
    session:      req.session,
    intercambiosCartas: normalizarIntercambios()
  });
}


export function doSolicitarIntercambio(req, res) {
    console.log('>> req.body:', req.body);
    const cartaQueQuiere = req.body.cartaObtener.trim();
    const cartaQueDa = req.body.cartaDar.trim();
    const existe = Intercambio.comprobarSiExiste(req.session.nombre,cartaQueQuiere)

    const cartasObtener = Carta.obtenerCartasAPedir(req.session.nombre);
    const cartasDar = Carta.obtenerCartasPertenecientesAlUsuario(req.session.nombre);

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
    const nuevo = new Intercambio(req.session.nombre, cartaQueQuiere, cartaQueDa);
const guardado = Intercambio.guardarIntercambio(nuevo);

    res.render('pagina', {
        mensaje: 'Intercambio guardado y disponible para otros usuarios',
        contenido: 'paginas/intercambios',
        session: req.session,
        intercambiosCartas: normalizarIntercambios()
    });
}

export function doRealizarIntercambio(req, res) {
    const { usuarioQueSolicita, cartaQueQuiere, cartaDa } = req.body;
    
    const cartaQuiere = Carta.getCardPorId(cartaQueQuiere);
    const cartaDar   = Carta.getCardPorId(cartaDa);

    if (!cartaQuiere) {
     console.error('ERROR: no se encontró la carta que quiere con id=', cartaQueQuiere);
    }
    if (!cartaDar) {
      console.error('ERROR: no se encontró la carta que da con id=', cartaDa);
    }

    Carta.intercambiar(usuarioQueSolicita, req.session.nombre, cartaQueQuiere,cartaDa);
    /*
  if (cartaQuiere && cartaDar) {
    console.log('--- Realizando Intercambio ---');
    console.log('Carta que quiere el usuario:', {
      id:        cartaQuiere.id,
      nombre:    cartaQuiere.nombre,
      coleccion: cartaQuiere.coleccion,
      rareza:    cartaQuiere.rareza,
      vida:      cartaQuiere.vida,
      creador:   cartaQuiere.creador,
      imagen:    cartaQuiere.Imagen
    });
    console.log('Carta que da el usuario:', {
      id:        cartaDar.id,
      nombre:    cartaDar.nombre,
      coleccion: cartaDar.coleccion,
      rareza:    cartaDar.rareza,
      vida:      cartaDar.vida,
      creador:   cartaDar.creador,
      imagen:    cartaDar.Imagen
    });
    console.log('------------------------------');
  }*/

   res.render('pagina', {
        mensaje: 'Intercambio realizado exitosamente. Revisa tu nueva carta en el inventario!',
        contenido: 'paginas/intercambios',
        session: req.session,
        intercambiosCartas: normalizarIntercambios()
    });

}

function normalizarIntercambios(){
  const intercambiosRaw = Intercambio.obtenerIntercambios();
  const intercambiosCartas = intercambiosRaw.map(ix => {
    const usuario   = ix.UsuarioQueSolicita;
    const idQuiere  = ix.CartaQueQuiere;
    const idDa      = ix.CartaQueDa;
    
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
