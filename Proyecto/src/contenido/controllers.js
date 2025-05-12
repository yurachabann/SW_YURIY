
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

export function viewContenidoMiembros(req, res) { //info de los integrantes del equipo
    res.render('pagina', {
        contenido: 'paginas/miembros',
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