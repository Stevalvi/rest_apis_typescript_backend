import express from 'express' // Instalamos express de forma global con npm i express y luego como dependencia instalamos npm i -D @types/express, con eso vamos a tener los types necesarios para trabajar con express cuándo estamos con typescriot, en caso de que solo queramosel código de javascript, no sería necesario ese npm i -D @types/express
import colors from 'colors' // Se instala npm i colors
import cors, { CorsOptions } from 'cors' // Importamos cors para habilitar cors en el backend, de esa forma permitimos que el dominio de nuestro frontend se conecte al de nuestro backend.
import morgan from 'morgan' // Morgan es un middleware que va a estar logueando todas las peticiones, todas las interacciones que estamos haciendo en nuestra REST API. Lo instalamos con npm i morgan y también npm i --save-dev @types/morgan para el soporte a typescript.
import swaggerUi from 'swagger-ui-express' // Ese va a tener un sitio web, una interfaz visual que vamos a tener con toda la documentación.
import swaggerSpec, { swaggerUiOptions } from './config/swagger'
import router  from './router' // Importamos ese router
import db from './config/db' // Importamos dabatase

// Acá vamos a tener la configuración en el servidor

// Conectar a base de datos
export async function connectDB() { // sequelize utiliza promises, pero nosotros usamos async await
    try {
        await db.authenticate() // Con ese await esperamos a que se realice la conexión y uno de sus métodos es authenticate() y vamos a autenticarnos a nuestra base de datos y si todo está bien, ejecutamos esto:
        db.sync() // Ese sync() lo que va a hacer es que en caso de que vayamos creando nuevos modelos, nuevas columnas a nuestra base de datos va a irlas agregando
        // console.log( colors.blue( 'Conexión exitosa a la BD')) // Esa dependencia de colors nos dá estilos para los errores, ese texto nos aparece en azul
    } catch (error) {
        console.log( colors.red.bold('Hubo un error al conectar a la BD') )
    }
}
connectDB() // Mandamos a llamar esa función

// Instancia de express
const server = express() // Sobre este server se irá agregando toda la configuración del proyecto

// Permitir conexiones
const corsOptions : CorsOptions = {
    origin: function(origin, callback) { // El origin es, quién me está enviando la petición, en este caso es el localhost del frontend: http://localhost:5173/, y el callback es lo que nos permite negar o permitir la conexión
        if (origin === process.env.FRONTEND_URL) {
            callback(null, true) // Toma dos parámetros, el primero es un error, si hay un error no permite la conexión, el segundo parámetro es si queremos permitir la conexión, y al permitir la conexión cuándo ingresemos productos en el formulario y los agreguemos ya se almacenan en la base de datos.
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}
server.use(cors(corsOptions)) // Con ese server.use queremos que todo el tiempo que se utilice el proyecto se ejecuten esos cors. cors es una función y le pasamos nuestras opciones que son propias del proyecto.

// Morgan es un middleware que va a estar logueando todas las peticiones, todas las interacciones que estamos haciendo en nuestra REST API.
server.use(morgan('dev')) // Mandamos a llamar esa función de morgan antes de los llamados de nuestras apis, y toma varias opciones, en este caso usamos dev. Eso lo que hace es dar detalles de las peticiones que se realicen, viene la información del método, si es post, get, etc, viene la url a la cuál se hizo la petición, el código y cuánto tiempo tomó, de esa forma podemos ver cuánto se demoran nuestras peticiones.

// Leer datos de formularios
server.use(express.json()) // use se utiliza para todos los request. Esta función de json() nos permite leer eso datos que enviamos desde el body de postman o thunder client, al enviar el body en thunder client, los recuperamos acá con esta función y nos muestra ese objeto en consola.

server.use('/api/products', router) // Ese use engloba todos esos verbos de HTTP, es decir, get, put, post, patch y delete. Ese use se ejecuta en cada uno de esos métodos. Le pasamos la diagonal o la url y después le pasamos el handler o las funciones del router. Y desde acá nos permite ese versionado de APIS, es decir, podemos cambiar la ruta y se cambia automáticamente en las rutas definidas en ese router.ts

// Swagger va a crear un cliente en una URL en la cuál vamos a poder ver la documentación.
// Docs - Documentación
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions)) // Una vez que visitemos http://localhost:4000/docs/ se ejecutan esas dos dependencias. Le pasamos ese swaggerUI y la configuración que es swaggerspec

export default server