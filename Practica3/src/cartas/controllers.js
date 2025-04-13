import { body } from 'express-validator';
import { Carta, RolesEnum } from './Cartas.js'

export function viewAddCard(req, res) {
    res.render('pagina', {
        contenido: 'paginas/añadirCarta',
        session: req.session
    });
}

export function viewModifyCard(req, res) {
    res.render('pagina', {
        contenido: 'paginas/modifyCard',
        session: req.session
    });
}

export function administrarCartas(req, res) {
    const cartas = Carta.obtenerCartas();
    
    res.render('pagina', {
        contenido: 'paginas/administrarCartas',
        cartas,
        session: req.session
    });
}


export function viewEliminateCard(req, res) {
    res.render('pagina', {
        contenido: 'paginas/eliminarCarta',
        session: req.session
    });
}

export function doEliminateCard(req,res){
      if(!Carta.cartaExiste(req.body.name)){
      return res.render('pagina', {
          contenido: 'paginas/eliminarCarta',
          mensaje: 'Error al borrar la carta ',
          session: req.session
      });
  }
      else {
          Carta.deleteByName(req.body.name);
          const cartas = Carta.obtenerCartas();
          return res.render('pagina', {
          contenido: 'paginas/administrarCartas',
          mensaje: 'Carta borrada con éxito',
          cartas,
          session: req.session
          });
  
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
    const fuerza = req.body.fuerza.trim();
    const tipoCarta = req.body.tipocarta.trim();
        Carta.agregarCarta(nombre,fuerza,tipoCarta);
        const cartas = Carta.obtenerCartas();
        return res.render('pagina', {
            contenido: 'paginas/administrarCartas',
            mensaje: 'Carta añadida con éxito',
            cartas,
            session: req.session
        });
}

export function doModifyCard(req, res) {
    body('nombre').escape();
    body('nombre2').normalizeEmail();
    body('power2').escape();
    body('tipoCarta').isIn([RolesEnum.FUEGO, RolesEnum.AGUA, RolesEnum.AIRE, RolesEnum.HIELO]); 

    const nombre = req.body.nombre.trim();
    const nombre2 = req.body.nombre2.trim() || nombre;
    const fuerza2 = req.body.power2.trim() || Carta.getFuerzaByNombre(nombre);
    const tipoCarta = req.body.tipoCarta.trim() || Carta.getTipoCartaByNombre(nombre);

        if(Carta.cartaExiste(nombre)){
        Carta.actualizarCampos(nombre,nombre2, fuerza2, tipoCarta);
        const cartas = Carta.obtenerCartas();
        return res.render('pagina', {
            contenido: 'paginas/administrarCartas',
            mensaje: 'Carta actualizada con éxito',
            cartas,
            session: req.session
        });
    }
        else{
        return res.render('pagina', {
            contenido: 'paginas/modifyCard',
            mensaje: 'La carta no existe ' ,
            session: req.session
        });
    }
}

