export const RolesEnum = Object.freeze({
    FUEGO: '1',
    AGUA: '2',
    AIRE: '3',
    HIELO: '4'
});

export class Carta {
   
    #id;
    nombre;
    fuerza;
    tipoCarta;
    
    constructor(nombre, fuerza, tipoCarta = RolesEnum.FUEGO, id = null) {
        this.nombre = nombre;
        this.fuerza = fuerza;
        this.tipoCarta = tipoCarta;
        this.#id = id;
    }

    static #insertSmth = null; 
    static #getAll = null; 
    static #exists = null; 
    static #getByNombre = null; 
    static #updateCarta = null;
    static #delete = null;

    static initConsultas(db) {
        if (this.#insertSmth !== null) return; 
        this.#insertSmth = db.prepare(
            'INSERT INTO Cartas (nombre, fuerza, tipocarta) VALUES (@nombre, @fuerza, @tipocarta)'
        );
        this.#getAll = db.prepare('SELECT * FROM Cartas');
        this.#exists = db.prepare('SELECT COUNT(*) as count FROM Cartas WHERE nombre = @nombre');
        this.#getByNombre = db.prepare('SELECT * FROM Cartas WHERE nombre = @nombre');
        this.#updateCarta = db.prepare('UPDATE Cartas SET nombre = @nombreNew, fuerza = @fuerza, tipoCarta = @tipoCarta WHERE nombre = @nombre');
        this.#delete = db.prepare('DELETE FROM Cartas WHERE nombre = @name');
    }

    static deleteByName(name) {
        const result = this.#delete.run({ name });
        if (result.changes === 0) throw new CartaNoEncontrada(name);
    }

    static getFuerzaByNombre(nombre) {
        const carta = this.#getByNombre.get({ nombre });
        if (carta === undefined) throw new CartaNoEncontrada(nombre);
    
        return carta.fuerza; 
    }

    static getTipoCartaByNombre(nombre) {
        const carta = this.#getByNombre.get({ nombre });
        if (carta === undefined) throw new CartaNoEncontrada(nombre);
    
        return carta.tipoCarta;  // Return the tipoCarta of the card
    }
    
    
    static cartaExiste(nombre) {
        if (this.#exists === null) {
            throw new Error("La base de datos no está inicializada. Llama a initStatements(db) primero.");
        }
        const carta = this.#getByNombre.get({ nombre });
        return carta !== undefined;
    }

    static agregarCarta(nombre, fuerza, tipocarta) {
        const fuerzaNum = Number(fuerza);
        const tipoCartaNum = Number(tipocarta);

        if (typeof fuerzaNum !== 'number' || fuerzaNum < 1 || fuerzaNum > 200) {
            throw new Error('La fuerza debe ser un número entre 1 y 200');
        }
        if (typeof tipoCartaNum !== 'number' || ![1, 2, 3, 4].includes(tipoCartaNum)) {
            throw new Error('El tipocarta debe ser uno de los siguientes valores: 1, 2, 3 o 4');
        }
        if (typeof nombre !== 'string' || nombre.trim() === '') {
            throw new Error('El nombre debe ser un texto no vacío');
        }
        if (this.cartaExiste(nombre)) {
            throw new Error(`La carta con el nombre "${nombre}" ya existe`);
        }
        try {
            this.#insertSmth.run({ nombre, fuerza, tipocarta });
        } catch (e) {
            throw new Error(`No se pudo insertar la carta: ${e.message}`);
        }
    }

    static obtenerCartas() {
        return this.#getAll.all();
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
            const fuerza = carta.fuerza;
            const tipoCarta = carta.tipoCarta;

            const datos = { nombre, nombreNew, fuerza, tipoCarta, id: carta.id };
    
    
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
        console.log("Fetching card with nombre:", nombre);  // Add this line to see the value of `nombre`
        if (carta === undefined) throw new CartaNoEncontrada(nombre);
    
        const { nombre: cartaNombre, fuerza, tipoCarta, id } = carta; // Destructure the object
    
        return new Carta(cartaNombre, fuerza, tipoCarta, id); // Use cartaNombre here
    }
    
    

    static actualizarCampos(nombre, nombre2, fuerza2, tipoCarta) {
        let carta = this.getCartaByName(nombre);
     
         if (nombre2.trim() !== "") {
             //carta.nombre = nombre2;
         }
     
         if (fuerza2.trim() !== "") {
             carta.fuerza = fuerza2;
         }
     
         if (tipoCarta.trim() !== "") {
             carta.tipoCarta = tipoCarta;
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