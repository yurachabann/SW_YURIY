BEGIN TRANSACTION;
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
DROP TABLE IF EXISTS "cartas";
CREATE TABLE cartas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            fuerza INTEGER NOT NULL,
            tipocarta INTEGER NOT NULL
        );
COMMIT;
