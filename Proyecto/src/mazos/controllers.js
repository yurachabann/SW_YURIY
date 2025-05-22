import { body } from 'express-validator';
import { Carta, EnumColecciones, EnumRarezas } from '../cartas/Cartas.js';
import { Mazo } from '../mazos/Mazos.js';
import { Usuario } from '../usuarios/Usuario.js';

export function viewAddMazo(req, res) { 
    let contenido = 'paginas/login';

        try {
            const cartas = Carta.obtenerCartas();
            const mensaje = req.query.mensaje || null;
            contenido = 'paginas/addMazo';

            return res.render('pagina', {
                contenido,
                session: req.session,
                cartas,
                EnumColecciones,
                EnumRarezas,
                mensaje
            });
        } catch (error) {
            console.error('Error al obtener cartas:', error);
            const mensaje = req.query.mensaje || null;
            return res.status(500).render('pagina', {
                contenido: 'paginas/user',
                session: req.session,
                error: 'No se pudieron cargar las cartas.',
                mensaje
            });
        }
}

export function modificarMazoConRelleno(req, res) {

    const nombreMazo = req.body.nombre.trim();
    const mazo = Mazo.getMazoByName(nombreMazo);
    const cartasSeleccionadas = JSON.parse(mazo.cartas).map(Number);
    const cartas = Carta.obtenerCartas();
    const mensaje = req.query.mensaje || null;
    res.render('pagina', {
      contenido: 'paginas/modificarMazo',
      session: req.session,
      mazo,
      cartas,
      cartasSeleccionadas,
      EnumColecciones,
      EnumRarezas,
      mensaje
    });
  }

export function preModificarMazo(req, res) {
  const mensaje = req.query.mensaje || null;
  let mazos = null;
  if(req.session.esAdmin){
    mazos = Mazo.obtenerMazos();
  }
  else{
    mazos = Mazo.getByCreador(req.session.nombre);
  }
    res.render('pagina', {
        contenido: 'paginas/preModificarMazo',
        session: req.session,
        mensaje,
        mazos
    });
}

export function doAddMazo(req, res) {
  const username = req.session.nombre;
  console.log("usuario", username);

  const nombre = req.body.nombre?.trim();
  const rawCartas = req.body['cartas[]'];

  try {
    if (!nombre || !rawCartas) {
      throw new Error("Faltan campos obligatorios.");
    }

    const cartasSeleccionadas = Array.isArray(rawCartas)
      ? rawCartas
      : [rawCartas];

    if (cartasSeleccionadas.length !== 10) {
      throw new Error("Necesitas 10 cartas.");
    }

    if (Mazo.mazoExiste(nombre)) {
      throw new MazoYaExiste(nombre);
    }

    const cartasJSON = JSON.stringify(cartasSeleccionadas);
    Mazo.guardar(nombre, cartasJSON, username);
    console.log('Mazo guardado:', { nombre, username, cartasSeleccionadas });

    const msg = encodeURIComponent('Mazo creado exitosamente');
    return res.redirect(`/mazos/gestionarMazos?mensaje=${msg}`);
  } catch (error) {
    console.error('Error al agregar mazo:', error.message);

    const err = encodeURIComponent(error.message);
    return res.redirect(`/mazos/addMazo?mensaje=${err}`);
  }
}



export function viewModificarMazo(req, res) {
    const cartas = Carta.obtenerCartas();
    const mensaje = req.query.mensaje || null;
    res.render('pagina', {
        contenido: 'paginas/modificarMazo',
        session: req.session,
        cartas,
        EnumColecciones,
        EnumRarezas,
        mensaje
    });
}

export function viewEliminarMazos(req, res) {
    const usuarios = Usuario
    .obtenerUsuariosNoAdmin()
    .filter(u => Mazo.tieneMazos(u.nombre));
    const mensaje = req.query.mensaje || null;
    res.render('pagina', {
        contenido: 'paginas/eliminarMazosUsuario',
        session: req.session,
        usuarios,
        mensaje
    });
}

