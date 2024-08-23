import {Request, Response, NextFunction} from 'express' // Importamos esos types para esos parámetros o funciones, de esa forma quitamos los any.
import { validationResult } from 'express-validator' // Se instala con npm i express-validator

// Pasamos esa validación acá en el Middleware de nodejs.

// El middleware se ejecuta entre una función y otra para procesar las solicitudes HTTP que llegan a la aplicación web antes de ser manejadas por la función de enrutamiento principal. Se utiliza para autenticación, validación de datos, registro de solicitudes, compresión de respuestas, entre otras.

// Siempre que usemos Middleware debemos usar req y res ya que forman parte de la petición HTTP

export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => { // Son errores de validación
    let errors = validationResult(req) // Recuperamos esos mensajes de error para ver esa validación, eso se hace con ValidationResult y le pasamos el request, para que pueda leer los campoos que hemos ingresado.
    if (!errors.isEmpty()) { // Si errores no está vacío significa que hay errores.
        return res.status(400).json({ errors: errors.array() }) // Si hay errores queremos prevenir que se generen productos y ese res.status(400) es un error cuándo enviamos un request incorrecto. Colocamos json({errors: erros.array()}) y le pasamos los errores como arreglo, los va a formatear de esa forma.
    }
    next() // El next quiere decir, ya terminé aquí, vete a la siguiente función, básicamente este next es como si le estuviéramos pasando la función del router.ts que es createProduct, entonces en lugar de pasarle createProduct() y mandarla a llamar, express nos dá ese next que es una función dinámica que lo que hace es mandarlo a la siguiente función cuando haya terminado el trabajo aquí.
}