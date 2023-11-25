# Sazon Grill


## Inicializacion del  proyecto
Bienvenido al repositorio del proyecto "Sazon Grill" Tu comida favorita

En nombre de nuestro proyecto, nos enorgullece ofrecer una experiencia de entrega única que combina la excelencia culinaria.
La cual nos permite ordenar a los clientes comida del restaurante  de una manera conveniente desde cualquier lugar.

### Características
Orden en linea: Permite que los clientes puedan explorara el menú y realizar sus pedidos y tambien realizar sus pagos de la manera mas adecuada ya se por medio de pago con tarjeta o por medio de pago en efectivo.

## Tecnologías usadas 

# BACKEND

- Base de datos: En este caso para poder almacenar los datos de los prodcutos como el de los pedidos  usamos una base de datos relacional llamada MySQL.
- bcrypt: Es una biblioteca para el cifrado de contraseñas.
- dotenv: Es una herramienta que nos ayuda a cargar variables de entornos desde un archivo.
- express: ES un Framework de Node js que nos ayuda a construir nuestra API y aplicaciones web.
- jsonwebtoken: Esta es una herramienta de JSON web Tokens (JWT) que nos ayuda a la autenticacion.
- mysql2: Es un controlador de MySQL para Node js basado en promesas.
- pusher: ESste es una libreria que nos ayuda a trabajar en tiempo real.
- stripe:Es una biblioteca de Stripe para Node js que nos ayuda a integrar pagos desde nuestro backend.
- cors: Es  un middleware para Express que nos facilita el control de acceso a los recursos de un servidor dede un dominio diferente.
- bodyParser: Es un middleware para Express que nos permite analizar solicitudes de HTTP.
- knex: Este es un contructor de consultas SQL para Node js, que nos ayuda a interactuar con la base de datos de una manera mas sencilla. Tambien nos ayuda a crear migraciones que a su vez nos permite poder versionar y modificar la estructura  de nuestra base de datos.

## Configuración del proyecto

1. Clonar el repositorio
   git clone https://github.com/moraema/API_MULTIDISCIPLINARIO

2. Instalar dependencias 
  Para poder instalar todas las dependencias puede ejcutar en tu terminal en la ubicación del proyecto que clonaste el siguiente comando: npm install.

3. Configurar tus varibales de entorno
    Para poder configurar tus variable de entorno puedes crear un archivo .env en la raiz de tu proyecto, ahi puedes agregar las variables de entronos necesarias para tu uso, como son las claves API, la configuracion de la base de datos, etc.

4. Ejecutar la API
   Teniendo configurado todo puedes ejecutar el siguiente comando para poder inicializar tu proyecto npm start.

 La API estara disponible en tu puerto   'http://localhost:8080'.

## Estructura del proyecto
- src/ : Contiene nuestro codigo usando en el backend.
- src/configs: Contiene nuestras coneciones a nuestra base de datos.
- src/controllers/: contiene a todos nuestros controladores que manejan las consultas y lógica de nuestra rutas.
-src/knex/: contiene las migraciones de nuestra base de datos.
- src/middlewares/: contiene función de middleware que nos ayuda a la authenticación.
- src/routes/: Este contiene nuestras rutas de la API.
- src/seeder/: Este contiene datos iniciales para poder llenar al gunas entidades de nuestra base de datos.


Esperemos y te agrade y te lleves una experiencia maravillosa de nuestra Backend Sazón Grill.



