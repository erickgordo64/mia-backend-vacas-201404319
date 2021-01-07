const { Router } = require('express');
const router = Router();
const BD = require('../config/configdb');
var dateTime = require('node-datetime');




//READ
router.get('/', async (req, res) => {
    res.status(200);
})

router.get('/getUsuarios', async (req, res) => {

    sql = "select * from usuario_hijo";

    let result = await BD.Open(sql, [], false);

    Users = [];

    console.log(result);

    result.rows.map(user => {
        let userSchema = {
            "idhijo": user[0],
            "nombre": user[1],
            "correo": user[2],
            "contrasena": user[3],
        }

        Users.push(userSchema);
    })
    res.json(Users);
});


router.post('/registroPadre', async (req, res) => {

    const { nombre, email, password, telefono, saldo } = req.body;

    sql = "insert into usuario_padre(nombre_padre, correo, contrasena, telefono, saldo) values (:nombre, :email, :password, :telefono, :saldo)";

    await BD.Open(sql, [nombre, email, password, telefono, saldo], true);

    res.status(200).json({
        "nombre": nombre
    })

    console.log("registro ingresado")
});
//seccion hijos
router.post('/login', async (req, res) => {
    const { correo, contrasena } = req.body;

    sql = "select * from usuario_hijo where nickname=:correo and contrasena=:contrasena";

    console.log(correo, contrasena);



    let result = await BD.Open(sql, [correo, contrasena], false);
    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idhijo": user[0],
            "nickname": user[1],
            "contrasena": user[2],
            "edad": user[6],
            "bastones": user[7]
        }
        Users.push(userSchema);
    })

    let respv = { "auth": "true" }
    let respf = { "auth": "false" }

    if (Users.length === 0) {
        res.status(400).json(respf);
    } else {
        if (Users.correo = correo) {
            console.log("correo correcto");
            if (Users.contrasena = contrasena) {
                console.log("contrasena correca")
            } else {
                console.log("contrasena incorrecta")
            }
        } else {
            console.log("correo malo")
        }
        res.status(200).json(Users);
    }

});

router.get('/getCartas/', async (req, res) => {

    var idhijo = req.query.idhijo;

    console.log(idhijo);

    sql = "SELECT * FROM carta_santa where idhijo=:idhijo order by idcarta desc";

    let result = await BD.Open(sql, [idhijo], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idcarta": user[0],
            "estado_carta": user[1],
            "fecha_carta": user[2],
            "idhijo": user[3],
            "idproducto": user[4]
        }

        Users.push(userSchema);
    })
    res.json(Users);
});

router.get('/getAcciones/', async (req, res) => {

    var ed = req.query.edad;

    console.log(ed);

    sql = "SELECT * FROM buena_accion where edad<:ed";

    let result = await BD.Open(sql, [ed], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idaccion": user[0],
            "titulo": user[1],
            "descripcion": user[2],
            "recompensa": user[3],
            "edad": user[4]
        }

        Users.push(userSchema);
    })
    res.json(Users);
});


router.post('/addAccion', async (req, res) => {

    const { idhijo, idaccion } = req.body;
    const estado = "false";

    console.log(idhijo)

    sql = "insert into detalle_accion(estado_accion, idhijo, idaccion) values (:estado, :idhijo, :idaccion)";

    await BD.Open(sql, [estado, idhijo, idaccion], true);

    res.status(200).json({
        "estado": estado
    })

    console.log("registro ingresado")
});

router.post('/addCarta/', async (req, res) => {

    const { idhijo, estado } = req.body;
    console.log("trata de ingresar carta")

    var dt = dateTime.create();
    var formatted = dt.format('d-m-y');
    console.log(formatted);
   
    sql = "insert into carta_santa(estado_carta, fecha_carta, idhijo) values (:estado, to_date(:formatted,'DD/MM/YYYY'), :idhijo)";

    await BD.Open(sql, [estado, formatted, idhijo], true);

    res.status(200).json({
        "estado": estado
    })

    console.log("registro ingresado")
});

