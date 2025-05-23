import { validationResult } from 'express-validator';

import { Carta, EnumColecciones, EnumRarezas } from './Cartas.js'
import { Usuario } from '../usuarios/Usuario.js';

export function viewCreateCard(req, res) {
    const mensaje = req.query.mensaje || null;
    res.render('pagina', {
        contenido: 'paginas/crearCarta',
        session: req.session,
        mensaje
    });
}

export function viewAddCardInventarioEstandar(req, res) {
    const cartas_coleccion_estandar = Carta.getEstandar();
    const mensaje = req.query.mensaje || null;
    res.render('pagina', {
        contenido: 'paginas/addCardInventarioEstandar',
        session: req.session,
        cartas_coleccion_estandar,
        EnumColecciones,
        EnumRarezas,
        mensaje
    });
}
   
export function viewAddCardInventarioTodos(req, res) {
    const mensaje = req.query.mensaje || null;
    const cartas_coleccion_todos = Carta.getTodos();
    res.render('pagina', {
        contenido: 'paginas/addCardInventarioTodos',
        session: req.session,
        cartas_coleccion_todos,
        EnumColecciones,
        EnumRarezas,
        mensaje
    });
}

export function viewAddCardInventarioCustom(req, res) {
    const cartas_coleccion_custom = Carta.getCustom();
    const mensaje = req.query.mensaje || null;
    res.render('pagina', {
        contenido: 'paginas/addCardInventarioCustom',
        session: req.session,
        cartas_coleccion_custom,
        EnumRarezas,
        EnumColecciones,
        mensaje
    });
}

export function preModificarCard(req, res) {
    const mensaje = req.query.mensaje || null;
    let cartas = null;
    if(req.session.esAdmin){
        cartas = Carta.getTodos();
    }
    else {
        cartas = Carta.getByCreador(req.session.nombre);
    }
    res.render('pagina', {
        contenido: 'paginas/preModificarCard',
        session: req.session,
        cartas,
        EnumColecciones,
        EnumRarezas,
        mensaje
    });
}

export function modificarCartaConRelleno(req,res){

const errors = validationResult(req);
if (!errors.isEmpty()) {
  let cartas;
  if (req.session.esAdmin) {
    cartas = Carta.getTodos();
  } else {
    cartas = Carta.getByCreador(req.session.nombre);
  }

  return res.render('pagina', {
    contenido:   'paginas/preModificarCard',
    session:     req.session,
    cartas,
    EnumColecciones,
    EnumRarezas,
    mensaje:     errors.array()[0].msg
  });
}

    const nombreCarta = req.body.nombre.trim();
    let carta = Carta.getCartaByName(nombreCarta);
    const mensaje = req.query.mensaje || null;

    res.render('pagina', {
        contenido: 'paginas/modifyCard',
        session: req.session,
        carta,
        mensaje
    });

}

export function administrarCartas(req, res) {
    const cartas = Carta.obtenerCartas();
    const mensaje = req.query.mensaje || null;
    res.render('pagina', {
        contenido: 'paginas/administrarCartas',
        cartas,
        session: req.session,
        EnumColecciones,
        EnumRarezas,
        mensaje
    });
}

export function viewEliminateCard(req, res) {
    const cartas = Carta.obtenerCartas()
    const mensaje = req.query.mensaje || null;
    res.render('pagina', {
        contenido: 'paginas/eliminarCarta',
        session: req.session,
        cartas,
        EnumColecciones,
        EnumRarezas,
        mensaje
    });
}

export function viewAddCardInventario(req, res) {
    const mensaje = req.query.mensaje || null;
    res.render('pagina', {
        contenido: 'paginas/añadirAlInventario',
        session: req.session,
        mensaje
    });
}

export function viewEliminateCardsUsuario(req, res) {
    const mensaje = req.query.mensaje || null;
    const usuarios = Carta.obtenerUsuariosConCartasCreadas();
    res.render('pagina', {
        contenido: 'paginas/eliminarCartasUsuario',
        session: req.session,
        usuarios,
        mensaje
    });
}

export function viewGestionarCartas(req, res) {
    const cartas = Carta.obtenerCartasPertenecientesAlUsuario(req.session.nombre);
    const mensaje = req.query.mensaje || null;
    res.render('pagina', {
        contenido: 'paginas/gestionarCartas',
        session: req.session,
        cartas,
        EnumColecciones,
        EnumRarezas,
        mensaje
    });
}

