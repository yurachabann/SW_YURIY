import { Usuario, RolesEnum } from './Usuario.js';
import { Carta } from '../cartas/Cartas.js';
import { Mazo } from '../mazos/Mazos.js';
import { body, validationResult } from 'express-validator';

export function viewLogin(req, res) {
    const mensaje = req.query.mensaje || null;
    let contenido = 'paginas/login';
    if (req.session != null && req.session.login) {
        contenido = 'paginas/home'
    }
    res.render('pagina', {
        contenido,
        session: req.session,
        mensaje
    });
}

export function viewRegister(req, res) {
    const mensaje = req.query.mensaje || null;
    res.render('pagina', {
        contenido: 'paginas/register',
        session: req.session,
        mensaje
    });
}

export function viewPreModify(req, res) {
    const mensaje = req.query.mensaje || null;
    const usuarios = Usuario.obtenerUsuariosExcept(req.session.nombre);
    res.render('pagina', {
        contenido: 'paginas/preModificarUsuario',
        session: req.session,
        mensaje,
        usuarios
    });
}

export function doPreModify(req,res){
  const username = req.body.username.trim();

  if (!username) {
    const mensaje = encodeURIComponent('No se indicó ningún usuario');
    return res.redirect(`/usuarios/preModifyUser?mensaje=${mensaje}`);
  }

  if (!Usuario.usuarioExiste(username)) {
    const mensaje = encodeURIComponent('El usuario no existe');
    return res.redirect(`/usuarios/preModifyUser?mensaje=${mensaje}`);
  }

   const usuario = Usuario.getDatosByUsername(username); //usuario a modificar

   const mensaje = req.query.mensaje || null;
   res.render('pagina', {
        contenido: 'paginas/modifyUser',
        session: req.session,
        mensaje,
        usuario,
        RolesEnum
    });
}

export function administrarUsuarios(req, res) {
    const usuarios = Usuario.obtenerUsuarios();
    const mensaje = req.query.mensaje || null;
    res.render('pagina', {
        contenido: 'paginas/administrarUsuarios',
        usuarios,
        session: req.session,
        mensaje
    });
}

export function viewEliminate(req, res) {
    const usuarios = Usuario.obtenerUsuariosExcept(req.session.nombre);
   // console.log(req.session);
    const mensaje = req.query.mensaje || null;
    res.render('pagina', {
        contenido: 'paginas/borrarUsuario',
        session: req.session,
        usuarios,
        mensaje
    });
}

export function viewAdd(req, res) {
    const mensaje = req.query.mensaje || null;
    res.render('pagina', {
        contenido: 'paginas/aniadirUsuario',
        session: req.session,
        mensaje
    });
}

export function doLogin(req, res) {
    //No valen campos vacíos
    const validations = [
        body('username', 'El nombre de usuario es obligatorio').notEmpty(),
        body('password', 'La contraseña es obligatoria').notEmpty(),
    ];

    //Validaciones
    Promise.all(validations.map(validation => validation.run(req))).then(() => {
        const errors = validationResult(req);
        //Si hay error devolverlo al usuario (errores tiene algo dentro)
        if (!errors.isEmpty()) {
            return res.render('pagina', {
                contenido: 'paginas/login',
                //Mostrar los errores que haya
                error: errors.array().map(err => err.msg).join('. '), 
            });
        }

        //Capturar username y password
        const username = req.body.username.trim();
        const password = req.body.password.trim();

        try {
            //Verificamos si el usuario existe y si la contraseña es la correcta
            const usuario = Usuario.login(username, password);
            req.session.login = true;
            req.session.nombre = usuario.nombre;
            req.session.esAdmin = usuario.rol === RolesEnum.ADMIN;

            //Renderiza la página por login true
            return res.render('pagina', {
                contenido: 'paginas/home',
                session: req.session,
            });

        } catch (e) {
            //Error de usuario o contraseña, renderiza
            return res.render('pagina', {
                contenido: 'paginas/login',
                error: 'El usuario o contraseña no son válidos',
            });
        }
    });
}

