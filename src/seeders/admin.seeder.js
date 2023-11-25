const mysql = require('mysql2');
const bcrypt = require('bcrypt');
require('dotenv').config();
const saltosBcrypt = parseInt(process.env.SALTOS_BCRYPT);

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

const seedUsuarios = () => {
    connection.connect((err) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            return;
        }

        console.log('Conexión a la base de datos establecida');


        const administradores = [
            { usuario: 'adminZasonGrill', contraseña: bcrypt.hashSync('zason2034', saltosBcrypt), },

        ];

        const categorias = [
            { id_categoria: 1, categoria: "desayunos" },
            { id_categoria: 2, categoria: "Aguas frecas" },
            { id_categoria: 3, categoria: "postres" },
            { id_categoria: 4, categoria: "comidas rapidas" },
            { id_categoria: 5, categoria: "comidas" },
            { id_categoria: 6, categoria: "cenas" },
            { id_categoria: 7, categoria: "Refrescos" },
            { id_categoria: 8, categoria: "cafe" },
        ];

        const productos = [

            { id_producto: 1, nombre_producto: "Taco surtido", precio: 23.00, descripcion: "Taco en tortilla de maíz con surtido de maciza, cuerito, costilla, chamorro, acompañado de repollo, limón, cebolla, habanero y bolsas de salsa de la casa", imagen: "https://images.rappi.com.mx/products/982292629-1626975802697.jpg", id_categoria: 6 },
            { id_producto: 2, nombre_producto: "Gorditas", precio: 23.00, descripcion: "Gorditas de chamorro, acompañada de repollo, limón, cebolla, habanero y bolsas de salsa de la casa.", imagen: "https://images.rappi.com.mx/products/982292548-1626975645015.jpg", id_categoria: 6 },
            { id_producto: 3, nombre_producto: "Chilaquiles", precio: 50.00, descripcion: "Desayunos. crujientes totopos servidos con la salsa de tu elección, queso rallado, crema, aguacate y cebolla morada.", imagen: "https://images.rappi.com.mx/products/tmp278921032379397931934511143.png", id_categoria: 1 },
            { id_producto: 4, nombre_producto: "Huevos motuleños", precio: 35.00, descripcion: "Desayunos. 2 huevos estrellados, tostada frita, salsa roja, jamón, queso amarillo, chícharos, plátanos fritos, crema y queso fresco.", imagen: "https://images.rappi.com.mx/products/tmp278921631591354533006463292.png", id_categoria: 1 },
            { id_producto: 5, nombre_producto: "Hot cakes", precio: 40.00, descripcion: "Hot cakes con una variedad de deliciosos ingredientes, como siropes, frutas frescas, chocolate, nueces y crema batida.", imagen: "https://images.rappi.com.mx/products/tmp2846663411879040050167965393.png", id_categoria: 1 },
            { id_producto: 6, nombre_producto: "Sándwich", precio: 35.00, descripcion: "Sándwiches. sándwich con pollo, jamón, quesillo, lechuga, jitomate, aguacate y papas a la francesa.", imagen: "https://images.rappi.com.mx/products/tmp278921156813396225298067721.png", id_categoria: 1 },
            { id_producto: 7, nombre_producto: "Pechugas de pollo", precio: 90.00, descripcion: "De pollo (150 g), con brócoli y queso manchego, acompañada de papas doradas al perejil y ensalada con aderezo de jengibre.", imagen: "https://images.rappi.com.mx/products/tmp4247418111172438112760141223.png", id_categoria: 5 },
            { id_producto: 8, nombre_producto: "Filetes de res", precio: 75.00, descripcion: "Filete de res (120 g) acompañado con dos dobladitas de mole, frijoles refritos al gratín, arroz a la mexicana y esquites tatemados.", imagen: "https://images.rappi.com.mx/products/tmp283853808435252466594703499.png", id_categoria: 5 },
            { id_producto: 9, nombre_producto: "Milanesa de res", precio: 90.00, descripcion: "Milanesa de res importada (150 g) acompañada con salsa verde, esquites y queso manchego.", imagen: "https://images.rappi.com.mx/products/tmp283854048968897463972499435.png", id_categoria: 5 },
            { id_producto: 10, nombre_producto: "Pechuga de pollo a la parrilla", precio: 85.00, descripcion: "Pechuga (150 g) acompañada con ensalada de lechuga, jitomate, aguacate, pepino y aderezo a las finas hierbas.", imagen: "https://images.rappi.com.mx/products/tmp2838543411041047506535144554.png", id_categoria: 5 },
            { id_producto: 11, nombre_producto: "Empanada de carne molida", precio: 20.00, descripcion: "Orden de 3 empanadas, masa con chipilín, acompañado de queso, crema, repollo y salsa roja.", imagen: "https://images.rappi.com.mx/products/9115b56e-2fb7-4977-8c5d-29b11c9e782e-1657641122476.png", id_categoria: 6 },
            { id_producto: 12, nombre_producto: "Quesadillas", precio: 25.00, descripcion: "Con tortillas hechas a mano, 100% maíz, acompañada de salsa, cebolla, cilantro y limones.", imagen: "https://images.rappi.com.mx/products/42f51435-f111-4ab7-8c53-b2304ffa7d06-1657640965367.png", id_categoria: 6 },
            { id_producto: 13, nombre_producto: "Tortas", precio: 15.00, descripcion: "Torta de cochito, incluye tomate, cebolla, lechuga, aguacate, frijol, chile.", imagen: "https://images.rappi.com.mx/products/f3235b53-8b59-471c-b32f-836b4684de2b-1657641348407.png", id_categoria: 6 },
            { id_producto: 14, nombre_producto: "Horchatas", precio: 25.00, descripcion: "1 Litro de horchata de la casa bien frío.", imagen: "https://images.rappi.com.mx/products/gp_mexican_otra_agua_de_horchata_n.jpg", id_categoria: 2 },
            { id_producto: 15, nombre_producto: "Chocomilk", precio: 25.00, descripcion: "Bebida sabor chocolate. 500 ml", imagen: "https://images.rappi.com.mx/products/97511351-a336-4c7f-9ee6-76a00c47a157-1632168654462.png", id_categoria: 2 },
            { id_producto: 16, nombre_producto: "Limon con chía", precio: 25.00, descripcion: "Bebida fresca", imagen: "https://images.rappi.com.mx/products/c74acf27-0cf0-454c-82af-5e8c1c1e5bff-1697495384427.png", id_categoria: 2 },
            { id_producto: 17, nombre_producto: "Tascalate", precio: 25.00, descripcion: "Bebida de cacao, maíz, achiote y azúcar.", imagen: "https://images.rappi.com.mx/products/fe2c5951-eaeb-4c2e-9cb2-27ddd90a43fb-1697488913622.png", id_categoria: 2 },
            { id_producto: 18, nombre_producto: "Jamaica", precio: 25.00, descripcion: "Bebida de jamaica natural", imagen: "https://images.rappi.com.mx/products/95009f86-5317-4ac6-a2d1-658eca933a37-1632168138146.png", id_categoria: 2 },
            { id_producto: 19, nombre_producto: "Pepsi", precio: 27.00, descripcion: "Refresco embotellado", imagen: "https://images.rappi.com.mx/products/979256263-1618583088060.png", id_categoria: 7 },
            { id_producto: 20, nombre_producto: "Manzanita sol", precio: 27.00, descripcion: "Refresco embotellado", imagen: "https://images.rappi.com.mx/products/977090284-1595950801430.jpg", id_categoria: 7 },
            { id_producto: 21, nombre_producto: "7UP original", precio: 27.00, descripcion: "Refresco embotellado", imagen: "https://images.rappi.com.mx/products/977054753-1595946095528.jpg", id_categoria: 7 },
            { id_producto: 22, nombre_producto: "Coca cola", precio: 30.00, descripcion: "Coca-Cola Bebida Gaseosa Sabor Original.", imagen: "https://images.rappi.com.mx/products/af680304-d291-40e4-b0c3-ad7da7f052f8.jpg", id_categoria: 7 },
            { id_producto: 23, nombre_producto: "Café de olla", precio: 20.00, descripcion: "Café de olla caliente 300 ml.", imagen: "https://images.rappi.com.mx/products/2114076328-1679932058114.jpg", id_categoria: 8 },
            { id_producto: 24, nombre_producto: "Café frío", precio: 20.00, descripcion: "Café latte frío 450 ml.", imagen: "https://images.rappi.com.mx/products/2114076326-1679930319717.jpg", id_categoria: 8 },
            { id_producto: 25, nombre_producto: "Café con leche", precio: 20.00, descripcion: "Café con leche, 300 ml.", imagen: "https://images.rappi.com.mx/products/2114076323-1679930323337.jpg", id_categoria: 8 },
            { id_producto: 26, nombre_producto: "Cheesecake", precio: 45.00, descripcion: "Tarta de queso bañada en dulce de leche, sobre salsa de frutos rojos.", imagen: "https://images.rappi.com.mx/products/2111180306-1642456705111.jpg", id_categoria: 3 },
            { id_producto: 27, nombre_producto: "Pastel de chocolate", precio: 45.00, descripcion: "Pastel de chocolate con trozos de nuez, servido sobre salsa de frutos rojos.", imagen: "https://images.rappi.com.mx/products/2111180308-1642456727387.jpg", id_categoria: 3 },
            { id_producto: 28, nombre_producto: "Conchas", precio: 10.00, descripcion: "Conchas con preparación de la casa.", imagen: "https://images.rappi.com.mx/products/2114616614-1689802682062.jpg", id_categoria: 3 },
            { id_producto: 29, nombre_producto: "Rosca", precio: 10.00, descripcion: "Rosca acompañada de queso philadelphia.", imagen: "https://images.rappi.com.mx/products/2114616612-1689802702682.jpg", id_categoria: 3 },
            { id_producto: 30, nombre_producto: "Helado de vainilla", precio: 45.00, descripcion: "Helado de vainilla con crema chantillí de la casa.", imagen: "https://images.rappi.com.mx/products/2114616564-1689802686416.jpg", id_categoria: 3 },
            { id_producto: 31, nombre_producto: "Platanitos fritos", precio: 30.00, descripcion: "Plátanos fritos con queso y crema, porción personal.", imagen: "https://images.rappi.com.mx/products/2114616570-1689802702675.jpg", id_categoria: 3 },
            { id_producto: 32, nombre_producto: "Fresas con cremas", precio: 45.00, descripcion: "Fresas con crema, porción personal.", imagen: "https://images.rappi.com.mx/products/2114616566-1689802686415.jpg", id_categoria: 3 },
            { id_producto: 33, nombre_producto: "Pay de limón", precio: 40.00, descripcion: "Pie de limón, porción personal.", imagen: "https://images.rappi.com.mx/products/2114616568-1689802702681.jpg", id_categoria: 3 },
            { id_producto: 34, nombre_producto: "Crepa de Fresa y Philadelphia", precio: 50.00, descripcion: "Crepa de la casa, untada de queso philadelphia, fresas, acompañada de crema chantillí y chocolate líquido.", imagen: "https://images.rappi.com.mx/products/2114616606-1689802686407.jpg", id_categoria: 3 },
            { id_producto: 35, nombre_producto: "Crepa de Cajeta y Nuez", precio: 50.00, descripcion: "Crepa de la casa, untada de cajeta, nuez, acompañada de crema chantillí y nuez moscada.", imagen: "https://images.rappi.com.mx/products/2114616604-1689802682062.jpg", id_categoria: 3 },
            { id_producto: 36, nombre_producto: "Wafles tradicional", precio: 45.00, descripcion: "Waffle de la casa, untado de nutella, fresas, plátanos y crema chantillí.", imagen: "https://images.rappi.com.mx/products/2114616571-1689802706264.jpg", id_categoria: 3 },
            { id_producto: 37, nombre_producto: "Waffle con Tocino y Miel", precio: 45.00, descripcion: "Waffle de la casa con 3 tiras de tocino, acompañado de miel maple.", imagen: "https://images.rappi.com.mx/products/2114616574-1689802706263.jpg", id_categoria: 3 },
            { id_producto: 38, nombre_producto: "Alitas", precio: 50.00, descripcion: "Alitas 200 gr de 1 y 2 huesos, bañadas en salsa a elegir, acompañadas de una porción de papas a la francesa y aderezo ranch.", imagen: "https://images.rappi.com.mx/products/2113724085-1673560802569.png", id_categoria: 4 },
            { id_producto: 39, nombre_producto: "Hamburguesa", precio: 45.00, descripcion: "Hamburguesa clásica con carne de res, jamón, salami, queso amarillo y todos sus vegetales, acompañada de una porción de papas a la francesa.", imagen: "https://images.rappi.com.mx/products/6e2469ec-e3bb-4f55-83a1-3fd5b71d9f3b-1695852215526.png", id_categoria: 4 },
            { id_producto: 40, nombre_producto: "Hot dog", precio: 40.00, descripcion: "Hot dog clásico con salchicha, tomate, cebolla y todos sus aderezos.", imagen: "https://images.rappi.com.mx/products/16279882-ac2d-4dcc-b540-ac041f81649f-1695700500511.png", id_categoria: 4 },
            { id_producto: 41, nombre_producto: "Hot Dog con Papas a la Francesa", precio: 50.00, descripcion: "Hot dog clásico con salchicha, tomate, cebolla y todos sus aderezos, con una porción extra de papas a la francesa.", imagen: "https://images.rappi.com.mx/products/f095d335-84a0-40e0-a789-3a1e56abd749-1695700933227.png", id_categoria: 4 },
            { id_producto: 42, nombre_producto: "Tequesitos", precio: 30.00, descripcion: "Dedos de harina de trigo con tu relleno preferido (8 piezas).", imagen: "https://images.rappi.com.mx/products/9317085f-5018-441e-ab05-dff09193ec60-1643942971072.png", id_categoria: 4 },
            { id_producto: 43, nombre_producto: "Papas fritas", precio: 30.00, descripcion: "Papas fritas, 250 gr.", imagen: "https://images.rappi.com.mx/products/2113312607-1665870602905.jpg", id_categoria: 4 },
            { id_producto: 44, nombre_producto: "Papas Crispy Grandes", precio: 30.00, descripcion: "Papas crispy 400 gr", imagen: "https://images.rappi.com.mx/products/2111180140-1642456582505.jpg", id_categoria: 4 }
        ];

        const metodo_pago = [
            { id_metodo_pago: 1, metodo_pago: "Efectivo" },
            { id_metodo_pago: 2, metodo_pago: "Tarjeta" },
        ];


        const metodopagoquery = 'INSERT INTO metodos_pagos (id_metodo_pago, metodo_pago) VALUES (?, ?)'
        const administradoresquery = 'INSERT INTO administradores (usuario, contraseña) VALUES (?, ?)';
        const categoriaquery = 'INSERT INTO categorias (id_categoria, categoria) VALUES (?, ?)';
        const productosquery = 'INSERT INTO productos (id_producto, nombre_producto, precio, descripcion, imagen, id_categoria) VALUES (?, ?, ? ,? ,?, ?)';

        administradores.forEach((usuario) => {
            connection.query(administradoresquery, [usuario.usuario, usuario.contraseña], (error) => {
                if (error) {
                    console.error('Error al insertar administradores:', error);
                    connection.end();
                }

            });
        });

        categorias.forEach((categorias) => {
            connection.query(categoriaquery, [categorias.id_categoria, categorias.categoria], (error) => {
                if (error) {
                    console.log("error al insertar a las categorias: ", error)
                    connection.end();
                }
            });
        });


        productos.forEach((productos) => {
            connection.query(productosquery, [productos.id_producto, productos.nombre_producto, productos.precio, productos.descripcion, productos.imagen, productos.id_categoria], (error) => {
                if (error) {
                    console.log("error al insertar los productos: ", error);
                    connection.end();
                }
            });
        });

        metodo_pago.forEach((pagos) => {
            connection.query(metodopagoquery, [pagos.id_metodo_pago, pagos.metodo_pago], (error) => {
                if (error) {
                    console.log("error al insertar los metodos de pagos : ", error);
                    connection.end();
                }
            });
        });


        console.log('todos los datos de prueba fueron insertados correctamente');
        connection.end();
    });
};

seedUsuarios();