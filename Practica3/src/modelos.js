import { Usuario } from "./usuarios/Usuario.js";
import { Carta } from "./cartas/Cartas.js";
import { Mazo } from "./mazos/Mazos.js";

export function inicializaModelos(db) {
    Usuario.initStatements(db);
    Carta.initConsultas(db);
    Mazo.initStatements(db);
}