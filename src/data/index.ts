
// Este código va a limpiar nuestra base de datos cada que se finaliza una prueba de testing, recordemos que para ver esa base de datos no es la de postgresSQL sinó la de la url que colocamos en el navegador http://localhost:4000/api/products

import { exit } from 'node:process' // Exit lo que va a hacer es detener la ejecución de un código de nodejs
import db from '../config/db' // Porque necesitamos la instancia de sequelize

const clearDB = async () => { // Asíncrona porque no sabemos cuánto tiempo se tarde en limpiar la base de datos.
    try {
        await db.sync({ force: true }) // De esa forma va a eliminar los datos de la base de datos
        console.log('Datos eliminados correctamente')
        exit(0) // Osea que finalizó correctamente, sin errores.
    } catch (error) {
        console.log(error)
        exit(1) // Si le ponemos un 1 significa que finaliza con errores, en cambio, si se le pone solamente exit() o exit(0) significa que finaliza sin errores, es decir, finaliza bien.
    }

}

if (process.argv[2] === '--clear') { // process.argv es un comando que se ejecuta desde el CLI de nodejs, ese [2] sería la posición 2, supongamos que colocamos npm run dev --clear, ese --clear sería la posición 2, en este caso en el package.json creamos el comando: "pretest": "ts-node ./src/data --clear", en dónde ts-node toma la posición [0], ./src/data toma la posición [1] y ese --clear toma la posición [2], ese pretest es para evitar estar ejecutando ese comando para limpiar la base de datos, y se ejecuta antes de test, de esa forma va a limpiar esa base de datos antes de ejecutar las pruebas. Basta con colocar npm test para que ese pretest se ejecute. Si quisiéramos ejecutar un código después del test se llama posttest, y también solo se manda a llamar npm test y se ejecuta ese posttest.
    clearDB()
}