
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
   
    #id;
    nombre;
    coleccion;
    rareza;
    vida;
    #creador;
    imagen;
    
    constructor(nombre, coleccion, rareza, vida, id = null, creador = null, imagen = "https://i.pinimg.com/736x/b4/49/0a/b4490a5661fb671aa2c1b13daa2e7faa.jpg") {
        this.nombre = nombre;
        this.coleccion = coleccion;
        this.rareza = rareza;
        this.vida = vida;
        this.#id = id;
        this.#creador = creador;
        this.imagen = imagen;
    }

    static #insertSmth = null; 
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
    static #getCartasOfUsuario = null;

    static initStatements(db) {
        if (this.#insertSmth !== null) return; 
        this.#insertSmth = db.prepare(
            'INSERT INTO Cartas (nombre, coleccion, rareza, vida, creador, imagen) VALUES (@nombre, @coleccion, @rareza, @vida, @creador, @imagen)'
        );
        this.#getAll = db.prepare('SELECT * FROM Cartas');
        this.#exists = db.prepare('SELECT COUNT(*) as count FROM Cartas WHERE nombre = @nombre');
        this.#getByNombre = db.prepare('SELECT * FROM Cartas WHERE nombre = @nombre');
        this.#updateCarta = db.prepare('UPDATE Cartas SET nombre = @nombreNew, coleccion = @coleccion, rareza = @rareza, vida = @vida WHERE nombre = @nombre');
        this.#delete = db.prepare('DELETE FROM Cartas WHERE nombre = @name');
       // this.#deleteAll = db.prepare('DELETE FROM Cartas');
        this.#getByCreador = db.prepare('SELECT * FROM Cartas WHERE creador = @creador')
        this.#getCreadorByName = db.prepare('SELECT creador FROM Cartas WHERE nombre = @nombre')
        this.#deleteCarta = db.prepare('DELETE FROM MazoCartas WHERE carta_id = @id');
        this.#deleteAllCartasOfUsuario = db.prepare('DELETE FROM Cartas where creador = @creador');
        this.#deleteAllCartasOfUsuario2 = db.prepare('DELETE FROM MazoCartas where carta_id = @id')
        this.#getCartasOfUsuario = db.prepare('SELECT id FROM Cartas WHERE creador = @creador')

    }

    static getCartasUsuario(usuario){
        const cartas = this.#getCartasOfUsuario({creador : usuario});
        return cartas;
    }

    static deleteByName(name) {
        const carta = this.getCartaByName(name);
        let id = carta.#id;
        this.#deleteCarta.run({id});
        const result = this.#delete.run({ name });
        if (result.changes === 0) throw new CartaNoEncontrada(name);
    }
 
    static cartaExiste(nombre) {
        if (this.#exists === null) {
            throw new Error("La base de datos no está inicializada. Llama a initStatements(db) primero.");
        }
        const carta = this.#getByNombre.get({ nombre });
        return carta !== undefined;
    }

    static agregarCarta(nombre, coleccion, rareza, vida, creador, imagen) {
        const coleccionNum = Number(coleccion);
        const vidaNum = Number(vida);
        const rarezaNum = Number(rareza);

        if (typeof coleccionNum !== 'number' || coleccionNum < 0 || coleccionNum > 1) {
            throw new Error('Dicha coleccion no existe');
        }

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

        if (this.cartaExiste(nombre)) {
            throw new Error(`La carta con el nombre "${nombre}" ya existe`);
        }

        try {
            this.#insertSmth.run({ nombre, coleccion, rareza, vida, creador, imagen });
        } catch (e) {
            throw new Error(`No se pudo insertar la carta: ${e.message}`);
        }
    }

    static obtenerCartas() {
        return this.#getAll.all();
    }

    static obtenerCartasCreadasPorUsuario(creador) {
        return this.#getByCreador.all({ creador });
    }

    static deleteAllCartasUsuario(usuario) {
        const mazos = this.#getCartasOfUsuario.all({ creador: usuario });
        
        for (const { id } of mazos) {
            this.#deleteAllCartasOfUsuario2.run({ id });
        }
        
        const result = this.#deleteAllCartasOfUsuario.run({ creador: usuario });
        
        if (result.changes === 0) throw new CartaNoEncontrada(usuario);
    }

    static #insert(carta) {
            let result = null;
            try {
                const nombre = carta.nombre;
                const fuerza = carta.fuerza;
                const tipoCarta = carta.tipoCarta;
                const datos = {nombre, fuerza, tipoCarta};
    
                result = this.#insert.run(datos);
    
                usuario.#id = result.lastInsertRowid;
            } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
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

            const datos = { nombre, nombreNew, coleccion, rareza, vida, id: carta.id };
    
    
            const result = this.#updateCarta.run(datos);
            if (result.changes === 0) throw new CartaNoEncontrada(nombre);
    
            return carta;
        }
    

    persist() {
        if (this.#id === null) return Carta.#insert(this);
        return Carta.#update(this);
    }

    static getCartaByName(nombre) {
        const carta = this.#getByNombre.get({ nombre });
        console.log("Fetching card with nombre:", nombre); 
        if (carta === undefined) throw new CartaNoEncontrada(nombre);
    
        const { nombre: cartaNombre, coleccion, rareza, vida, id } = carta;
    
        return new Carta(cartaNombre, coleccion, rareza, vida, id);
    }
    
    static getCreadorByNombre(nombre) {
        const row = this.#getCreadorByName.get({ nombre });
        if (!row) throw new CartaNoEncontrada(nombre);
      
        return row.creador;
    }

    static actualizarCampos(nombre, nombre2, rareza, vida) {
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