router.get('/getUltimaCarta/', async (req, res) => {

    var idhijo = req.query.idhijo;

    sql = "select * from carta_santa where idhijo=:idhijo order by idcarta desc FETCH NEXT 1 ROWS ONLY";

    let result = await BD.Open(sql, [idhijo], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idcarta": user[0],
            "estado_carta": user[1],
            "fecha_carta": user[2],
            "idhijo": user[3]
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando ultima carta", Users[0].idcarta);
});


router.get('/getProducto', async (req, res) => {

    sql = "SELECT * FROM PRODUCTO";

    let result = await BD.Open(sql, [], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idproducto": user[0],
            "nombre_producto": user[1],
            "precio": user[2],
            "edad": user[3],
            "idcategoria": user[4]
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando productos");
});

router.post('/addDetalleCarta', async (req, res) => {

    const { idcarta, idproducto } = req.body;
    const estado = "false";

    console.log(idcarta)

    sql = "insert into detalle_carta(idproducto, idcarta) values(:idproducto,:idcarta)";

    await BD.Open(sql, [idproducto, idcarta], true);

    res.status(200).json({
        "estado": estado
    })

    console.log("registro ingresado")
});

router.post('/addComentario', async (req, res) => {

    const { comentario, idpublicacion, idhijo } = req.body;
    const estado = "false";

    sql = "insert into comentarios(contenido_comentario, idpublicacion, idhijo) values(:comentario,:idpublicacion, :idhijo)";

    await BD.Open(sql, [comentario, idpublicacion, idhijo], true);

    res.status(200).json({
        "estado": estado
    })

    console.log("registro ingresado comentario")
});

router.get('/getPublicacion', async (req, res) => {

    sql = "SELECT * FROM publicacion_santa";

    let result = await BD.Open(sql, [], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idpublicacion": user[0],
            "contenido": user[1],
            "imagen": user[2],
            "idsanta": user[3],
            "titulo": user[4]
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando publicacion", Users[0].cotenido);
});

router.get('/getComentarios/', async (req, res) => {

    var idpublicacion = req.query.idpublicacion;


    sql = "SELECT * FROM comentarios where idpublicacion=:idpublicacion";

    let result = await BD.Open(sql, [idpublicacion], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idcomentario": user[0],
            "contenido": user[1]
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando publicacion", Users[0].cotenido);
});

router.get('/getMensajes/', async (req, res) => {

    var idhijo = req.query.idhijo;


    sql = "SELECT * FROM mensaje where idhijo=:idhijo";

    let result = await BD.Open(sql, [idhijo], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idmensaje": user[0],
            "idchat": user[1],
            "contenido": user[2],
            "idadmin": user[3],
            "idhijo": user[4]
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando menajes");
});

router.post('/addMensaje', async (req, res) => {

    const { idchat, contenido, idadmin, idhijo } = req.body;
    const estado = "false";

    sql = "insert into mensaje(idchat, contenido, idadmin, idhijo) values(:idchat, :contenido,:idadmin, :idhijo)";

    await BD.Open(sql, [idchat, contenido, idadmin, idhijo], true);

    res.status(200).json({
        "estado": estado
    })

    console.log("registro ingresado mensaje")
});

// admin

router.post('/loginAdmin', async (req, res) => {
    const { correo, contrasena } = req.body;

    sql = "select * from admin where nombre=:correo and contrasena=:contrasena";

    console.log(correo, contrasena);



    let result = await BD.Open(sql, [correo, contrasena], false);
    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idadmin": user[0],
            "nombre": user[1],
            "contrasena": user[2]
        }
        Users.push(userSchema);
    })

    let respv = { "auth": "true" }
    let respf = { "auth": "false" }

    if (Users.length === 0) {
        res.status(400).json(respf);
    } else {
        if (Users.correo = correo) {
            console.log("correo correcto");
            if (Users.contrasena = contrasena) {
                console.log("contrasena correca")
            } else {
                console.log("contrasena incorrecta")
            }
        } else {
            console.log("correo malo")
        }
        res.status(200).json(Users);
    }

});

router.get('/getBuenaAccion', async (req, res) => {

    sql = "SELECT * FROM buena_accion";

    let result = await BD.Open(sql, [], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idaccion": user[0],
            "titulo": user[1],
            "descripcion": user[2],
            "recompensa": user[3],
            "edad": user[4]
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando acciones");
});

router.get('/getBA/', async (req, res) => {

    var id=req.query.id;

    sql = "SELECT * FROM buena_accion where idaccion=:id";

    let result = await BD.Open(sql, [id], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "titulo": user[1],
            "descripcion": user[2],
            "recompensa": user[3],
            "edad": user[4]
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando acciones");
});

router.put('/updateBA/', async (req, res) => {

    var id=req.query.id;
    const {titulo, descripcion, recompensa, edad}=req.body;

    sql = "update buena_accion set titulo=:titulo, descripcion=:descripcion, recompensa=:recompensa, edad=:edad where idaccion=:id";

    await BD.Open(sql, [titulo, descripcion, recompensa, edad, id], true);

    Users = [];

    let respv = { "auth": "true" }
    
    res.status(200).json(respv);    
    console.log("actualizado");
});

router.post('/addBuenaAccion', async (req, res) => {

    const { titulo, descripcion, recompensa, edad } = req.body;
    const estado = "false";

    sql = "insert into buena_accion(titulo, descripcion, recompensa, edad) values(:titulo, :descripcion,:recompensa, :edad)";

    await BD.Open(sql, [titulo, descripcion, recompensa, edad], true);

    res.status(200).json({
        "estado": estado
    })

    console.log("registro ingresado buena accion")
});

router.get('/getProductos', async (req, res) => {

    sql = "select idproducto, nombre_producto, precio, edad, nombre, idcategoria from producto inner join categoria using(idcategoria) order by idproducto asc";

    let result = await BD.Open(sql, [], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idproducto": user[0],
            "nombre_producto": user[1],
            "precio": user[2],
            "edad": user[3],
            "nombre": user[4],
            "idcategoria": user[5]
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando productos");
});

router.get('/getCategoria', async (req, res) => {

    sql = "select * from categoria";

    let result = await BD.Open(sql, [], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idcategoria": user[0],
            "nombre": user[1]
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando categorias");
});


router.get('/getProduct/', async (req, res) => {

    var id=req.query.id;

    console.log(id);

    sql = "select idproducto, nombre_producto, precio, edad, nombre, idcategoria from producto inner join categoria using(idcategoria) where idproducto=:id";

    let result = await BD.Open(sql, [id], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idproducto": user[0],
            "nombre_producto": user[1],
            "precio": user[2],
            "edad": user[3],
            "nombre": user[4],
            "idcategoria": user[5]
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando producto");
});

router.post('/addProductos', async (req, res) => {

    const { nombre, precio, edad, idcat } = req.body;
    const estado = "false";

    console.log(idcat)

    sql = "insert into producto(nombre_producto, precio, edad, idcategoria) values(:nombre, :precio,:edad, :idcat)";

    await BD.Open(sql, [nombre, precio, edad, idcat], true);

    res.status(200).json({
        "estado": estado
    })

    console.log("registro ingresado producto")
});


router.put('/updateProducto/', async (req, res) => {

    var id=req.query.id;
    const {nombre, precio, edad, idcat}=req.body;

    sql = "update producto set nombre_producto=:nombre, precio=:precio, edad=:edad, idcategoria=:idcat where idproducto=:id";

    await BD.Open(sql, [nombre, precio, edad, idcat, id], true);

    Users = [];

    let respv = { "auth": "true" }
    
    res.status(200).json(respv);    
    console.log("actualizado producto");
});

router.get('/getSanta', async (req, res) => {

    sql = "SELECT * FROM santa";

    let result = await BD.Open(sql, [], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idsanta": user[0],
            "nick": user[1],
            "contrasena":user[2]
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando santas");
});

router.get('/getSant/', async (req, res) => {

    var id=req.query.id;
    sql = "SELECT * FROM santa where idsanta=:id";

    let result = await BD.Open(sql, [id], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idsanta": user[0],
            "nick": user[1],
            "contrasena":user[2]
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando santa");
});

router.get('/getPadre', async (req, res) => {

    sql = "SELECT * FROM usuario_padre";

    let result = await BD.Open(sql, [], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idpadre": user[0],
            "nombre_padre": user[1],
            "correo": user[2],
            "contrasena": user[3],
            "telefono": user[4],
            "saldo": user[5]
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando padres");
});

router.get('/getPapa/', async (req, res) => {

    var id=req.query.id;
    sql = "SELECT * FROM usuario_padre where idpadre=:id";

    let result = await BD.Open(sql, [id], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idpadre": user[0],
            "nombre_padre": user[1],
            "correo": user[2],
            "contrasena": user[3],
            "telefono": user[4],
            "saldo": user[5]
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando padre");
});

router.get('/getHijo', async (req, res) => {

    sql = "SELECT * FROM usuario_hijo";

    let result = await BD.Open(sql, [], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idhijo": user[0],
            "nickname": user[1],
            "contrasena": user[2],
            "nombre": user[3],
            "sexo": user[4],
            "fecha_nacimiento": user[5],
            "edad": user[6],
            "bastones": user[7],
            "departamento": user[8],
            "municipio": user[9],
            "direccion": user[10],
            "longitud": user[11],
            "latitud": user[12],
            "idpadre": user[13],

        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando hijo");
});

router.get('/getSon/', async (req, res) => {

    var id=req.query.id;
    sql = "SELECT * FROM usuario_hijo where idhijo=:id";

    let result = await BD.Open(sql, [id], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idhijo": user[0],
            "nickname": user[1],
            "contrasena": user[2],
            "nombre": user[3],
            "sexo": user[4],
            "fecha_nacimiento": user[5],
            "edad": user[6],
            "bastones": user[7],
            "departamento": user[8],
            "municipio": user[9],
            "direccion": user[10],
            "longitud": user[11],
            "latitud": user[12],
            "idpadre": user[13],

        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando hijo");
});

router.post('/addSanta', async (req, res) => {

    const { nick, contrasena} = req.body;

    sql = "insert into santa(nick, contrasena) values (:nick, :contrasena)";

    await BD.Open(sql, [nick, contrasena], true);

    res.status(200).json({
        "nick": nick 
    })

    console.log("registro ingresado santa")
});

router.post('/addPadre', async (req, res) => {

    const { nombre, email, password, telefono, saldo } = req.body;

    sql = "insert into usuario_padre(nombre_padre, correo, contrasena, telefono, saldo) values (:nombre, :email, :password, :telefono, :saldo)";

    await BD.Open(sql, [nombre, email, password, telefono, saldo], true);

    res.status(200).json({
        "nombre": nombre
    })

    console.log("registro ingresado")
});

router.post('/addHijo', async (req, res) => {

    const { nickname, password, nombre,sexo,fecha,edad,bastones,departamento,municipio,direccion,longitud,latitud,idpadre } = req.body;

    sql = "insert into usuario_hijo(nickname, contrasena, nombre, sexo, fecha_nacimiento, edad,basyt, departamento, municipio, direccion, longitud, latitud, idpadre) values (:nickname,:password,:nombre,:sexo,to_date(:fecha,'YYYY/MM/DD'), :edad,:bastones,:departamento,:municipio,:direccion,:longitud,:latitud,:idpadre)";

    await BD.Open(sql, [nickname, password, nombre,sexo,fecha,edad,bastones,departamento,municipio,direccion,longitud,latitud,idpadre], true);

    res.status(200).json({
        "nombre": nombre
    })

    console.log("registro ingresado padre")
});

router.put('/updateSanta/', async (req, res) => {

    var id=req.query.id;
    const {nick, contrasena}=req.body;

    sql = "update santa set nick=:nick, contrasena=:contrasena where idsanta=:id";

    await BD.Open(sql, [nick, contrasena, id], true);

    Users = [];

    let respv = { "auth": "true" }
    
    res.status(200).json(respv);    
    console.log("actualizado santa");
});

router.put('/updatePadre/', async (req, res) => {

    var id=req.query.id;
    const {nombre, email, password, telefono, saldo}=req.body;

    sql = "update usuario_padre set nombre_padre=:nombre, correo=:email, contrasena=:password, telefono=:telefno, saldo=:saldo where idpadre=:id";

    await BD.Open(sql, [nombre, email, password, telefono, saldo, id], true);

    Users = [];

    let respv = { "auth": "true" }
    
    res.status(200).json(respv);    
    console.log("actualizado padre");
});

router.put('/updateHijo/', async (req, res) => {

    var id=req.query.id;
    const {nickname, password, nombre,sexo,fecha,edad,bastones,departamento,municipio,direccion,longitud,latitud,idpadre }=req.body;

    sql = "update usuario_hijo set nickname=:nickname, contrasena=:password, nombre=:nombre, sexo=:sexo, fecha_nacimiento=to_date(:fecha,'YYYY/MM/DD'), edad=:edad,basyt=:bastones, departamento=:departamento, municipio=:municipio, direccion=:direccion, longitud=:longitud, latitud=:latitud, idpadre=:idpadre where idhijo=:id";

    await BD.Open(sql, [nickname, password, nombre,sexo,fecha,edad,bastones,departamento,municipio,direccion,longitud,latitud,idpadre, id], true);

    Users = [];

    let respv = { "auth": "true" }
    
    res.status(200).json(respv);    
    console.log("actualizado hijo");
});

router.get('/getChat/', async (req, res) => {

    var id=req.query.id;

    console.log(id);

    sql = "select idchat, chat.nombre, idadmin, idhijo, nickname from mensaje inner join chat using(idchat) inner join usuario_hijo using(idhijo) where idadmin=:id group by idchat, chat.nombre, idadmin, idhijo, nickname";

    let result = await BD.Open(sql, [id], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idchat": user[0],
            "nombre": user[1],
            "idadmin": user[2],
            "idhijo": user[3],
            "nickname": user[4]
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando chat");
});

router.get('/getMensaje/', async (req, res) => {

    var id = req.query.id;


    sql = "select * from mensaje where idchat=:id";

    let result = await BD.Open(sql, [id], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idmensaje": user[0],
            "idchat": user[1],
            "contenido": user[2],
            "idadmin": user[3],
            "idhijo": user[4]
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando menajes");
});
//reportes
router.get('/getReporte1', async (req, res) => {

    sql = "select count(idproducto) \"top\",idproducto, nombre_producto from detalle_carta inner join producto using(idproducto) group by idproducto, nombre_producto order by \"top\" desc FETCH NEXT 10 ROWS ONLY";

    let result = await BD.Open(sql, [], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "top": user[0],
            "idproducto": user[1],
            "nombre_producto": user[2],
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando reporte1");
});

router.get('/getReporte2', async (req, res) => {

    sql = "select count(idhijo) \"top\", departamento from carta_santa inner join usuario_hijo using(idhijo) group by departamento order by \"top\" desc FETCH NEXT 10 ROWS ONLY";

    let result = await BD.Open(sql, [], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "top": user[0],
            "departamento": user[1],
            "idhijo": user[2],
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando reporte1");
});

router.get('/getReporte3', async (req, res) => {

    sql = "select count(idhijo) \"top\", municipio from carta_santa inner join usuario_hijo using(idhijo) group by municipio order by \"top\" desc FETCH NEXT 10 ROWS ONLY";

    let result = await BD.Open(sql, [], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "top": user[0],
            "municipio": user[1],
            "idhijo": user[2],
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando reporte1");
});

router.get('/getReporte4', async (req, res) => {

    sql = "select count(idaccion) \"top\", titulo from detalle_accion inner join buena_accion using(idaccion) group by idaccion, titulo order by \"top\" desc FETCH NEXT 5 ROWS ONLY";

    let result = await BD.Open(sql, [], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "top": user[0],
            "titulo": user[1],
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando reporte1");
});

router.get('/getReporte5', async (req, res) => {

    sql = "select count(idhijo) \"top\", idhijo, nickname from comentarios inner join usuario_hijo using(idhijo) group by idhijo, nickname order by \"top\" desc";

    let result = await BD.Open(sql, [], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "top": user[0],
            "idhijo": user[1],
            "nickname": user[2],
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando reporte1");
});

router.get('/getReporte6', async (req, res) => {

    sql = "select count(idcategoria) \"top\", nombre from producto inner join detalle_carta using(idproducto) inner join categoria using(idcategoria) group by nombre order by \"top\" desc FETCH NEXT 5 ROWS ONLY";

    let result = await BD.Open(sql, [], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "top": user[0],
            "nombre": user[1],
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando reporte1");
});

router.get('/getReporte7', async (req, res) => {

    sql = "select sum(precio) \"total\", idcarta from detalle_carta inner join producto using(idproducto) group by idcarta order by \"total\" desc FETCH NEXT 15 ROWS ONLY";

    let result = await BD.Open(sql, [], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "total": user[0],
            "idcarta": user[1],
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando reporte1");
});
//********************************* */ seccion papa*************************************************************************************
//************************************************************************************************************************************* */

router.post('/loginPapa', async (req, res) => {
    const { correo, contrasena } = req.body;

    sql = "select * from usuario_padre where correo=:correo ";

    console.log(correo, contrasena);

    let result = await BD.Open(sql, [correo], false);
    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idpadre": user[0],
            "nombre_padre": user[1],
            "correo": user[2],
            "contrasena": user[3],
            "telefono": user[4],
            "saldo":user[5]
        }
        Users.push(userSchema);
    })

    let respv = { "auth": "true" }
    let respf = { "auth": "false" }

    if (Users.length === 0) {
        res.status(400).json(respf);
    } else {
        if (Users.correo = correo) {
            console.log("correo correcto");
            if (Users.contrasena = contrasena) {
                console.log("contrasena correca", Users.contrasena)
            } else {
                console.log("contrasena incorrecta")
            }
        } else {
            console.log("correo malo")
        }
        res.status(200).json(Users);
    }

});

router.get('/getHijoById/', async (req, res) => {

    var id=req.query.id;

    console.log(id);

    sql = "SELECT * FROM usuario_hijo where idpadre=:id";

    let result = await BD.Open(sql, [id], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idhijo": user[0],
            "nickname": user[1],
            "contrasena": user[2],
            "nombre": user[3],
            "sexo": user[4],
            "fecha_nacimiento": user[5],
            "edad": user[6],
            "bastones": user[7],
            "departamento": user[8],
            "municipio": user[9],
            "direccion": user[10],
            "longitud": user[11],
            "latitud": user[12],
            "idpadre": user[13],

        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando hijos padre");
});

router.get('/getAccionById/', async (req, res) => {

    var ed = req.query.id;

    console.log(ed);

    sql = "select idhijo, nickname, basyt, idaccion, titulo, descripcion, recompensa, iddetalle_accion from usuario_hijo inner join detalle_accion using(idhijo) inner join buena_accion using(idaccion) where idhijo=:ed and estado_accion='false'";

    let result = await BD.Open(sql, [ed], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idhijo": user[0],
            "nickname": user[1],
            "bastones": user[2],
            "idaccion": user[3],
            "titulo": user[4],
            "descripcion": user[5],
            "recompensa": user[6],
            "iddetalle_accion": user[7]
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("devolviendo acciones por hijo")
});


router.put('/updateDetalleAccion', async (req, res) => {

    const {id, estado}=req.body;
    
    console.log(id, estado);

    sql = "update detalle_accion set estado_accion=:estado where iddetalle_accion=:id";

    await BD.Open(sql, [estado, id], true);

    Users = [];

    let respv = { "auth": "true" }
    
    res.status(200).json(respv);    
    console.log("actualizado estado accion");
});

router.put('/updateBastonesHijo', async (req, res) => {

    const {id, bastones}=req.body;
    
    console.log(id, bastones);

    sql = "update usuario_hijo set basyt=:bastones where idhijo=:id";

    await BD.Open(sql, [bastones, id], true);

    Users = [];

    let respv = { "auth": "true" }
    
    res.status(200).json(respv);    
    console.log("actualizado bastones hijo");
});


router.get('/getCartasHijosById/', async (req, res) => {

    var ed = req.query.id;

    console.log(ed);

    sql = "select idhijo, nickname, nombre, idcarta, fecha_carta, estado_carta from usuario_hijo inner join carta_santa using(idhijo) where idpadre=:ed order by idhijo desc";

    let result = await BD.Open(sql, [ed], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idhijo": user[0],
            "nickname": user[1],
            "nombre": user[2],
            "idcarta": user[3],
            "fecha_carta": user[4],
            "estado_carta": user[5]
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("devolviendo cartas de hijos")
});

router.get('/getElementosCartaById/', async (req, res) => {

    var ed = req.query.id;

    console.log(ed);

    sql = "select idcarta, estado_carta, iddetallecarta, idproducto, nombre_producto, precio from detalle_carta inner join carta_santa using(idcarta) inner join producto using(idproducto) where idcarta=:ed";

    let result = await BD.Open(sql, [ed], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idcarta": user[0],
            "estado_carta": user[1],
            "iddetallecarta": user[2],
            "idproducto": user[3],
            "nombre_producto": user[4],
            "precio": user[5]
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("devolviendo elementos cartas de hijos")
});

router.put('/updateEstadoCarta', async (req, res) => {

    const {id, estado}=req.body;
    
    console.log(id, estado);

    sql = "update carta_santa set estado_carta=:estado where idcarta=:id";

    await BD.Open(sql, [estado, id], true);

    Users = [];

    let respv = { "auth": "true" }
    
    res.status(200).json(respv);    
    console.log("actualizado estado carta");
});

router.delete('/deleteProductoDetalleCarta/',async(req,res)=>{
    var id=req.query.id;

    console.log(id);

    sql="delete from detalle_carta where iddetallecarta=:id";

    await BD.Open(sql, [id], true);

    Users = [];

    let respv = { "auth": "true" }
    
    res.status(200).json(respv);    
    console.log("producto quitado del detalle carta");

});

router.post('/addReparto', async (req, res) => {

    const { idhijo, idsanta, idcarta, estado} = req.body;

    sql = "insert into reparto(idhijo, idsanta, idcarta, estado) values (:idhijo, :idsanta, :idcarta, :estado)";

    await BD.Open(sql, [idhijo, idsanta,idcarta, estado], true);

    res.status(200).json({
        "nombre": estado
    })

    console.log("registro ingresado reparto")
});

router.post('/addChat', async (req, res) => {

    const { nombre } = req.body;

    sql = "insert into chat(nombre) values (:nombre)";

    await BD.Open(sql, [nombre], true);

    res.status(200).json({
        "nombre": nombre
    })

    console.log("registro ingresado chat")
});

router.get('/getChats/', async (req, res) => {

    var nickname=req.query.nickname;

    sql = "select * from chat where nombre=:nickname";

    let result = await BD.Open(sql, [nickname], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idchat": user[0],
            "nombre": user[1]
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("retornando chat by nombre");
});

router.post('/addDetalleChat', async (req, res) => {

    const { idchat, contenido, idadmin, idhijo } = req.body;

    console.log(idchat, contenido, idadmin, idhijo);

    sql = "insert into mensaje(idchat, contenido, idadmin, idhijo) values (:idchat, :contenido, :idadmin, :idhijo)";

    await BD.Open(sql, [idchat, contenido, idadmin, idhijo], true);

    res.status(200).json({
        "nombre": contenido
    })

    console.log("registro ingresado mensaje")
});

router.get('/getChatById/', async (req, res) => {

    var id=req.query.id;

    console.log(id);

    sql = "select idchat, chat.nombre, idadmin,idhijo, nickname, idpadre from mensaje inner join chat using(idchat) inner join usuario_hijo using(idhijo) where idpadre=:id group by idchat, chat.nombre, idadmin,idhijo, nickname, idpadre";

    let result = await BD.Open(sql, [id], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "idchat": user[0],
            "nombre": user[1],
            "idadmin": user[2],
            "idhijo": user[3],
            "nickname": user[4],
            "idpadre": user[5]
        }

        Users.push(userSchema);
    })
    res.json(Users);
    console.log("enviando chat");
});

// esto es del final

router.post('/crearProducto', async (req, res) => {

    const { nombreProducto, precioProducto } = req.body;

    sql = "insert into producto(nombreProducto, precioProducto) values (:nombreProducto, :precioProducto)";

    await BD.Open(sql, [nombreProducto, precioProducto], true);

    res.status(200).json({
        "nombre": nombreProducto
    })

    console.log("registro ingresado")
});



router.get('/facturastop', async (req, res) => {

    sql = "select sum(detalle_factura.cantidad*producto.precioproducto ) as \"total\", detalle_factura.idfactura from detalle_factura inner join producto on producto.idproducto=detalle_factura.idproducto group by detalle_factura.idfactura order by \"total\" desc FETCH NEXT 3 ROWS ONLY";

    let result = await BD.Open(sql, [], false);

    Users = [];

    result.rows.map(user => {
        let userSchema = {
            "total": user[0],
            "idfactura": user[1]
        }

        Users.push(userSchema);
    })
    res.json(Users);
});

module.exports = router;