export function doEliminarMazosUsuario(req, res) {
  const nombre = req.body.name.trim();
  Mazo.deleteAllMazosUsuario(nombre);

  const mensaje = encodeURIComponent('Todos los mazos del usuario borrados con éxito');
  return res.redirect(`/mazos/administrarMazos?mensaje=${mensaje}`);
}

 
export function doModificarMazo(req, res) {
  const nombre  = req.body.nombre.trim();
  const nombre2 = req.body.nombre2.trim();
  const username = req.session.nombre;
  const isAdmin = !!req.session.esAdmin;

  const rawCartas = req.body['cartas[]'];
  const cartasSeleccionadas = Array.isArray(rawCartas)
    ? rawCartas
    : [rawCartas];
  if (cartasSeleccionadas.length !== 10) {
    const mensaje = encodeURIComponent('Necesitas 10 cartas.');
    return res.redirect(
      `/mazos/modificarMazo?nombre=${encodeURIComponent(nombre)}&mensaje=${mensaje}`
    );
  }

  if (!Mazo.mazoExiste(nombre)) {
    const mensaje = encodeURIComponent('El mazo no existe.');
    return res.redirect(
      `/mazos/modificarMazo?nombre=${encodeURIComponent(nombre)}&mensaje=${mensaje}`
    );
  }

  if (!isAdmin && !Mazo.mazoExisteParaUsuario(nombre, username)) {
    const mensaje = encodeURIComponent('El mazo no te pertenece.');
    return res.redirect(
      `/mazos/modificarMazo?nombre=${encodeURIComponent(nombre)}&mensaje=${mensaje}`
    );
  }

  let creatorForUpdate = username;
  if (isAdmin) {
    const mazo = Mazo.getMazoByName(nombre);
    creatorForUpdate = mazo.creador;
  }
  const cartasJSON = JSON.stringify(cartasSeleccionadas);
  Mazo.actualizarCampos(nombre, cartasJSON, creatorForUpdate, nombre2);

  const mensaje = encodeURIComponent('Mazo modificado con éxito.');
  if (isAdmin) {
    return res.redirect(`/mazos/administrarMazos?mensaje=${mensaje}`);
  } else {
    return res.redirect(`/mazos/gestionarMazos?mensaje=${mensaje}`);
  }
}


export function viewEliminarMazo(req, res) {
    const misMazos = Mazo.getByCreador(req.session.nombre);
    const mensaje = req.query.mensaje || null;
    res.render('pagina', {
        contenido: 'paginas/eliminarMazo',
        session: req.session,
        misMazos,
        mensaje
    });
}

export function viewEliminarMazoAdmin(req, res) {
    const mazos = Mazo.obtenerMazos();
    const mensaje = req.query.mensaje || null;
    res.render('pagina', {
        contenido: 'paginas/eliminarMazoAdmin',
        session: req.session,
        mazos,
        mensaje
    });
}

export function doEliminarMazo(req, res) {
  const username = req.session.nombre;
  const mazoName = req.body.name.trim();

  if (!Mazo.mazoExiste(mazoName)) {
    const mensaje = encodeURIComponent('El mazo no existe.');
    return res.redirect(
      `/mazos/eliminarMazo?name=${encodeURIComponent(mazoName)}&mensaje=${mensaje}`
    );
  }

  const mazo = Mazo.getMazoByName(mazoName);

  if (mazo.creador !== username) {
    const mensaje = encodeURIComponent('No tienes permiso para borrar este mazo.');
    return res.redirect(
      `/mazos/eliminarMazo?name=${encodeURIComponent(mazoName)}&mensaje=${mensaje}`
    );
  }

  Mazo.deleteByNombre(mazoName);
  const mensaje = encodeURIComponent('Mazo borrado con éxito.');
  return res.redirect(`/mazos/gestionarMazos?mensaje=${mensaje}`);
}

  
export function doEliminarMazoAdmin(req, res) {
  const mazoName = req.body.name.trim();

  if (!Mazo.mazoExiste(mazoName)) {
    const mensaje = encodeURIComponent('El mazo no existe.');
    return res.redirect(
      `/mazos/eliminarMazo?name=${encodeURIComponent(mazoName)}&mensaje=${mensaje}`
    );
  }

  Mazo.deleteByNombre(mazoName);
  const mensaje = encodeURIComponent('Mazo borrado con éxito.');
  return res.redirect(`/mazos/administrarMazos?mensaje=${mensaje}`);
}


export function gestionarMazos(req, res) {
  const mensaje = req.query.mensaje || null;
    res.render('pagina', {
        contenido: 'paginas/gestionarMazos',
        mazos: normalizarMazos(req.session.esAdmin, req.session.nombre),
        session: req.session,
        mensaje
    });

}
export function administrarMazos(req, res) {
  const mensaje = req.query.mensaje || null;
    res.render('pagina', {      
        contenido: 'paginas/administrarMazos',
        mazos : normalizarMazos(req.session.esAdmin, req.session.nombre),
        session: req.session,
        mensaje
    });
}

function normalizarMazos(esAdmin, usuario) {
    return esAdmin
      ? Mazo.obtenerMazos()
      : Mazo.obtenerMisMazos(usuario);
  }