export function doEliminateCard(req, res) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('pagina', {
      contenido: 'paginas/eliminarCarta',
      session:   req.session,
      cartas:    Carta.obtenerCartas(),
      mensaje:   errors.array()[0].msg,
      EnumColecciones,
      EnumRarezas
    });
  }

  const nombre = req.body.name;

  if (!Carta.cartaExiste(nombre)) {
    return res.render('pagina', {
      contenido: 'paginas/eliminarCarta',
      mensaje:   'Error al borrar la carta: no existe',
      session:   req.session,
      EnumColecciones,
      EnumRarezas,
      cartas: Carta.obtenerCartas()
    });
  }

  try {
    Carta.deleteByName(nombre);
  } catch (e) {
    return res.render('pagina', {
      contenido: 'paginas/eliminarCarta',
      mensaje:   'No se pudo borrar la carta: ' + e.message,
      session:   req.session,
      EnumColecciones,
      EnumRarezas,
      cartas: Carta.obtenerCartas()
    });
  }

  const msg = encodeURIComponent('Carta borrada con éxito');
  return res.redirect(`/cartas/administrarCartas?mensaje=${msg}`);
}
  

export function doEliminateCardsUsuario(req, res) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   
    const usuarios = Carta.obtenerUsuariosConCartasCreadas();
    return res.render('pagina', {
      contenido: 'paginas/eliminarCartasUsuario',
      session:   req.session,
      usuarios,
      mensaje:   errors.array()[0].msg
    });
  }

  const usuario = req.body.name.trim();
  try {
    Carta.deleteAllCartasUsuario(usuario);
  } catch (e) {
    return res.render('pagina', {
      contenido: 'paginas/administrarCartas',
      cartas:    Carta.obtenerCartas(),
      mensaje:   'Error al eliminar cartas del usuario: ' + e.message,
      session:   req.session,
      EnumColecciones,
      EnumRarezas
    });
  }

  const msg = encodeURIComponent('Todas las cartas CREADAS por el usuario eliminadas con éxito');
  return res.redirect(`/cartas/administrarCartas?mensaje=${msg}`);
}

export function doAddCardInventarioEstandar(req, res) {
  const rawCartas = req.body['cartas[]'];

  try {
    if (!rawCartas) {
      throw new Error("Faltan campos obligatorios.");
    }

    const cartasSeleccionadas = Array.isArray(rawCartas)
      ? rawCartas
      : [rawCartas];

    cartasSeleccionadas.forEach(id => {
      const cartaId = Number(id);
      if (Number.isNaN(cartaId)) {
        throw new Error(`ID inválido: ${id}`);
      }
      Carta.agregarAlInventario(req.session.nombre, cartaId);
    });

  } catch (error) {
    console.error('Error al seleccionar cartas: ', error.message);
    const errMsg = encodeURIComponent('Error al añadir cartas: ' + error.message);
    return res.redirect(`/cartas/gestionarCartas?mensaje=${errMsg}`);
  }

  const msg = encodeURIComponent('Cartas añadidas con éxito a tu inventario!');
  return res.redirect(`/cartas/gestionarCartas?mensaje=${msg}`);
}

    
  export function doAddCardInventarioCustom(req, res) {
  const rawCartas = req.body['cartas[]'];

  try {
    if (!rawCartas) {
      throw new Error("Faltan campos obligatorios.");
    }

    const cartasSeleccionadas = Array.isArray(rawCartas)
      ? rawCartas
      : [rawCartas];

    cartasSeleccionadas.forEach(id => {
      const cartaId = Number(id);
      if (Number.isNaN(cartaId)) {
        throw new Error(`ID inválido: ${id}`);
      }
      Carta.agregarAlInventario(req.session.nombre, cartaId);
    });

  } catch (error) {
    console.error('Error al seleccionar cartas: ', error.message);
    const errMsg = encodeURIComponent('Error al añadir cartas: ' + error.message);
    return res.redirect(`/cartas/gestionarCartas?mensaje=${errMsg}`);
  }

  const msg = encodeURIComponent('Cartas añadidas con éxito a tu inventario!');
  return res.redirect(`/cartas/gestionarCartas?mensaje=${msg}`);
}


  export function doAddCardInventarioTodos(req, res) {
  const rawCartas = req.body['cartas[]'];

  try {
    if (!rawCartas) {
      throw new Error("Faltan campos obligatorios.");
    }

    const cartasSeleccionadas = Array.isArray(rawCartas)
      ? rawCartas
      : [rawCartas];

    cartasSeleccionadas.forEach(id => {
      const cartaId = Number(id);
      if (Number.isNaN(cartaId)) {
        throw new Error(`ID inválido: ${id}`);
      }
      Carta.agregarAlInventario(req.session.nombre, cartaId);
    });

  } catch (error) {
    console.error('Error al seleccionar cartas:', error.message);
    const errMsg = encodeURIComponent('Error al añadir cartas: ' + error.message);
    return res.redirect(`/cartas/gestionarCartas?mensaje=${errMsg}`);
  }

  const msg = encodeURIComponent('Cartas añadidas con éxito a tu inventario!');
  return res.redirect(`/cartas/gestionarCartas?mensaje=${msg}`);
}


