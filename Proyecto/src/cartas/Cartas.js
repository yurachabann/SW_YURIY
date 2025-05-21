import * as fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

export const EnumColecciones = {
    0: 'Estandar',
    1: 'Custom'
  };
  
export const EnumRarezas = {
    1: 'Común',
    2: 'Rara',
    3: 'Épica',
    4: 'Legendaria'
  };

export class Carta {
   
    id;
    nombre;
    coleccion;
    rareza;
    vida;
    #creador;
    Imagen;
    
    constructor(nombre, coleccion, rareza, vida, id = null, creador = null, Imagen = "https://i.pinimg.com/736x/b4/49/0a/b4490a5661fb671aa2c1b13daa2e7faa.jpg") {
        this.nombre = nombre;
        this.coleccion = coleccion;
        this.rareza = rareza;
        this.vida = vida;
        this.id = id;
        this.#creador = creador;
        this.Imagen = Imagen;
    }

    static #insertCartaBBDD = null; //insertar la carta en la BBDD
    static #getAll = null; 
    static #exists = null; 
    static #getByNombre = null; 
    static #updateCarta = null;
    static #delete = null;
    static #getByCreador = null;
    static #getCreadorByName = null;
    static #deleteCarta = null;
    static #deleteAllCartasOfUsuario = null; //para borrar las cartas de la tabla Cartas
    static #deleteAllCartasOfUsuario2 = null; //para borrar las cartas de la tabla MazoCartas
     static #deleteAllCartasOfUsuario3 = null; //para borrar las cartas de la tabla UsuarioCartas
    static #getTodasCartasMenosUsuario = null; //cartas que el usuario puede pedir en el intercambio. Logicamente no puede
    //pedir una carta que ya tiene. El proposito del intercambio es pedir cartas que no tienes todavia
    static #getImagenPorId = null;
    static #getCardPorId = null;
    static #getColeccionEstandar = null;
    static #getColeccionCustom = null;

    static #insertarCarta = null; //insertar la carta en la tabla UsuariosCartas que relaciona los usuarios y las cartas
    //que les pertenecen
    static #borrarCartaUsuario = null; //borrar la carta de la tabla de pertenencia
    static #borrarCartasTodosUsuarios = null; //cuando admin borra una carta, se borra para todos
    static #getCartasOfUsuario = null;

    static initStatements(db) {
        
        if (this.#insertCartaBBDD !== null) return;    
        this.#insertCartaBBDD = db.prepare(
            'INSERT INTO Cartas (nombre, coleccion, rareza, vida, creador, Imagen) VALUES (@nombre, @coleccion, @rareza, @vida, @creador, @Imagen)'
        );

        this.#getAll = db.prepare('SELECT * FROM Cartas');
        this.#exists = db.prepare('SELECT COUNT(*) as count FROM Cartas WHERE nombre = @nombre');
        this.#getByNombre = db.prepare('SELECT * FROM Cartas WHERE nombre = @nombre');
        this.#updateCarta = db.prepare('UPDATE Cartas SET nombre = @nombreNew, coleccion = @coleccion, rareza = @rareza, vida = @vida, Imagen = @imagen WHERE nombre = @nombre');
        this.#delete = db.prepare('DELETE FROM Cartas WHERE nombre = @name');
        this.#getByCreador = db.prepare('SELECT * FROM Cartas WHERE creador = @creador')
        this.#getCreadorByName = db.prepare('SELECT creador FROM Cartas WHERE nombre = @nombre')
        this.#deleteAllCartasOfUsuario = db.prepare('DELETE FROM Cartas where creador = @creador');
        //this.#getCartasOfUsuario = db.prepare('SELECT * FROM Cartas WHERE creador = @creador')
        this.#getImagenPorId = db.prepare('SELECT Imagen FROM Cartas WHERE id = @id');
        this.#getCardPorId = db.prepare('SELECT * FROM Cartas WHERE id = @id');
        this.#getColeccionEstandar = db.prepare('SELECT * FROM Cartas WHERE creador IS NULL');
        this.#getColeccionCustom = db.prepare('SELECT * FROM Cartas WHERE creador IS NOT NULL');

        //mazoCartas
        this.#deleteAllCartasOfUsuario2 = db.prepare('DELETE FROM MazoCartas where carta_id = @id')
        this.#deleteCarta = db.prepare('DELETE FROM MazoCartas WHERE carta_id = @id');

        //sentencias de la tabla de pertenencia
        this.#insertarCarta = db.prepare(`INSERT INTO UsuariosCartas (usuario, carta_id) VALUES (@usuario, @carta_id)`);
        this.#borrarCartaUsuario = db.prepare('DELETE FROM UsuariosCartas WHERE usuario = @usuario AND carta_id = @carta_id');
        this.#getCartasOfUsuario = db.prepare('SELECT carta_id FROM UsuariosCartas WHERE usuario = @usuario');
        this.#getTodasCartasMenosUsuario = db.prepare('SELECT * FROM UsuariosCartas WHERE usuario != @usuario');
        this.#deleteAllCartasOfUsuario3 = db.prepare('DELETE FROM UsuariosCartas where usuario = @usuario');
        this.#borrarCartasTodosUsuarios = db.prepare('DELETE FROM UsuariosCartas where carta_id = @carta_id');
    }

