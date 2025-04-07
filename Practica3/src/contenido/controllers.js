export function viewContenidoNormal(req, res) {
    let contenido = 'paginas/normal';
  //  if (req.session != null && req.session.nombre != null) {
       // contenido = 'paginas/normal';
  //  }
    res.render('pagina', {
        contenido,
        session: req.session
    });
}

export function viewContenidoAdmin(req, res) {
    let contenido = 'paginas/noPermisos';
    if(req.session.login == undefined) {
        contenido = 'paginas/noPermisosLogin'
    }
    else if (req.session != null && req.session.login && req.session.esAdmin) {
        contenido = 'paginas/admin';
    }
    res.render('pagina', {
        contenido,
        session: req.session
    });
}

export function viewContenidoUser(req, res) {
    let contenido = 'paginas/user';
    if(req.session.login == undefined) {
        contenido = 'paginas/noPermisosLogin'
    }
    else if (req.session != null && req.session.login && req.session.esAdmin) {
        contenido = 'paginas/noPermisosUsuario';
    }
    console.log(req.session);
    res.render('pagina', {
        contenido,
        session: req.session
    });
}