import { body } from 'express-validator';
import { Carta, EnumColecciones, EnumRarezas } from '../cartas/Cartas.js';
import { Mazo } from '../mazos/Mazos.js';
import { Usuario } from '../usuarios/Usuario.js';

export function viewAddMazo(req, res) { 
    let contenido = 'paginas/login';

        try {
            const cartas = Carta.obtenerCartas();
            contenido = 'paginas/addMazo';

            return res.render('pagina', {
                contenido,
                session: req.session,
                cartas,
                EnumColecciones,
                EnumRarezas
            });
        } catch (error) {
            console.error('Error al obtener cartas:', error);
            return res.status(500).render('pagina', {
                contenido: 'paginas/user',
                session: req.session,
                error: 'No se pudieron cargar las cartas.'
            });
        }
}

export function modificarMazoConRelleno(req, res) {

    const nombreMazo = req.body.nombre.trim();
    const mazo = Mazo.getMazoByName(nombreMazo);
    const cartasSeleccionadas = JSON.parse(mazo.cartas).map(Number);
    const cartas = Carta.obtenerCartas();

    res.render('pagina', {
      contenido: 'paginas/modificarMazo',
      session: req.session,
      mazo,
      cartas,
      cartasSeleccionadas,
      EnumColecciones,
      EnumRarezas
    });
  }

export function preModificarMazo(req, res) {
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
        mazos
    });
}

export function doAddMazo(req, res) {
    const username = req.session.nombre;
    console.log("usuario" + username);
    const nombre = req.body.nombre.trim();
    const rawCartas = req.body['cartas[]'];
 
    try {
        if (!nombre || !rawCartas) {
            throw new Error("Faltan campos obligatorios.");
        }

        const cartasSeleccionadas = Array.isArray(rawCartas)
        ? rawCartas
        : [rawCartas];

        if (cartasSeleccionadas.length > 10 || cartasSeleccionadas.length < 10) {
            throw new Error("Necesitas 10 cartas.");
        }

        if (Mazo.mazoExiste(nombre)) {
            throw new MazoYaExiste(nombre);
        }

       const cartasJSON = JSON.stringify(cartasSeleccionadas);

        Mazo.guardar(nombre,cartasJSON,username);
        console.log('Mazo guardado:', {
            nombre,
            username,
            cartasSeleccionadas
        });
        
        res.render('pagina', {
            contenido: 'paginas/gestionarMazos',
            session: req.session,
            mazos : normalizarMazos(req.session.esAdmin, req.session.nombre),
            mensaje: 'Mazo creado exitosamente.'
        });

    } catch (error) {
        console.error('Error al agregar mazo:', error.message);
        const cartas = Carta.obtenerCartas();
        res.status(400).render('pagina', {
            contenido: 'paginas/addMazo',
            session: req.session,
            mensaje: error.message,
            cartas,
            EnumColecciones,
            EnumRarezas,
        });
    }
}


export function viewModificarMazo(req, res) {
    const cartas = Carta.obtenerCartas();
    res.render('pagina', {
        contenido: 'paginas/modificarMazo',
        session: req.session,
        cartas,
        EnumColecciones,
        EnumRarezas
    });
}

export function viewEliminarMazos(req, res) {
    const usuarios = Usuario
    .obtenerUsuariosNoAdmin()
    .filter(u => Mazo.tieneMazos(u.nombre));
    res.render('pagina', {
        contenido: 'paginas/eliminarMazosUsuario',
        session: req.session,
        usuarios
    });
}

