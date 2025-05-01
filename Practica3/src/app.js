import express            from 'express';
import session            from 'express-session';
import fs                 from 'node:fs';
import path               from 'node:path';
import { fileURLToPath }  from 'node:url';

import { config }         from './config.js';
import usuariosRouter     from './usuarios/router.js';
import contenidoRouter    from './contenido/router.js';
import cartasRouter       from './cartas/router.js';
import mazosRouter        from './mazos/router.js';

const __dirname  = path.dirname(fileURLToPath(import.meta.url)); // …/src
const STATIC_DIR = path.resolve(__dirname, '..', 'static');     // …/static
const IMG_DIR    = path.join(STATIC_DIR, 'img');                // …/static/img

if (!fs.existsSync(IMG_DIR)) {
  fs.mkdirSync(IMG_DIR, { recursive: true });
  console.log('Carpeta creada', IMG_DIR);
}

export const app = express();

app.set('view engine', 'ejs');
app.set('views', config.vistas);

app.use(express.urlencoded({ extended: false }));
app.use(session(config.session));

app.use('/',   express.static(STATIC_DIR));
app.use('/img', express.static(IMG_DIR));

app.get('/', (req, res) => {
  res.render('pagina', {
    contenido: 'paginas/index',
    session:   req.session,
  });
});

app.use('/usuarios',   usuariosRouter);
app.use('/contenido',  contenidoRouter);
app.use('/cartas',     cartasRouter);
app.use('/mazos',      mazosRouter);