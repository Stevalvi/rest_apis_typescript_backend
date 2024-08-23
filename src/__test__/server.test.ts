import { connectDB } from '../server'; // Importamos ese server y lo va a tener en este test, esta conexión al servidor va a ser asíncrona porque no sabemos cuánto tiempo le va a demorar conectarse.
import db from '../config/db';


// Forzar errores para probar los catchs

// En jest un mock es una técnica para las pruebas, para simular el comportamiento de ciertos módulos, funciones u objetos en este entorno. Es decir, lo que hacemos es importar la conexión de la base de datos acá, y lanzar un error para que se ejecute ese catch del server.ts, porque lo requerimos conectado a nuestra base de datos todo el tiempo.
jest.mock('../config/db') // Le pasamos ese db de la carpeta config, le pasamos la configuración de nuestra base de datos.

describe('connectDB', () => {

    // Colocamos un it que diga que debe manejar el error en la autenticación o en la conexión a la base de datos 
    it('should handle database connection error', async () => {
        jest.spyOn(db, 'authenticate') // spyon toma dos parámetros, uno es un objeto y el otro es la función, ese authenticate es el mismo que está en server.ts como await db.authenticate() en el try. Ese spyon lo que va a hacer es crear una función en el ambiente de ese mock, y le pasamos la base de datos y el método que queremos observar su comportamiento, que en este caso es authenticate.
            
            // Luego de mandar a llamar ese authenticate le pasamos una excepción, para forzar a que se ejecute ese error del catch
            .mockRejectedValueOnce(new Error('Hubo un error al conectar a la BD'))
        const consoleSpy = jest.spyOn(console, 'log') // Ahora vamos a espiar por ese error, y lo que hacemos es esperar por el objeto de console y esperar ese 'log'

        await connectDB() // Para ello hacemos la conexión, pero ya estamos espiando para cuándo se autentique y cuándo tengamos un error y vamos a leer esos posibles errores.

        // Lo que esperamos, que sería la ejecución de ese error del catch.
        // Esa función de toHaveBeenCalledWith es especial cuándo se trabaja con mocks, se asegura de que un mock haya sido llamado con ciertos argumentos.
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Hubo un error al conectar a la BD') // Eso es lo que esperamos, que contenga cierto texto.
        )
    })
})




// Para que nuestra aplicación reconozca esos archivos de testing, colocarlos dentro de la carpeta __test__ ya identifica que son de testing, y para los archivos se usa la extensión de .test.ts u otras extensiones.
 
// describe('Nuestro primer test', () => {
//     Acá realizamos las pruebas, se pueden escribir en it() o test(), es lo mismo.
//     it('Debe revisar que 1 + 1 sean 2', () => {
//         expect(1 + 1 ).toBe( 2 ) // Son funciones que aparecen ya de forma global, ese expect es lo que espero, y el toBe es el valor con el que vamos a comparar
//     })

//     it('Debe revisar que 1 + 1 no sean 2', () => {
//         expect(1 + 1 ).not.toBe( 3 ) // Son funciones que aparecen ya de forma global, ese expect es lo que espero, y el toBe es el valor con el que vamos a comparar
//     })
// }) // Una vez que hemos instalado jest como dependencia esta función está disponible de manera global, por eso no es necesario importarla. Y este dsscribe nos va a permitir agrupar una serie de pruebas que están relacionadas. por ejemplo si queremos probar la conexión a la base de datos, se coloca en un describe y diferentes pruebas pequeñas, pero si vamos a probar algo diferente, tenemos que crear un describe diferente, no vamos a colocar todo en un solo describe porque lo idea es que se agrupen, y toma dos parámetros los describe(). Toma el nombre o el texto de la prueba y el segundo parámetro es un call back y puede ser un function o un arrow functions.