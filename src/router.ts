import { Router } from 'express' // Importamos Router de express
import { body, param } from 'express-validator' // Para validar esos parámetros que enviemos, por ejemplo que no se pouedan enviar vacíos. En funciones asíncronas se utiliza await check, pero en este caso como el router no es asíncrono utilizamos body.
import { createProduct, deleteProduct, getProductById, getProducts, updateAvailability, updateProduct } from '../src/handlers/product'
import { handleInputErrors } from './middleware'

// Separamos las rutas en su propio archivo para tener un mejor orden

const router = Router() // De esta forma vamos a tener acceso a todas esas funciones del Router de express

// Definimos el schema para nuestra api
/** 
* @swagger
* components:
*       schemas:
*           Product: 
*               type: object
*               properties:
*                   id:
*                       type: integer
*                       description: The Product ID
*                       example: 1
*                   name: 
*                       type: string
*                       description: The Product name
*                       example: Monitor curvo de 49 pulgadas
*                   price: 
*                       type: number
*                       description: The Product price
*                       example: 300
*                   availability:
*                       type: boolean
*                       description: The Product availability
*                       example: true
*/

// Vamos a documentar nuestros endpoints

/** 
 *  @swagger
 *  /api/products:
 *      get:
 *          summary: Get a list of products
 *          tags: 
 *              - Products
 *          description: Return a list of products
 *          responses:
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items: 
 *                                  $ref: '#/components/schemas/Product' 
 *
 * 
 * 
 * 
 * 
 * 
*/



// Obtener producto con GET
// Routing
router.get('/', getProducts) // Para obtener un producto por suid debemos pasarle el id en la url.


/**
 *  @swagger
 *  /api/products/{id}:
 *      get:
 *          summary: Get a product by ID
 *          tags:
 *              - Products
 *          description: Return a product based on its unique ID
 *          parameters:
 *              - in: path
 *                name: id
 *                description: The ID of the product to retrieve 
 *                required: true
 *                schema:
 *                  type: integer
 *          responses:
 *              200: 
 *                  description: Successful Response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'
 *              404:
 *                  description: Not found
 *              400:
 *                  description: Bad Request - Invalid ID
 */

router.get('/:id', // Usamos el routing dinámico para ir obteniendo ese id dinámicamente en base al producto de la base de datos, colocamos la url y :id y el nombre de la variable que se va a generar, esa variable se traduce a un parámetro
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,// Mandamos a llamar esas funciones del handlers/product.ts. Esa función de handleInputErrors es el middleware, el middleware se ejecuta entre una función y otra para procesar las solicitudes HTTP que llegan a la aplicación web antes de ser manejadas por la función de enrutamiento principal. Se utiliza para autenticación, validación de datos, registro de solicitudes, compresión de respuestas, entre otras. Luego de agregar esta función y validación, colocamos next() para que se ejecute la siguiente función que es getProductById.
    // Con ese param le pasamos el id, luego con isInt vaidamos que se cumpla esa función, es decir, que ese id debe ser de tipo entero, osea un número, si no se cumple se ejecuta el mensaje ID no válido, si falla esa validación le pasa los errores con handleInputErrors hacia el middleware.
    getProductById // Luego de validar mandamos a llamar esa función que nos retorna o nos recupera los datos de la base de datos.
)


/** 
 *  @swagger
 *  /api/products:
 *   post:
 *      summary: Creates a new product
 *      tags:
 *          - Products
 *      description: Returns a new record in the database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor curvo de 49 pulgadas"
 *                          price:
 *                              type: number
 *                              example: 399
 *      responses:
 *          201:
 *              description: Product created successfully
 *          400:
 *              description: Bad Request - invalid input data
*/


// Creamos registros, post es para enviar datos al servidor, en este caso, para crear un registro.

// Y agregamos la validación desde acá del router antes de enviarlo al handler product.ts para que esté más limpio ese código.
// Crear producto con POST
router.post('/', 
    // Validación
    body('name') // Validamos el nombre
        .notEmpty().withMessage('El nombre de Producto no puede ir vacio'), // notEmpty va a validar que no esté vacío este valor. withMessage sería el mensaje de validación en caso de que no se cumpla.
    body('price') // Validamos el precio
        .isNumeric().withMessage('Valor no válido') // Va a revisar que sean números
        .notEmpty().withMessage('El precio de Producto no puede ir vacio')
        .custom(value => value > 0).withMessage('Precio no válido'), // Podemos crear reglas personalizadas, por ejemplo que el precio sea mayor a 0, si no se cumple esa condición se ejecuta el withMessage
    handleInputErrors, // Mandamos a llamar esas funciones del handlers/product.ts. Esa función de handleInputErrors es el middleware, el middleware se ejecuta entre una función y otra para procesar las solicitudes HTTP que llegan a la aplicación web antes de ser manejadas por la función de enrutamiento principal. Se utiliza para autenticación, validación de datos, registro de solicitudes, compresión de respuestas, entre otras. Luego de agregar esta función y validación, colocamos next() para que se ejecute la siguiente función que es createProduct.
    createProduct // Si todo sale bien en la validación de arriba, se ejecuta esta función.
)


/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *      summary: Updates a product with user input
 *      tags: 
 *          - Products
 *      description: Returns the updated product
 *      parameters:
 *          - in: path
 *            name: id 
 *            description: The ID of the product to retrieve
 *            required: true
 *            schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor curvo de 49 pulgadas"
 *                          price:
 *                              type: number
 *                              example: 399
 *                          availability:
 *                              type: boolean
 *                              example: true
 *      responses:
 *          200:    
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400: 
 *              
 */


// Editar un producto con PUT
router.put('/:id', 
    // Agregamos la validación
    param('id').isInt().withMessage('ID no válido'),
    body('name')
        .notEmpty().withMessage('El nombre de Producto no puede ir vacio'),
    body('price')
        .isNumeric().withMessage('Valor no válido')
        .notEmpty().withMessage('El precio de Producto no puede ir vacio')
        .custom(value => value > 0).withMessage('Precio no válido'),
    body('availability')
        .isBoolean().withMessage('Valor para disponibilidad no válido'), // Es decir, si esa disponibilidad no es un valor booleanos, ya sea true o false, se ejecuta el mensaje
    handleInputErrors, // Si no se pasa la validación mandamos eso al middleware para mostrar esos errores
    updateProduct // Si la validación sale bien se ejecuta esta función que actualiza.
)



/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *      summary: Update Product availability
 *      tags:
 *          - Products
 *      description: Returns the updated availability
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Successful response
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product not found
 */         

// Editar un producto con PATCH
router.patch('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors, // Si no se pasa la validación mandamos eso al middleware para mostrar esos errores
    updateAvailability // Si la validación sale bien se ejecuta esta función que actualiza.
)

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *      summary: Deletes a Product by a given ID
 *      tags:
 *          - Products
 *      description: Returns a confirmation message
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to delete
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Successful response
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          value: 'Producto eliminado'
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product not found
 */

// Eliminar un producto con DELETE
router.delete('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    deleteProduct
)

export default router