import { body } from 'express-validator';
import { Carta, EnumColecciones, EnumRarezas } from './Cartas.js'

export function viewCreateCard(req, res) {
    res.render('pagina', {
        contenido: 'paginas/crearCarta',
        session: req.session
    });
}

/*
export function viewModifyCard(req, res) {
    res.render('pagina', {
        contenido: 'paginas/modifyCard',
        session: req.session,
    });
}*/

export function preModificarCard(req, res) {
    res.render('pagina', {
        contenido: 'paginas/preModificarCard',
        session: req.session
    });
}

export function modificarCartaConRelleno(req,res){
    const nombreCarta = req.body.nombre.trim();
    let carta = Carta.getCartaByName(nombreCarta);

    res.render('pagina', {
        contenido: 'paginas/modifyCard',
        session: req.session,
        carta
    });

}

export function administrarCartas(req, res) {
    const cartas = Carta.obtenerCartas();
    res.render('pagina', {
        contenido: 'paginas/administrarCartas',
        cartas,
        session: req.session,
        EnumColecciones,
        EnumRarezas
    });
}

export function viewEliminateCard(req, res) {
    res.render('pagina', {
        contenido: 'paginas/eliminarCarta',
        session: req.session
    });
}

export function viewAddCardInventario(req, res) {
    res.render('pagina', {
        contenido: 'paginas/añadirAlInventario',
        session: req.session
    });
}

export function viewEliminateCardsUsuario(req, res) {
    res.render('pagina', {
        contenido: 'paginas/eliminarCartasUsuario',
        session: req.session
    });
}

export function viewGestionarCartas(req, res) {
    const cartas = Carta.obtenerCartasPertenecientesAlUsuario(req.session.nombre);
    res.render('pagina', {
        contenido: 'paginas/gestionarCartas',
        session: req.session,
        cartas,
        EnumColecciones,
        EnumRarezas
    });
}

export function doEliminateCard(req, res) {
    if (!Carta.cartaExiste(req.body.name)) {
      return res.render('pagina', {
        contenido: 'paginas/eliminarCarta',
        mensaje: 'Error al borrar la carta',
        session: req.session,
      });
    } else {
      if (req.session.esAdmin) {
        Carta.deleteByName(req.body.name, req.session.nombre);
        const cartas = Carta.obtenerCartas();
        return res.render('pagina', {
          contenido: 'paginas/administrarCartas',
          mensaje: 'Carta borrada con éxito',
          cartas,
          session: req.session,
          EnumColecciones,
          EnumRarezas,
        });
      }
      else if (!req.session.esAdmin) {
        if (Carta.getCreadorByNombre(req.body.name) == req.session.nombre) {
          Carta.deleteByName(req.body.name, req.session.nombre);
          const cartas = Carta.obtenerCartasPertenecientesAlUsuario(req.session.nombre);
          return res.render('pagina', {
            contenido: 'paginas/gestionarCartas',
            mensaje: 'Carta borrada con éxito',
            cartas,
            session: req.session,
            EnumColecciones,
            EnumRarezas,
          });
        } else {
            console.log(Carta.getCreadorByNombre(req.body.name));
            console.log(req.session.nombre);
          return res.render('pagina', {
            contenido: 'paginas/eliminarCarta',
            mensaje: 'No tienes permisos para borrar esta carta',
            session: req.session,
          });
        }
      }
    }
  }
  
//OBSOLETO
export function doEliminateCardsUsuario(req,res){
    const usuario = req.body.name.trim();
    Carta.deleteAllCartasUsuario(usuario);
    const cartas = Carta.obtenerCartas();
    
    res.render('pagina', {
        contenido: 'paginas/administrarCartas',
        cartas,
        mensaje: 'Todas las cartas del usuario eliminadas con éxito',
        session: req.session,
        EnumColecciones,
        EnumRarezas
    });
}


export function doCreateCard(req,res){
    const nombre = req.body.nombre.trim();
    const rareza = req.body.rareza.trim();
    const vida = req.body.vida.trim();
  // Multer rellena req.file
  if (!req.file) {
    return res.render('pagina', {
        contenido: 'paginas/añadirCarta',
        mensaje:   'Debes subir una imagen',
        session:   req.session,
      });
    }

        const imagen = `/img/${req.file.filename}`;  // <-- ruta pública
        const vidaNum = Number(vida);
        const rarezaNum = Number(rareza);

        if (typeof vidaNum !== 'number' ||  vidaNum < 1 || vidaNum > 1000) {
            throw new Error('La vida tiene que estar entre 1 y 1000');
        }

        if (typeof rarezaNum !== 'number' ||  rarezaNum < 1 || rarezaNum > 4) {
            throw new Error('Esta rareza no existe');
        }

        if (typeof nombre !== 'string' || nombre.trim() === '') {
            throw new Error('El nombre debe ser un texto no vacío');
        }

        if (typeof imagen !== 'string' || nombre.trim() === '') {
            throw new Error('la imagen debe ser una url');
        }

        if (Carta.cartaExiste(nombre)) {
            throw new Error(`La carta con el nombre "${nombre}" ya existe`);
        }

    if(req.session.esAdmin) {
        Carta.crearCarta(nombre,0,rareza,vida,null,imagen);
        const cartas = Carta.obtenerCartas();
        return res.render('pagina', {
            contenido: 'paginas/administrarCartas',
            mensaje: 'Carta creada con éxito y añadida a tu inventario',
            cartas,
            session: req.session,
            EnumColecciones,
            EnumRarezas
        });
    }
    else {
        Carta.crearCarta(nombre,1,rareza,vida,req.session.nombre, imagen);
        const cartas = Carta.obtenerCartasPertenecientesAlUsuario(req.session.nombre);
        return res.render('pagina', {
            contenido: 'paginas/gestionarCartas',
            mensaje: 'Carta creada con éxito',
            cartas,
            session: req.session,
            EnumColecciones,
            EnumRarezas
        });
    }
        
}

export function doModifyCard(req, res) {
    const nombre = req.body.nombre.trim();
    const nombre2 = req.body.nombre2.trim();
    const rareza = req.body.rareza.trim();
    const vida = req.body.vida.trim();
    
    const cartaActual = Carta.getCartaByName(nombre);

    const imagen = req.file
      ? `/img/${req.file.filename}`
      : cartaActual.Imagen;
    
        if(Carta.cartaExiste(nombre)){
            if(req.session.esAdmin){
        Carta.actualizarCampos(nombre,nombre2, rareza, vida, imagen);
        const cartas = Carta.obtenerCartas();
        return res.render('pagina', {
            contenido: 'paginas/administrarCartas',
            mensaje: 'Carta actualizada con éxito',
            cartas,
            session: req.session,
            EnumColecciones,
            EnumRarezas
        });
    }
    else if(Carta.getCreadorByNombre(nombre) == req.session.nombre){
        Carta.actualizarCampos(nombre,nombre2, rareza, vida, imagen);
        const cartas = Carta.obtenerCartasPertenecientesAlUsuario(req.session.nombre);
        return res.render('pagina', {
            contenido: 'paginas/gestionarCartas',
            mensaje: 'Carta actualizada con éxito',
            cartas,
            session: req.session,
            EnumColecciones,
            EnumRarezas
        });
    }
    else{
        return res.render('pagina', {
            contenido: 'paginas/modifyCard',
            mensaje: 'No tienes permisos para modificar esta carta' ,
            session: req.session
        });
    }
}
        else{
        return res.render('pagina', {
            contenido: 'paginas/modifyCard',
            mensaje: 'La carta no existe ' ,
            session: req.session
        });
    }
}



