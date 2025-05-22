
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
    static #getAvailable = null; //intercambios que el usuario puede realizar, y que no son suyos

    static initStatements(db) {
        if (this.#nuevoIntercambio !== null) return; 
        this.#nuevoIntercambio = db.prepare(
            'INSERT INTO Intercambios (usuarioQueSolicita, cartaQueQuiere, cartaQueDa) VALUES (@usuarioQueSolicita, @cartaQueQuiere, @cartaQueDa)'
        );
        this.#intercambioCompletado = db.prepare('DELETE FROM Intercambios WHERE usuarioQueSolicita = @usuarioQueSolicita AND cartaQueQuiere = @cartaQueQuiere');
        this.#getAll = db.prepare('SELECT * FROM Intercambios'); //en desuso
        this.#existe = db.prepare('SELECT COUNT(*) as count FROM Intercambios WHERE usuarioQueSolicita = @usuarioQueSolicita AND cartaQueQuiere = @cartaQueQuiere');
       // this.#getOthers = db.prepare('SELECT * FROM Intercambios WHERE usuarioQueSolicita != @usuarioActual');
        this.#getAvailable = db.prepare('SELECT I.* FROM Intercambios AS I JOIN UsuariosCartas AS U ON I.cartaQueQuiere = U.carta_id WHERE I.usuarioQueSolicita != @usuarioActual AND U.usuario = @usuarioActual');
    }

    static delete(usuarioQueSolicita, cartaQueQuiere) {
        const result = this.#intercambioCompletado.run({usuarioQueSolicita, cartaQueQuiere});
        if (result.changes === 0) throw new IntercambioNoEncontrado(usuarioQueSolicita, cartaQueQuiere);
    }
 
    static obtenerIntercambios(usuarioActual) {
        return this.#getAvailable.all({ usuarioActual });
    }

    static comprobarSiExiste(usuarioQueSolicita, cartaQueQuiere){
        const { count } = this.#existe.get({ usuarioQueSolicita, cartaQueQuiere });
        return count > 0;
    }

     static eliminarIntercambio(usuarioQueSolicita, cartaQueQuiere) {
        const result = this.#intercambioCompletado.run({ usuarioQueSolicita, cartaQueQuiere });
        if (result.changes === 0) {
            throw new IntercambioNoEncontrado(usuarioQueSolicita, cartaQueQuiere);
        }
        return result;
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
            } catch(e) {
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