    static agregarAlInventario(usuario, carta_id){
        this.#insertarCarta.run({usuario, carta_id})
    }

    static intercambiar(usuarioSolicita, usuarioAcepta, cartaObtiene, cartaDa){ //probablemente el metodo mas lioso. cartaObtiene se refiere a la carta que obtiene el usuario que
        //solicitó el intercambio. cartaDa lo mismo
        try{
         this.#borrarCartaUsuario.run({ usuario: usuarioSolicita, carta_id: cartaDa }); //borramos de la tabla usuarioCartas la carta (de la BBDD no, ya que solo se intercambia)
         this.#insertarCarta.run({ usuario: usuarioAcepta, carta_id: cartaDa }); //el otro usuario obtiene esa carta
         this.#borrarCartaUsuario.run({ usuario: usuarioAcepta, carta_id: cartaObtiene });
         this.#insertarCarta.run({ usuario: usuarioSolicita, carta_id: cartaObtiene });
        }
        catch(err){
            console.error(`Error intercambiando cartas entre ${usuarioSolicita} y ${usuarioAcepta}:`, err);
            throw new Error(`No se pudo completar el intercambio: ${err.message}`);
        }
    }

    static getTodos(){
        return this.#getAll.all();
    }

    static getEstandar(){
        return this.#getColeccionEstandar.all();
    }

    static getCustom(){
        return this.#getColeccionCustom.all();
    }

    static getImagenPorId(id){
        const row = this.#getImagenPorId.get({id});
        return row ? row.Imagen : null;
    }

    static getCardPorId(id){
        const carta = this.#getCardPorId.get({id});
        return carta;
    }

    static getByCreador(creador) {
        return this.#getByCreador.all({ creador });
    }

static deleteByName(name) {
    const carta = this.getCartaByName(name);
    const id = carta.id;
    const imagenDb = carta.Imagen;

    const imagenPorDefecto = 'https://i.pinimg.com/736x/b4/49/0a/b4490a5661fb671aa2c1b13daa2e7faa.jpg';
    if (imagenDb && imagenDb !== imagenPorDefecto) {

      const rutaRelativa = imagenDb.replace(/^\/+/, ''); 
      const rutaImagen = path.join(__dirname, '..', '..', 'static', rutaRelativa);
      console.log('Intentando borrar imagen en:', rutaImagen);

      try {
        fs.unlinkSync(rutaImagen);
        console.log(`Imagen eliminada: ${rutaImagen}`);
      } catch (err) {
        console.warn(`No se pudo borrar la imagen en disco (${rutaImagen}): ${err.message}`);
      }
    }

    this.#borrarCartasTodosUsuarios.run({ carta_id: id }); //borra carta de la tabla de pertenencia para todos
    this.#deleteCarta.run({ id }); //borra carta de MazoCartas
    const result = this.#delete.run({ name }); //borra carta de Cartas

    if (result.changes === 0) {
      throw new CartaNoEncontrada(name);
    }
  }

    static cartaExiste(nombre) {
        if (this.#exists === null) {
            throw new Error("La base de datos no está inicializada. Llama a initStatements(db) primero.");
        }
        const carta = this.#getByNombre.get({ nombre });
        return carta !== undefined;
    }

    static crearCarta(nombre, coleccion, rareza, vida, creador, Imagen) {
        try {
            const info = this.#insertCartaBBDD.run({ nombre, coleccion, rareza, vida, creador, Imagen });
            const cartaInsertada_id = info.lastInsertRowid;
            if(creador != null)
            this.#insertarCarta.run({ usuario: creador, carta_id: cartaInsertada_id }); //si es nulo, lo ha creado un admin. Y Admins no tienen pertenencia de cartas como tal
        } catch (e) {
            throw new Error(`No se pudo insertar la carta: ${e.message}`);
        }
    }

    static obtenerCartas() {
        return this.#getAll.all();
    }

