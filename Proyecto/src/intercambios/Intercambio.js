
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
        const { count } = this.#existe.get({ usuarioQueSolicita, cartaQueQuiere });
        return count > 0;
    }

    static guardarIntercambio(intercambio){
        return this.#insert(intercambio);
    }

    static #insert(intercambio) {
            let result = null;
            try {
                const usuarioQueSolicita = intercambio.usuarioQueSolicita;
                const cartaQueQuiere = intercambio.cartaQueQuiere;
                const cartaQueDa = intercambio.cartaQueDa;
                
                const datos = {usuarioQueSolicita, cartaQueQuiere, cartaQueDa};
    
                result = this.#nuevoIntercambio.run(datos);
    
                intercambio.#id = result.lastInsertRowid;
            } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
                if (e.code === 'SQLITE_CONSTRAINT') {
                    throw new IntercambioYaExiste(usuarioQueSolicita,cartaQueQuiere);
                }
                throw new ErrorDatos('No se ha insertado el intercambio', { cause: e });
            }
            return intercambio;
        }
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