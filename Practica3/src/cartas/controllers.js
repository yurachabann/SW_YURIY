import { body } from 'express-validator';
import { Carta, EnumColecciones, EnumRarezas } from './Cartas.js'

export function viewAddCard(req, res) {
    res.render('pagina', {
        contenido: 'paginas/añadirCarta',
        session: req.session
    });
}

export function viewModifyCard(req, res) {
    res.render('pagina', {
        contenido: 'paginas/modifyCard',
        session: req.session,
    });
}

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

export function viewGestionarCartas(req, res) {
    const cartas = Carta.obtenerCartasCreadasPorUsuario(req.session.nombre);
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
        Carta.deleteByName(req.body.name);
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
          Carta.deleteByName(req.body.name);
          const cartas = Carta.obtenerCartasCreadasPorUsuario(req.session.nombre);
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
  

export function doEliminateCards(req,res){

    Carta.deleteAllCartas();
    const cartas = Carta.obtenerCartas();
    
    res.render('pagina', {
        contenido: 'paginas/administrarCartas',
        cartas,
        mensaje: 'Todas las cartas eliminadas con éxito',
        session: req.session

    });
}


export function doAddCard(req,res){
    const nombre = req.body.nombre.trim();
    const rareza = req.body.rareza.trim();
    const vida = req.body.vida.trim();
    //const imagen = req.body.imagen.trim();
      // Multer rellena req.file
  if (!req.file) {                      // por si el usuario no adjunta nada
    return res.render('pagina', {
        contenido: 'paginas/añadirCarta',   // ← la vista que quieres
        mensaje:   'Debes subir una imagen',
        session:   req.session,
      });
    }

  const imagen = `/img/${req.file.filename}`;  // <-- ruta pública
    if(req.session.esAdmin) {
        Carta.agregarCarta(nombre,0,rareza,vida,null,imagen);
        const cartas = Carta.obtenerCartas();
        return res.render('pagina', {
            contenido: 'paginas/administrarCartas',
            mensaje: 'Carta añadida con éxito',
            cartas,
            session: req.session,
            EnumColecciones,
            EnumRarezas
        });
    }
    else {
        Carta.agregarCarta(nombre,1,rareza,vida,req.session.nombre, imagen);
        const cartas = Carta.obtenerCartasCreadasPorUsuario(req.session.nombre);
        return res.render('pagina', {
            contenido: 'paginas/gestionarCartas',
            mensaje: 'Carta añadida con éxito',
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
    
        if(Carta.cartaExiste(nombre)){
            if(req.session.esAdmin){
        Carta.actualizarCampos(nombre,nombre2, rareza, vida);
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
        Carta.actualizarCampos(nombre,nombre2, rareza, vida);
        const cartas = Carta.obtenerCartasCreadasPorUsuario(req.session.nombre);
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

