import { body } from 'express-validator';
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
    const todos = Usuario.obtenerUsuarios();
    const usuarios = todos.filter(u => {
    const cartasDelUsuario = Carta.obtenerCartasPertenecientesAlUsuario(u.nombre);
    return cartasDelUsuario.length > 0;
  });

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
  const nombre = req.body.name;

  if (!Carta.cartaExiste(nombre)) {
    return res.render('pagina', {
      contenido: 'paginas/eliminarCarta',
      mensaje:   'Error al borrar la carta: no existe',
      session:   req.session,
    });
  }

  if (!req.session.esAdmin) {
    return res.status(403).render('pagina', {
      contenido: 'paginas/eliminarCarta',
      mensaje:   'No tienes permisos para eliminar cartas',
      session:   req.session,
    });
  }

  try {
    Carta.deleteByName(nombre);
  } catch (e) {
    return res.render('pagina', {
      contenido: 'paginas/eliminarCarta',
      mensaje:   'No se pudo borrar la carta: ' + e.message,
      session:   req.session,
    });
  }

  const msg = encodeURIComponent('Carta borrada con éxito');
  return res.redirect(`/cartas/administrarCartas?mensaje=${msg}`);
}
  

export function doEliminateCardsUsuario(req, res) {
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

  const msg = encodeURIComponent('Todas las cartas del usuario eliminadas con éxito');
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
  const nombre = req.body.nombre?.trim();
  const rareza = req.body.rareza?.trim();
  const vida = req.body.vida?.trim();

  try {
    if (!req.file) {
      throw new Error("Debes subir una imagen");
    }

    const imagen = `/img/${req.file.filename}`;
    const vidaNum = Number(vida);
    const rarezaNum = Number(rareza);

    if (!nombre) {
      throw new Error("El nombre debe ser un texto no vacío");
    }
    if (!imagen) {
      throw new Error("La imagen debe ser una URL válida");
    }
    if (Number.isNaN(vidaNum) || vidaNum < 1 || vidaNum > 1000) {
      throw new Error("La vida tiene que estar entre 1 y 1000");
    }
    if (Number.isNaN(rarezaNum) || rarezaNum < 1 || rarezaNum > 4) {
      throw new Error("Esta rareza no existe");
    }
    if (Carta.cartaExiste(nombre)) {
      throw new Error(`La carta con el nombre "${nombre}" ya existe`);
    }

  } catch (err) {
    console.error("Error creando carta:", err.message);
    const errMsg = encodeURIComponent(err.message);
    return res.redirect(`/cartas/añadirCarta?mensaje=${errMsg}`);
  }

  const imagen = `/img/${req.file.filename}`;
  const vidaNum = Number(vida);
  const rarezaNum = Number(rareza);

  if (req.session.esAdmin) {
    Carta.crearCarta(nombre, 0, rarezaNum, vidaNum, null, imagen);
    const msg = encodeURIComponent("Carta creada con éxito.");
    return res.redirect(`/cartas/administrarCartas?mensaje=${msg}`);
  } else {
    Carta.crearCarta(nombre, 1, rarezaNum, vidaNum, req.session.nombre, imagen);
    const msg = encodeURIComponent("Carta creada con éxito y añadida a tu inventario!");
    return res.redirect(`/cartas/gestionarCartas?mensaje=${msg}`);
  }
}


export function doModifyCard(req, res) {
  const nombre = req.body.nombre.trim();
  const nombre2 = req.body.nombre2.trim();
  const rareza = req.body.rareza.trim();
  const vida = req.body.vida.trim();

  let cartaActual;
  try {
    cartaActual = Carta.getCartaByName(nombre);
  } catch (err) {
    const errMsg = encodeURIComponent('La carta no existe');
    return res.redirect(`/cartas/modifyCard?nombre=${encodeURIComponent(nombre)}&mensaje=${errMsg}`);
  }

  const imagen = req.file
    ? `/img/${req.file.filename}`
    : cartaActual.Imagen;

  const esCreador = Carta.getCreadorByNombre(nombre) === req.session.nombre;
  if (!req.session.esAdmin && !esCreador) {
    const errMsg = encodeURIComponent('No tienes permisos para modificar esta carta');
    return res.redirect(`/cartas/modifyCard?nombre=${encodeURIComponent(nombre)}&mensaje=${errMsg}`);
  }

  try {
    Carta.actualizarCampos(nombre, nombre2, rareza, vida, imagen);
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



