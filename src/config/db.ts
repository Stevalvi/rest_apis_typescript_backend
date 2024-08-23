import { Sequelize } from 'sequelize-typescript' // Se instala con npm i sequelize-typescript
import dotenv from 'dotenv' // npm i dotenv, para crear nuestra variable de entorno y proteger esa url de la base de datos.
dotenv.config() // Mandamos a llamar las variables de entorno incluyendo lo que tenemos en ese .env

// Sequelize va a instanciar el nombre de la base de datos con usuario y password, también sin el password o la url completa, en este caso asignamos la url de nuestra base de datos PostgreSQL donde aparece info - External Database URL: postgresql://rest_api_node_typescript_6175_user:KhjMz7T0oRWZYjMmmdBkClmucRHohQrU@dpg-cr03p5rv2p9s73a12cn0-a.oregon-postgres.render.com/rest_api_node_typescript_6175
const db = new Sequelize(process.env.DATABASE_URL!, { // Le asignamos esa variable de entorno y con ! le decimos que siempre va a venir ese valor para que no aparezca que puede ser undefined
    models: [__dirname + '/../models/**/*'],
    logging: false // Agregamos ese modelo que creamos Product.model.ts para que se vayan generando las columnas en nuestra base de datos, le ponemos models: y le especificamos el directorio en donde va a encontrar ese model. __dirname es una función especial de nodejs que nos retorna la ubicación del archivo que lo está mandando a llamar, nos salimos de esta carpeta con /../ nos vamos a la carpeta models y le decimos que todos los archivos que estén dentro de esa carpeta sean considerados modelos. Con ese logging: false deshabilitamos esos console.log de sequelize que manda a la consola, esto es para que al momento de hacer el testing no nos muestre esos console.log
})

export default db