    static obtenerCartasAPedir(usuario) { //cartas que el usuario puede pedir en el intercambio, xq no las posee
        const cartas_ids = this.#getTodasCartasMenosUsuario.all({usuario : usuario});
        const cartas = cartas_ids.map(row => {  
        const carta = this.getCardPorId(row.carta_id);
        // carta es un objeto { id, nombre, coleccion, rareza, vida, creador, imagen }
            console.log(`ID de la carta a procesar: ${carta.id}`);
        return new Carta(
            carta.nombre,
            carta.coleccion,
            carta.rareza,
            carta.vida,
            carta.id,
            carta.creador,
            carta.Imagen
            );
        });
        return cartas;
    }

    static obtenerCartasPertenecientesAlUsuario(usuario) {
        const cartas_ids = this.#getCartasOfUsuario.all({usuario : usuario});
        const cartas = cartas_ids.map(row => {  
        const carta = this.getCardPorId(row.carta_id);
        // carta es un objeto { id, nombre, coleccion, rareza, vida, creador, imagen }
        return new Carta(
            carta.nombre,
            carta.coleccion,
            carta.rareza,
            carta.vida,
            carta.id,
            carta.creador,
            carta.Imagen
            );
        });

  return cartas;
    }

    static deleteAllCartasUsuario(usuario) {
        const mazos = this.#getCartasOfUsuario.all({ usuario: usuario });
        
        for (const { id } of mazos) {
            this.#deleteAllCartasOfUsuario2.run({ id }); //borrado de mazoCartas

        }
        this.#deleteAllCartasOfUsuario3.run({ usuario: usuario });
        const result = this.#deleteAllCartasOfUsuario.run({ creador: usuario });
        
        if (result.changes === 0) throw new FalloBorrado(usuario);
    }

    static #insert(carta) {
            let result = null;
            try {
                const nombre = carta.nombre;
                const fuerza = carta.fuerza;
                const tipoCarta = carta.tipoCarta;
                const datos = {nombre, fuerza, tipoCarta};
    
                result = this.#insertCartaBBDD.run(datos);
    
                usuario.id = result.lastInsertRowid;
            } catch(e) {
                if (e.code === 'SQLITE_CONSTRAINT') {
                    throw new CartaYaExiste(carta.nombre);
                }
                throw new ErrorDatos('No se ha insertado la carta', { cause: e });
            }
            return carta;
        }
    
        static #update(carta, nombreNew) {
            const nombre = carta.nombre;
            const coleccion = carta.coleccion;
            const rareza = carta.rareza;
            const vida = carta.vida;
            const imagen = carta.Imagen;

            const datos = { nombre, nombreNew, coleccion, rareza, vida, id: carta.id, imagen };
    
    
            const result = this.#updateCarta.run(datos);
            if (result.changes === 0) throw new CartaNoEncontrada(nombre);
    
            return carta;
        }
    

    persist() {
        if (this.id === null) return Carta.#insert(this);
        return Carta.#update(this);
    }

    static getCartaByName(nombre) {
        const carta = this.#getByNombre.get({ nombre });
        console.log("Fetching card with nombre:", nombre); 
        if (carta === undefined) throw new CartaNoEncontrada(nombre);
    
        const { nombre: cartaNombre, coleccion, rareza, vida, id, creador, Imagen } = carta;

        return new Carta( cartaNombre, coleccion, rareza, vida, id, creador, Imagen );
    }
    
    static getCreadorByNombre(nombre) {
        const row = this.#getCreadorByName.get({ nombre });
        if (!row) throw new CartaNoEncontrada(nombre);
      
        return row.creador;
    }

    static actualizarCampos(nombre, nombre2, rareza, vida, imagen) {
        let carta = this.getCartaByName(nombre);
     
         if (nombre2.trim() !== "") {
             //carta.nombre = nombre2;
         }
     
         if (rareza.trim() !== "") {
             carta.rareza = rareza;
         }
     
         if (vida.trim() !== "") {
             carta.vida = vida;
         }
     
         carta.Imagen = imagen;
         Carta.#update(carta, nombre2);
     }

}

export class CartaNoEncontrada extends Error {
    /**
     * 
     * @param {string} nombre
     * @param {ErrorOptions} [options]
     */
    constructor(nombre, options) {
        super(`Carta no encontrada: ${nombre}`, options);
        this.name = 'CartaNoEncontrada';
    }
}

export class FalloBorrado extends Error {
    /**
     * 
     * @param {string} nombre
     * @param {ErrorOptions} [options]
     */
    constructor(nombre, options) {
        super(`Fallo al borrar cartas del usuario: ${nombre}`, options);
        this.name = 'FalloBorrado';
    }
}


export class CartaYaExiste extends Error {
    /**
     * 
     * @param {string} nombre 
     * @param {ErrorOptions} [options]
     */
    constructor(nombre, options) {
        super(`Carta ya existe: ${nombre}`, options);
        this.name = 'CartaYaExiste';
    }
}