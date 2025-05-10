BEGIN TRANSACTION;
INSERT INTO "Usuarios" ("id","username","nombre","rol","password","email") VALUES (35,'admin','Admin','A','$2b$10$kW/tKxiGqS5TGpJ69Au8oO79mzr.Uygp2nhfh9A.ssnQv25N/aFta','admin@gmail.com');
INSERT INTO "Usuarios" ("id","username","nombre","rol","password","email") VALUES (58,'user','user','U','$2b$10$4yfeYb3H7TN5pvGqKvKvPeheMO0Rj9YX27xYACQzJAxna.AAcMiFi','yuriy@gmail.com');
COMMIT;