export function aniadirUsuario(req, res) {
  body('nombre').escape();
  body('email').normalizeEmail();
  body('pass').escape();
  body('username').escape();
  body('rol').isIn([RolesEnum.ADMIN, RolesEnum.USER]);

  const nombre = req.body.nombre?.trim();
  const email = req.body.email?.trim();
  const pass = req.body.pass?.trim();
  const rol = req.body.tipoUsuario?.trim();
  const username = req.body.username?.trim();

  if (!nombre || !email || !rol || !username) {
    const mensaje = encodeURIComponent('Todos los campos son obligatorios.');
    return res.redirect(`/usuarios/aniadirUsuario?mensaje=${mensaje}`);
  }

  try {
    if (rol === "A") {
      Usuario.addUserAdmin(username, pass, email, nombre);
    } else {
      Usuario.register(username, pass, email, nombre);
    }

    const mensaje = encodeURIComponent('Usuario añadido con éxito');
    return res.redirect(`/usuarios/administrarUsuarios?mensaje=${mensaje}`);
  } catch (e) {
    const mensaje = encodeURIComponent('Error al añadir el usuario: ' + e.message);
    return res.redirect(`/usuarios/aniadirUsuario?mensaje=${mensaje}`);
  }
}


export function doRegister(req, res) {
  body('name').escape();
  body('usernameRegister').escape();
  body('email').normalizeEmail();
  body('password1').escape();
  body('password2').escape();

  const username  = req.body.usernameRegister?.trim();
  const password1 = req.body.password1?.trim();
  const password2 = req.body.password2?.trim();
  const email = req.body.email?.trim();
  const name = req.body.name?.trim();

  if (password1 !== password2) {
    const mensaje = encodeURIComponent('Las contraseñas no coinciden');
    return res.redirect(`/usuarios/register?mensaje=${mensaje}`);
  }

  try {
    const nuevoUsuario = Usuario.register(username, password1, email, name);

    req.session.login   = true;
    req.session.nombre  = nuevoUsuario.nombre;
    req.session.esAdmin = nuevoUsuario.rol === RolesEnum.ADMIN;

    return res.redirect(`/usuarios/login`);
  } catch (e) {

    const mensaje = encodeURIComponent('Error en el registro: ' + e.message);
    return res.redirect(`/usuarios/register?mensaje=${mensaje}`);
  }
}


export function doLogout(req, res, next) {
    req.session.login = null
    req.session.nombre = null;
    req.session.esAdmin = null;
    req.session.save((err) => {
        if (err) next(err);
        req.session.regenerate((err) => {
            if (err) next(err)
            res.redirect('/');
        })
    })
}

export function eliminateUser(req, res) {
  const usernameReq = req.body.username?.trim();

  if (!Usuario.usuarioExiste(usernameReq)) {
    const mensaje = encodeURIComponent('Error al borrar el usuario');
    return res.redirect(
      `/usuarios/borrarUsuario?username=${encodeURIComponent(usernameReq)}&mensaje=${mensaje}`
    );
  }

  const nombre = Usuario.obtenerNombrePorUsername(usernameReq);
  Mazo.deleteAllMazosUsuario(nombre);
  Carta.limpiarInventarioUsuario(nombre);
  Usuario.deleteByUsername(usernameReq);

  const mensaje = encodeURIComponent('Usuario borrado con éxito');
  return res.redirect(`/usuarios/administrarUsuarios?mensaje=${mensaje}`);
}



export function doModify(req, res) {

  body('username').escape();
  body('usuario2').normalizeEmail();
  body('pass2').escape();
  body('email').normalizeEmail();
  body('tipoUsuario').isIn([RolesEnum.ADMIN, RolesEnum.USER]);

  const usuario = req.body.username.trim();
  const usuario2 = req.body.usuario2?.trim();
  const pass2 = req.body.pass2?.trim();
  const rol = req.body.tipoUsuario?.trim();
  const email = req.body.email?.trim();

  if (!Usuario.usuarioExiste(usuario)) {
    const mensaje = encodeURIComponent('El usuario no existe');
    return res.redirect(
      `/usuarios/modifyUser?username=${encodeURIComponent(usuario)}&mensaje=${mensaje}`
    );
  }

  Usuario.actualizarCampos(usuario, usuario2, pass2, rol, email);
  const mensaje = encodeURIComponent('Usuario modificado con éxito');
  return res.redirect(`/usuarios/administrarUsuarios?mensaje=${mensaje}`);
}
