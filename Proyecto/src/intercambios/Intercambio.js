
export class Intercambio {
   
    #id;
    usuarioQueSolicita;
    cartaQueQuiere;
    cartaQueDa;

    constructor(usuarioQueSolicita, cartaQueQuiere, cartaQueDa, id = null) {
        this.usuarioQueSolicita = usuarioQueSolicita;
        this.cartaQueQuiere = cartaQueQuiere;
        this.cartaQueDa = cartaQueDa;
        this.#id = id;
    }

    static #nuevoIntercambio = null;
    static #intercambioCompletado = null; //borra el intercambio de la lista cuando ya se produjo
    static #getAll = null; 
    static #existe = null;

    static initStatements(db) {
        if (this.#nuevoIntercambio !== null) return; 
        this.#nuevoIntercambio = db.prepare(
            'INSERT INTO Intercambios (usuarioQueSolicita, cartaQueQuiere, cartaQueDa) VALUES (@usuarioQueSolicita, @cartaQueQuiere, @cartaQueDa)'
        );
        this.#intercambioCompletado = db.prepare('DELETE FROM Intercambios WHERE usuarioQueSolicita = @usuarioQueSolicita AND cartaQueQuiere = @cartaQueQuiere');
        this.#getAll = db.prepare('SELECT * FROM Intercambios');
        this.#existe = db.prepare('SELECT COUNT(*) as count FROM Intercambios WHERE usuarioQueSolicita = @usuarioQueSolicita AND cartaQueQuiere = @cartaQueQuiere');
    }

    static delete(usuarioQueSolicita, cartaQueQuiere) {
        const result = this.#intercambioCompletado.run({usuarioQueSolicita, cartaQueQuiere});
        if (result.changes === 0) throw new IntercambioNoEncontrado(usuarioQueSolicita, cartaQueQuiere);
    }
 
    static obtenerIntercambios() {
        return this.#getAll.all();
    }

    static comprobarSiExiste(usuarioQueSolicita, cartaQueQuiere){
        const exists = this.#existe.run({usuarioQueSolicita, cartaQueQuiere});
        return exists;
    }

    static guardarIntercambio(usuarioQueSolicita, cartaQueQuiere, cartaQueDa){
        this.#nuevoIntercambio.run({usuarioQueSolicita,cartaQueQuiere,cartaQueDa});
    }
    /*
    static obtenerCartasCreadasPorUsuario(creador) {
        return this.#getByCreador.all({ creador });
    }
    */

    /*
    static deleteAllCartasUsuario(usuario) {
        const mazos = this.#getCartasOfUsuario.all({ creador: usuario });
        
        for (const { id } of mazos) {
            this.#deleteAllCartasOfUsuario2.run({ id });
        }
        
        const result = this.#deleteAllCartasOfUsuario.run({ creador: usuario });
        
        if (result.changes === 0) throw new CartaNoEncontrada(usuario);
    }*/

    static #insert(intercambio) {
            let result = null;
            try {
                const usuarioQueSolicita = intercambio.usuarioQueSolicita;
                const cartaQueQuiere = intercambio.cartaQueQuiere;
                const cartaQueDa = intercambio.cartaQueDa;
                const datos = {usuarioQueSolicita, cartaQueQuiere, cartaQueDa};
    
                result = this.#insert.run(datos);
    
                intercambio.#id = result.lastInsertRowid;
            } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
                if (e.code === 'SQLITE_CONSTRAINT') {
                    throw new IntercambioYaExiste(usuarioQueSolicita,cartaQueQuiere);
                }
                throw new ErrorDatos('No se ha insertado el intercambio', { cause: e });
            }
            return intercambio;
        }
    
        /*
        static #update(carta, nombreNew) {
            const nombre = carta.nombre;
            const coleccion = carta.coleccion;
            const rareza = carta.rareza;
            const vida = carta.vida;

            const datos = { nombre, nombreNew, coleccion, rareza, vida, id: carta.id };
    
    
            const result = this.#updateCarta.run(datos);
            if (result.changes === 0) throw new CartaNoEncontrada(nombre);
    
            return carta;
        }*/
    

    persist() {
        /*if (this.#id === null) return Carta.#insert(this);*/
        /*return Carta.#update(this);*/
        return Intercambio.#insert(this);
    }

    /*
    static getCartaByName(nombre) {
        const carta = this.#getByNombre.get({ nombre });
        console.log("Fetching card with nombre:", nombre); 
        if (carta === undefined) throw new CartaNoEncontrada(nombre);
    
        const { nombre: cartaNombre, coleccion, rareza, vida, id } = carta;
    
        return new Carta(cartaNombre, coleccion, rareza, vida, id);
    }*/
    
        /*
    static getCreadorByNombre(nombre) {
        const row = this.#getCreadorByName.get({ nombre });
        if (!row) throw new CartaNoEncontrada(nombre);
      
        return row.creador;
    }*/

        /*
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
         */

}

export class IntercambioNoEncontrado extends Error {
    /**
     * 
     * @param {string} usuario
     * @param {string} carta
     * @param {ErrorOptions} [options]
     */
    constructor(usuario, options) {
        super(`Intercambio no encontrada: ${usuario} que quiere la carta ${carta}`, options);
        this.name = 'IntercambioNoEncontrado';
    }
}

export class IntercambioYaExiste extends Error {
    /**
     * 
     * @param {string} usuario 
     * @param {string} carta 
     * @param {ErrorOptions} [options]
     */
    constructor(nombre, options) {
        super(`Intercambio no encontrada: ${usuario} que quiere la carta ${carta}`, options);
        this.name = 'CartaYaExiste';
    }
}