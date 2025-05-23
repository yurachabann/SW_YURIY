BEGIN TRANSACTION;
DROP TABLE IF EXISTS "Intercambios";
CREATE TABLE "Intercambios" (
	"UsuarioQueSolicita"	TEXT NOT NULL,
	"CartaQueQuiere"	INTEGER NOT NULL,
	"CartaQueDa"	INTEGER NOT NULL,
	"id"	INTEGER NOT NULL,
	PRIMARY KEY("id")
);
DROP TABLE IF EXISTS "MazoCartas";
CREATE TABLE MazoCartas (
  mazo_id   INTEGER    REFERENCES Mazos(id),
  carta_id  INTEGER    REFERENCES Cartas(id),
  PRIMARY KEY (mazo_id, carta_id)
);
DROP TABLE IF EXISTS "Mazos";
CREATE TABLE Mazos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  creador TEXT NOT NULL,
  cartas TEXT NOT NULL
);
DROP TABLE IF EXISTS "Usuarios";
CREATE TABLE "Usuarios" (
	"id"	INTEGER NOT NULL,
	"username"	TEXT NOT NULL UNIQUE,
	"nombre"	TEXT NOT NULL,
	"rol"	TEXT NOT NULL DEFAULT 'U' CHECK("rol" IN ('U', 'A')),
	"password"	TEXT NOT NULL,
	"email"	TEXT NOT NULL DEFAULT 'test@gmail.com',
	PRIMARY KEY("id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "UsuariosCartas";
CREATE TABLE "UsuariosCartas" (
  usuario   TEXT NOT NULL,
  carta_id  INTEGER NOT NULL,
  PRIMARY KEY (usuario, carta_id),
  FOREIGN KEY(carta_id) REFERENCES Cartas(id)
);
DROP TABLE IF EXISTS "cartas";
CREATE TABLE cartas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    coleccion INTEGER NOT NULL,
    rareza INTEGER NOT NULL,
    vida INTEGER NOT NULL
, creador TEXT DEFAULT NULL, Imagen TEXT
DEFAULT 'https://i.pinimg.com/736x/b4/49/0a/b4490a5661fb671aa2c1b13daa2e7faa.jpg');
COMMIT;
