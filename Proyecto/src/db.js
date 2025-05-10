import { join, dirname } from "node:path";
import Database from 'better-sqlite3';

let db = null;

export function getConnection() {
    if (db !== null) return db;
    db = createConnection();
    return db;
}

function createConnection() {
    const options = {
        verbose: console.log // Opcional y sólo recomendable durante desarrollo.
    };
    const db = new Database(join(dirname(import.meta.dirname), 'data', 'aw_sw.db'), options);
    db.pragma('journal_mode = WAL'); // Necesario para mejorar la durabilidad y el rendimiento
    //db.prepare('DROP TABLE IF EXISTS cartas').run();
    //createCartasTable(db);  //Crear la tabla de cartas si no existe
    return db;
}

export function closeConnection(db = getConnection()) {
    if (db === null) return;
    db.close();
}

export function checkConnection(db = getConnection()) {
    const checkStmt = db.prepare('SELECT 1+1 as suma');
    const suma = checkStmt.get().suma;
    if (suma == null || suma !== 2) throw Error(`La bbdd no funciona correctamente`);
}

/*
export function createCartasTable(db) {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS cartas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            fuerza INTEGER NOT NULL,
            tipocarta INTEGER NOT NULL
        );
    `;
    db.prepare(createTableQuery).run();
}
    */


export class ErrorDatos extends Error {
    /**
     * 
     * @param {string} message 
     * @param {ErrorOptions} [options]
     */
    constructor(message, options) {
        super(message, options);
        this.name = 'ErrorDatos';
    }
}