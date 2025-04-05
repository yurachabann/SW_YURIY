
export class Mazo {

    #id;
    nombre;
    creador;
    cartas;
    
    constructor(nombre, creador, cartas, id = null) {
        this.nombre = nombre;
        this.creador = creador;
        this.cartas = cartas;
        this.#id = id;
    }
    
    static #getByUsername = null;
    static #getByName = null;
    static #insertStmt = null;
    static #updateStmt = null;
    static #deleteByNombre = null;
    static #deleteByUsuario = null;
    static #getAll = null;
    static #getMy = null;

    static initStatements(db) {
        if (this.#getByUsername !== null) return;

        this.#getByUsername = db.prepare('SELECT * FROM Mazos WHERE creador = @creador');
        this.#getByName = db.prepare('SELECT * FROM Mazos WHERE nombre = @nombre');
        this.#insertStmt = db.prepare('INSERT INTO Mazos(nombre, creador, cartas) VALUES (@nombre, @creador, @cartas)');
        this.#updateStmt = db.prepare('UPDATE Mazos SET nombre = @nombre, creador = @creador, cartas = @cartas  WHERE id = @id');
        this.#deleteByNombre = db.prepare('DELETE FROM Mazos WHERE nombre = @nombre');
        this.#deleteByUsuario = db.prepare('DELETE FROM Mazos WHERE creador = @creador');
        this.#getAll = db.prepare('SELECT * FROM Mazos');
        this.#getMy = db.prepare('SELECT * FROM Mazos WHERE creador = @username');
    }

    static getMazoByName(name) {
        const mazo = this.#getByName.get({ nombre: name });
        if (mazo === undefined) throw new MazoNoEncontrado(name);
        const { nombre, creador, cartas, id } = mazo;
        return new Mazo(nombre, creador, cartas, id);
    }
    

    static getMazoByCreador(name) {  //? y si son varios
        const mazo = this.#getByUsername.get({ creador: name });
        if (mazo === undefined) throw new MazoNoEncontrado(name);
        const { nombre, creador, cartas, id } = mazo;
        return new Mazo(nombre, creador, cartas, id);
    }
    

    static #insert(mazo) {
        let result = null;
        try {
            const nombre = mazo.nombre;
            const creador = mazo.creador;
            const cartas = mazo.cartas;
            const datos = {nombre, creador, cartas};

            console.log('[Mazo insert] Datos recibidos:', {
                nombre: mazo.nombre,
                creador: mazo.creador,
                cartas: mazo.cartas
              });

              console.log('[Mazo insert] Ejecutando insert con:', datos);

              

            result = this.#insertStmt.run(datos);

            mazo.#id = result.lastInsertRowid;
        } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
            if (e.code === 'SQLITE_CONSTRAINT') {
                throw new MazoYaExiste(mazo.nombre);
            }
            throw new ErrorDatos('No se ha insertado el mazo', { cause: e });
        }
        return mazo;
    }

    static obtenerMazos() {
        return this.#getAll.all();
    }

    static obtenerMisMazos(username) {
        if (!this.#getMy) {
            throw new Error("Base de datos no inicializada");
        }
        return this.#getMy.all({ username });
    }
    

    static #update(mazo) {
        const nombre = mazo.nombre;
        const creador = mazo.creador;
        const cartas = mazo.cartas;
        const id = mazo.id; // Usa el getter para obtener el id
    
        const datos = { nombre, creador, cartas, id };
    
        const result = this.#updateStmt.run(datos);
        if (result.changes === 0) throw new MazoNoEncontrado(mazo);
    
        return mazo;
    }
    

    get id() {
        return this.#id;
    }

    persist() {
        console.log('Persisting mazo:', this);
        if (this.#id === null) return Mazo.#insert(this);
        return Mazo.#update(this);
    }

    static deleteByUsername(username) {
        const result = this.#deleteByUsuario.run({ creador: username });
        if (result.changes === 0) throw new MazoNoEncontrado(username);
    }
    

    static deleteByNombre(name) {
        const result = this.#deleteByNombre.run({ nombre: name });
        if (result.changes === 0) throw new MazoNoEncontrado(name);
    }
    

    static mazoExiste(name) { //por nombre
        if (this.#getByName === null) {
            throw new Error("La base de datos no está inicializada. Llama a initStatements(db) primero.");
        }
        const mazo = this.#getByName.get({ nombre: name });
        return mazo !== undefined;
    }
    

    static mazoExisteParaUsuario(nombreMazo, usuario) {
        if (this.#getByName === null) {
            throw new Error("La base de datos no está inicializada. Llama a initStatements(db) primero.");
        }
        const mazo = this.#getByName.get({ nombre: nombreMazo });
        return mazo !== undefined && mazo.creador === usuario;
    }
    
    static guardar(nombre, cartas, username) {
        const mazo = new Mazo(nombre, username, cartas, null);
        return mazo.persist();
    }
    

    static actualizarCampos(nombre, cartas, username, nombre2) {
        let mazo;
        // Verificar si ya existe un mazo para el creador
          mazo = this.getMazoByCreador(username);
          if (nombre2.trim() !== "") {
            mazo.nombre = nombre2;
          }
          if (cartas.trim() !== "") {
            mazo.cartas = cartas;
          }
        return mazo.persist();
      }
      
}


export class MazoNoEncontrado extends Error {
    /**
     * 
     * @param {string} username 
     * @param {ErrorOptions} [options]
     */
    constructor(username, options) {
        super(`Mazo no encontrado: ${username}`, options);
        this.name = 'MazoNoEncontrado';
    }
}

export class MazoYaExiste extends Error {
    /**
     * 
     * @param {string} username 
     * @param {ErrorOptions} [options]
     */
    constructor(username, options) {
        super(`Mazo ya existe: ${username}`, options);
        this.name = 'MazoYaExiste';
    }
}