export function doEliminarMazosUsuario(req, res) {
    const nombre  = req.body.name.trim();
    Mazo.deleteAllMazosUsuario(nombre);

    return res.render('pagina', {
      contenido: 'paginas/administrarMazos',
      session: req.session,
      mazos : normalizarMazos(req.session.esAdmin, req.session.nombre),
      mensaje: 'Todos los mazos del usuario borrados con éxito'
    });
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

        if (cartasSeleccionadas.length > 10 || cartasSeleccionadas.length < 10) {
            throw new Error("Necesitas 10 cartas.");
        }

    const cartasJSON = JSON.stringify(cartasSeleccionadas);

    const cartas = Carta.obtenerCartas();
  
    if (!Mazo.mazoExiste(nombre)) {
      return res.render('pagina', {
        contenido: 'paginas/modificarMazo',
        mensaje: 'El mazo no existe.',
        cartas,
        EnumColecciones,
        EnumRarezas,
        session: req.session
      });
    }

    if (!isAdmin && !Mazo.mazoExisteParaUsuario(nombre, username)) {
      return res.render('pagina', {
        contenido: 'paginas/modificarMazo',
        mensaje: 'El mazo no te pertenece.',
        cartas,
        EnumColecciones,
        EnumRarezas,
        session: req.session
      });
    }
  
    let creatorForUpdate = username;
    if (isAdmin) {
      // Para admin, mantenemos el creador original (nulo)
      const mazo = Mazo.getMazoByName(nombre);
      creatorForUpdate = mazo.creador;
    }
  
    Mazo.actualizarCampos(nombre, cartasJSON, creatorForUpdate, nombre2);
  
    return res.render('pagina', {
      contenido: isAdmin
        ? 'paginas/administrarMazos'
        : 'paginas/gestionarMazos',
      mazos: normalizarMazos(isAdmin, username),
      session: req.session,
      mensaje: 'Mazo modificado con éxito.'
    });
  }

export function viewEliminarMazo(req, res) {
    const misMazos = Mazo.getByCreador(req.session.nombre);
    res.render('pagina', {
        contenido: 'paginas/eliminarMazo',
        session: req.session,
        misMazos
    });
}

export function viewEliminarMazoAdmin(req, res) {
    const mazos = Mazo.obtenerMazos();
    res.render('pagina', {
        contenido: 'paginas/eliminarMazoAdmin',
        session: req.session,
        mazos
    });
}

export function doEliminarMazo(req, res) {
    const username = req.session.nombre;
    const mazoName = req.body.name;
    
    if (!Mazo.mazoExiste(mazoName)) {
      return res.render('pagina', {
        contenido: 'paginas/eliminarMazo',
        mensaje: 'El mazo no existe.',
        session: req.session
      });
    }
  
    const mazo = Mazo.getMazoByName(mazoName);
  
    if (mazo.creador !== username) {
      return res.render('pagina', {
        contenido: 'paginas/eliminarMazo',
        mensaje: 'No tienes permiso para borrar este mazo.',
        session: req.session
      });
    }
  
    Mazo.deleteByNombre(mazoName);
    return res.render('pagina', {
      contenido: 'paginas/gestionarMazos',
      mensaje: 'Mazo borrado con éxito.',
      mazos : normalizarMazos(req.session.esAdmin, req.session.nombre),
      session: req.session
    });
  }
  
  export function doEliminarMazoAdmin(req, res) {
    const mazoName = req.body.name;
    
    if (!Mazo.mazoExiste(mazoName)) {
      return res.render('pagina', {
        contenido: 'paginas/eliminarMazo',
        mensaje: 'El mazo no existe.',
        session: req.session
      });
    }
  
    Mazo.deleteByNombre(mazoName);
    return res.render('pagina', {
      contenido: 'paginas/administrarMazos',
      mensaje: 'Mazo borrado con éxito.',
      mazos : normalizarMazos(req.session.esAdmin, req.session.nombre),
      session: req.session
    });
  }


export function gestionarMazos(req, res) {
    res.render('pagina', {
        contenido: 'paginas/gestionarMazos',
        mazos: normalizarMazos(req.session.esAdmin, req.session.nombre),
        session: req.session
    });

}
export function administrarMazos(req, res) {
    res.render('pagina', {
        contenido: 'paginas/administrarMazos',
        mazos : normalizarMazos(req.session.esAdmin, req.session.nombre),
        session: req.session
    });
}

function normalizarMazos(esAdmin, usuario) {
    return esAdmin
      ? Mazo.obtenerMazos()
      : Mazo.obtenerMisMazos(usuario);
  }
