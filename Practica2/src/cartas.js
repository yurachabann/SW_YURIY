export class Carta {
    static #insertStmt = null;  //Priv almacena sentencia insert
    static #getAllStmt = null;  //Priv alamcena select

    static initConsultas(db) {
        if (this.#insertStmt !== null) return;  //Si ya estan inicialidadas no hace nada
        this.#insertStmt = db.prepare(
            'INSERT INTO cartas (id, nombre, imagen) VALUES (@id, @nombre, @imagen)'    //Sentencia para insertar cartas
        );
        this.#getAllStmt = db.prepare('SELECT * FROM cartas');      //Seleccionar carta
    }

    static agregarCarta(id, nombre, imagen) {
        try {
            this.#insertStmt.run({ id, nombre, imagen });   //Intenta insertar con los valores dados 
        } catch (e) {
            throw new Error(`No se pudo insertar la carta: ${e.message}`);  //Si falla
        }
    }

    static obtenerCartas() {
        return this.#getAllStmt.all();  //Devuelve todas las cartas 
    }
}
