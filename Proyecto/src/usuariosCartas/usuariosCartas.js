
export class UsuarioCarta{

    //#id;
    usuario_id;
    carta_id;
    
    constructor(usuarioId, cartasIds, id = null) {
        this.usuario_id = usuarioId;
        this.carta_id = cartasIds;
        //this.#id = id;
    }
    
    static #getCartasOfUsuario = null;
    static #borrarCartaUsuario = null;
    static #borrarTodasCartasOfUsuario = null;
    static #insertarCarta = null;

    static initStatements(db) {
        if (this.#getCartasOfUsuario !== null) return;

        this.#getCartasOfUsuario = db.prepare('SELECT carta_id FROM UsuariosCartas WHERE usuario_id = @usuario_id');
        this.#borrarCartaUsuario = db.prepare('DELETE FROM UsuariosCartas WHERE usuario_id = @usuario_id AND carta_id = @carta_id');
        this.#borrarTodasCartasOfUsuario = db.prepare('DELETE FROM UsuariosCartas WHERE usuario_id = @usuario_id');
        this.#insertarCarta = db.prepare(`INSERT INTO UsuariosCartas (usuario_id, carta_id) VALUES (@usuario_id, @carta_id)`);

    }

    static obtenerTodasCartasOfUsuario(usuarioId) {
        return this.#getCartasOfUsuario.all({
            usuario_id: usuarioId
        });
    }

    static guardarCarta(usuarioCarta){
        return this.#insert(usuarioCarta);
    }

    static eliminarCartaUsuario(usuarioId, cartaId) {
        return this.#borrarCartaUsuario.run({
        usuario_id: usuarioId,
        carta_id:   cartaId
        });
    }

    static eliminarTodasCartasUsuario(usuarioId) {
        return this.#borrarTodasCartasOfUsuario.run({
            usuario_id: usuarioId
        });
    }

    static #insert(usuario_carta) {
        let result = null;
        try {
            const usuario_id = usuario_carta.usuario_id;
            const carta_id = usuario_carta.carta_id;
            
            const datos = {carta_id, usuario_id};

            result = this.#insertarCarta.run(datos);

           // mazo.#id = result.lastInsertRowid;

           // const cartaIds = JSON.parse(mazo.cartas);
           // this.#upsertCartas(mazo.#id, cartaIds);

        } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
            if (e.code === 'SQLITE_CONSTRAINT') {
                throw new UsuarioCartaYaExiste(usuario_carta.usuario_id, usuario_carta.carta_id);
            }
            throw new ErrorDatos('No se ha insertado el mazo', { cause: e });
        }
        return mazo;
    }
}

export class UsuarioCartaYaExiste extends Error {
    /**
     * 
     * @param {string} usuario
     * * @param {string} carta
     * @param {ErrorOptions} [options]
     */
    constructor(usuario,carta, options) {
        super(`Carta ya existe: ${usuario}, ${carta}`, options);
        this.name = 'UsuarioCartaYaExiste';
    }
}

