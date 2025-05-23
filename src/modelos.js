import { Usuario } from "./usuarios/Usuario.js";
import { Carta } from "./cartas/Cartas.js";
import { Mazo } from "./mazos/Mazos.js";
import { Intercambio } from "./intercambios/Intercambio.js";

export function inicializaModelos(db) {
    Usuario.initStatements(db);
    Carta.initStatements(db);
    Mazo.initStatements(db);
    Intercambio.initStatements(db);
}