export function doCreateCard(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('pagina', {
      contenido: 'paginas/crearCarta',
      session:   req.session,
      mensaje:   errors.array()[0].msg
    });
  }

  const nombre = req.body.nombre.trim();
  const rareza = Number(req.body.rareza.trim());
  const vida   = Number(req.body.vida.trim());

  try {
    if (!req.file) {
      throw new Error('Debes subir una imagen');
    }
    const imagen = `/img/${req.file.filename}`;
    if (Carta.cartaExiste(nombre)) {
      throw new Error(`La carta con el nombre "${nombre}" ya existe`);
    }

    if (req.session.esAdmin) {
      Carta.crearCarta(nombre, 0, rareza, vida, null, imagen);
      return res.redirect(`/cartas/administrarCartas?mensaje=${encodeURIComponent('Carta creada con éxito.')}`);
    } else {
      Carta.crearCarta(nombre, 1, rareza, vida, req.session.nombre, imagen);
      return res.redirect(`/cartas/gestionarCartas?mensaje=${encodeURIComponent('Carta creada con éxito y añadida a tu inventario!')}`);
    }

  } catch (err) {
    console.error('Error creando carta:', err.message);
    const errMsg = encodeURIComponent(err.message);
    return res.redirect(`/cartas/createCard?mensaje=${errMsg}`);
  }
}


export function doModifyCard(req, res) {
  const errors = validationResult(req);
  let cartaOriginal = null;
  try {
    cartaOriginal = Carta.getCartaByName(req.body.nombre.trim());
  } catch {
    const errMsg = encodeURIComponent('La carta no existe');
    return res.redirect(`/cartas/modifyCard?nombre=${encodeURIComponent(req.body.nombre)}&mensaje=${errMsg}`);
  }

  if (!errors.isEmpty()) {
    return res.render('pagina', {
      contenido: 'paginas/modifyCard',
      session:   req.session,
      carta:     cartaOriginal,
      mensaje:   errors.array()[0].msg
    });
  }

  const nombre    = req.body.nombre.trim();
  const nombre2   = req.body.nombre2.trim();
  const rarezaNum = Number(req.body.rareza.trim());
  const vidaNum   = Number(req.body.vida.trim());

  const imagen = req.file
    ? `/img/${req.file.filename}`
    : cartaOriginal.Imagen;

  const esCreador = Carta.getCreadorByNombre(nombre) === req.session.nombre;
  if (!req.session.esAdmin && !esCreador) {
    const errMsg = encodeURIComponent('No tienes permisos para modificar esta carta');
    return res.redirect(`/cartas/modifyCard?nombre=${encodeURIComponent(nombre)}&mensaje=${errMsg}`);
  }

  try {
    Carta.actualizarCampos(nombre, nombre2, String(rarezaNum), String(vidaNum), imagen);
  } catch (err) {
    console.error('Error al actualizar carta:', err.message);
    const errMsg = encodeURIComponent('Error al actualizar la carta: ' + err.message);
    return res.redirect(`/cartas/modifyCard?nombre=${encodeURIComponent(nombre)}&mensaje=${errMsg}`);
  }

  const successMsg = encodeURIComponent('Carta actualizada con éxito');
  if (req.session.esAdmin) {
    return res.redirect(`/cartas/administrarCartas?mensaje=${successMsg}`);
  } else {
    return res.redirect(`/cartas/gestionarCartas?mensaje=${successMsg}`);
  }
}


export function viewRemoveCardInventario(req, res) {
  const cartas = Carta.obtenerCartasPertenecientesAlUsuario(req.session.nombre);
  res.render('pagina', {
    contenido: 'paginas/removeCardInventario',
    session: req.session,
    cartas,
    EnumColecciones,
    EnumRarezas
  });
}

export function doRemoveCardInventario(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const cartas = Carta.obtenerCartasPertenecientesAlUsuario(req.session.nombre);
    return res.render('pagina', {
      contenido:    'paginas/removeCardInventario',
      session:      req.session,
      cartas,
      EnumColecciones,
      EnumRarezas,
      mensaje:      errors.array()[0].msg
    });
  }

  const nombre = req.body.name;
  try {
    Carta.removeFromInventory(req.session.nombre, nombre);
    const msg = encodeURIComponent('Carta eliminada de tu inventario con éxito');
    return res.redirect(`/cartas/gestionarCartas?mensaje=${msg}`);
  } catch (e) {
    console.error('Error al eliminar carta:', e.message);
    const errMsg = encodeURIComponent('No se pudo eliminar la carta: ' + e.message);
    return res.redirect(`/cartas/removeCardInventario?mensaje=${errMsg}`);
  }
}


