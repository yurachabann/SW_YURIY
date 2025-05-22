
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
    static #deleteAllMazosOfUsuario = null;

    static #insertCartas = null; //TABLA PARA HACER JOINS ENTRE MAZOS Y CARTAS
    static #getAllWithNames = null;
    static #getMyWithNames = null;
    static #upsertCartas = null;
    static #deleteAllMazosOfUsuario2 = null; //limpia las referencias de mazoCartas cuando queremos eliminar TODOS los mazos de un usuario
    static #deleteCartas = null;
    static #getMazosOfUsuario = null;
    static #countByUsuario = null; //contar los mazos que tiene cada usuario
    

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
        this.#deleteAllMazosOfUsuario = db.prepare('DELETE FROM Mazos WHERE creador = @creador');

        this.#insertCartas = db.prepare('INSERT INTO MazoCartas(mazo_id, carta_id) VALUES (@mazoId, @cartaId)'); //TABLA PARA HACER JOINS ENTRE MAZOS Y CARTAS
        this.#deleteCartas = db.prepare('DELETE FROM MazoCartas WHERE mazo_id = @id');
        this.#deleteAllMazosOfUsuario2 = db.prepare('DELETE FROM MazoCartas WHERE mazo_id = @id');
        
        this.#getAllWithNames = db.prepare(`
            SELECT
              m.id,
              m.nombre,
              m.creador,
              GROUP_CONCAT(c.nombre, ', ') AS cartas
            FROM Mazos m
            LEFT JOIN MazoCartas mc ON mc.mazo_id = m.id
            LEFT JOIN Cartas      c  ON c.id      = mc.carta_id
            GROUP BY m.id
          `);
          
          this.#getMyWithNames = db.prepare(`
            SELECT
              m.id,
              m.nombre,
              m.creador,
              GROUP_CONCAT(c.nombre, ', ') AS cartas
            FROM Mazos m
            LEFT JOIN MazoCartas mc ON mc.mazo_id = m.id
            LEFT JOIN Cartas      c  ON c.id      = mc.carta_id
            WHERE m.creador = @username
            GROUP BY m.id
          `);
         this.#getMazosOfUsuario = db.prepare('SELECT id FROM Mazos WHERE creador = @creador')
         this.#countByUsuario = db.prepare(`SELECT COUNT(*) AS cnt FROM Mazos WHERE creador = @creador`);


   // una pequeña transacción para actualizar la lista de cartas de un mazo
    this.#upsertCartas = db.transaction((id, cartaIds) => {
    this.#deleteCartas.run({ id });
    for (const cartaId of cartaIds)
      this.#insertCartas.run({ mazoId: id, cartaId });
    });
    }

      static tieneMazos(usuario) {
            const row = this.#countByUsuario.get({ creador: usuario });
            return row.cnt > 0;
    }

    static getMazoByName(name) {
        const mazo = this.#getByName.get({ nombre: name });
        if (mazo === undefined) throw new MazoNoEncontrado(name);
        const { nombre, creador, cartas, id } = mazo;
        return new Mazo(nombre, creador, cartas, id);
    }
    
    static deleteAllMazosUsuario(usuario) {
        const mazos = this.#getMazosOfUsuario.all({ creador: usuario });

        for (const { id } of mazos) {
            this.#deleteAllMazosOfUsuario2.run({ id });
        }

        const result = this.#deleteAllMazosOfUsuario.run({ creador: usuario });

        if (result.changes === 0) throw new MazoNoEncontrado(usuario);
    }

    static getMazoByCreador(name) {
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

            const cartaIds = JSON.parse(mazo.cartas);
            this.#upsertCartas(mazo.#id, cartaIds);

        } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
            if (e.code === 'SQLITE_CONSTRAINT') {
                throw new MazoYaExiste(mazo.nombre);
            }
            throw new ErrorDatos('No se ha insertado el mazo', { cause: e });
        }
        return mazo;
    }

    static getByCreador(creador) {
        return this.#getByUsername.all({ creador });
    }

    static obtenerMazos() {
        return this.#getAllWithNames.all();
      }
      
    static obtenerMisMazos(username) {
        return this.#getMyWithNames.all({ username });
    }

    static #update(mazo) {
        const nombre = mazo.nombre;
        const creador = mazo.creador;
        const cartas = mazo.cartas;
        const id = mazo.id;
    
        const datos = { nombre, creador, cartas, id };
    
        const result = this.#updateStmt.run(datos);
        if (result.changes === 0) throw new MazoNoEncontrado(mazo);
        const cartaIds = JSON.parse(mazo.cartas);
        this.#upsertCartas(mazo.id, cartaIds);
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

    static deleteByUsername(username) { //NO SE USA
        const result = this.#deleteByUsuario.run({ creador: username });
        if (result.changes === 0) throw new MazoNoEncontrado(username);
    }
    

    static deleteByNombre(name) { 
        const mazo = this.getMazoByName(name);
        let id = mazo.#id;
        this.#deleteCartas.run({id}); // limpiamos las referencias en tabla mazoCartas para q no haya error
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
        if (username === "Administrador") {
            mazo = this.getMazoByName(nombre);
        } else {
            mazo = this.getMazoByCreador(username);
        }
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

