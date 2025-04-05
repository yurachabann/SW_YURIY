import { body } from 'express-validator';
import { Carta } from '../cartas/Cartas.js';
import { Mazo } from '../mazos/Mazos.js';

export function viewAddMazo(req, res) {
    let contenido = 'paginas/login';

        try {
            const cartas = Carta.obtenerCartas();
            contenido = 'paginas/addMazo';

            return res.render('pagina', {
                contenido,
                session: req.session,
                cartas
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


export function doAddMazo(req, res) {
    body('nombre').escape();
    const username = req.session.nombre;
    console.log("usuairo " + username);
    const nombre = req.body.nombre.trim();
    const rawCartas = req.body.cartas;

    try {
        if (!nombre || !rawCartas) {
            throw new Error("Faltan campos obligatorios.");
        }

        const cartasSeleccionadas = Array.isArray(rawCartas)
            ? rawCartas
            : [rawCartas];

        if (cartasSeleccionadas.length > 10) {
            throw new Error("Solo puedes seleccionar hasta 10 cartas.");
        }

        if (Mazo.mazoExiste(nombre)) {
            throw new MazoYaExiste(nombre);
        }

        const cartasJSON = JSON.stringify(cartasSeleccionadas);

        
        //Mazo.actualizarCampos(nombre, cartasJSON, username);
        Mazo.guardar(nombre,cartasJSON,username);
        console.log('Mazo guardado:', {
            nombre,
            username,
            cartasSeleccionadas
        });

        res.render('pagina', {
            contenido: 'paginas/user',
            session: req.session,
            mensaje: 'Mazo creado exitosamente.'
        });

    } catch (error) {
        console.error('Error al agregar mazo:', error.message);

        res.status(400).render('pagina', {
            contenido: 'paginas/user',
            session: req.session,
            error: error.message
        });
    }
}


export function viewModificarMazo(req, res) {
    const cartas = Carta.obtenerCartas();
    res.render('pagina', {
        contenido: 'paginas/modificarMazo',
        session: req.session,
        cartas: cartas
    });
}


export function doModificarMazo(req, res) {

    body('nombre').escape();
    body('nombre2').escape();
    const nombre = req.body.nombre.trim();
    const nombre2 = req.body.nombre2.trim();

    const username = req.session.nombre;
    console.log("usuairo " + username);
    const rawCartas = req.body.cartas;
    const cartasSeleccionadas = Array.isArray(rawCartas)
    ? rawCartas
    : [rawCartas];
    const cartasJSON = JSON.stringify(cartasSeleccionadas);

        const cartas = Carta.obtenerCartas();

        if(Mazo.mazoExiste(nombre)){
            if (Mazo.mazoExisteParaUsuario(nombre, username)) {
        Mazo.actualizarCampos(nombre,cartasJSON, username, nombre2);
        return res.render('pagina', {
            contenido: 'paginas/modificarMazo',
            cartas
        });
    }
    }
        else{
        return res.render('pagina', {
            contenido: 'paginas/modificarMazo',
            //error: 'El mazo no existe o no es tuyo ' ,
        });
    }
}

export function viewEliminarMazo(req, res) {
    res.render('pagina', {
        contenido: 'paginas/eliminarMazo',
        session: req.session
    });
}

export function doEliminarMazo(req, res) {
    const username = req.session.nombre;
    const mazoName = req.body.name;
    
    if (!Mazo.mazoExiste(mazoName)) {
      return res.render('pagina', {
        contenido: 'paginas/eliminarMazo',
        error: 'El mazo no existe.',
        session: req.session
      });
    }
  
    const mazo = Mazo.getMazoByName(mazoName);
  
    if (mazo.creador !== username) {
      return res.render('pagina', {
        contenido: 'paginas/eliminarMazo',
        error: 'No tienes permiso para borrar este mazo.',
        session: req.session
      });
    }
  
    Mazo.deleteByNombre(mazoName);
    return res.render('pagina', {
      contenido: 'paginas/eliminarMazo',
      mensaje: 'Mazo borrado con éxito.',
      session: req.session
    });
  }
  


export function doMisMazos(req, res) {
    /*
    res.render('pagina', {
        contenido: 'paginas/aniadirUsuario',
        session: req.session
    });
    */
}

export function viewMisMazos(req, res) {
    const username = req.session.nombre;
    const mazos = Mazo.obtenerMisMazos(username);


    res.render('pagina', {
        contenido: 'paginas/misMazos',
        mazos,
        session: req.session
    });
}

