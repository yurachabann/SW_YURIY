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

export function viewAllCartas(req, res) {
    const cartas = Carta.obtenerCartas();
    
    res.render('pagina', {
        contenido: 'paginas/tablaCartas',
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
          error: 'Error al borrar la carta ',
          session: req.session
      });
  }
      else {
          Carta.deleteByName(req.body.name);
          return res.render('pagina', {
          contenido: 'paginas/eliminarCarta',
          error: 'Borrado con exito ',
          session: req.session
          });
  
  }
}

export function doEliminateCards(req,res){

         Carta.deleteAllCartas();
       /* return res.render('pagina', {
        contenido: 'paginas/admin',
        session: req.session
        });
*/
}



export function doAddCard(req,res){
    const nombre = req.body.nombre.trim();
    const fuerza = req.body.fuerza.trim();
    const tipoCarta = req.body.tipocarta.trim();
        Carta.agregarCarta(nombre,fuerza,tipoCarta);
        return res.render('pagina', {
            contenido: 'paginas/añadirCarta',
            error: 'Éxito',
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
        return res.render('pagina', {
            contenido: 'paginas/modifyCard',
            session: req.session
        });
    }
        else{
        return res.render('pagina', {
            contenido: 'paginas/modifyCard',
            error: 'La carta no existe ' ,
            session: req.session
        });
    }
}

