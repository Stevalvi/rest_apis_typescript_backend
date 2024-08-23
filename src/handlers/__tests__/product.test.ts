import request from 'supertest'
import server from '../../server'

describe('POST /api/products', () => { // Vamos a hacer la prueba tipo POST hacia /api/products

    // Creamos esta prueba que sucede antes de crear un producto, es decir, cuándo se manda vacío
    it('should display validation errors', async () => {
        const response = await request(server).post('/api/products').send({}) // De esta forma simulo que estoy enviando el formulario sin llenar nada
        expect(response.status).toBe(400) // Al enviarlo vacío ese thunder client nos muestra que el status que se recibe es 400
        expect(response.body).toHaveProperty('errors') // En este caso si esperemos que tenga la propiedad de errors
        expect(response.body.errors).toHaveLength(4) // Validamos la extensión de los errores, como son 4 objetos que retorna ese objeto de errors, le colocamos ese 4. En caso de que mandemos vacío ese formulario debemos de tener 4 mensajes de error.

        expect(response.status).not.toBe(404) // Probamos que no sea un error 404
        expect(response.body.errors).not.toHaveLength(2) // Probamos que no tengamos una extensión menor
    })

    // Validar que el precio sea igual  a 0

    it('should validate that the price is greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Monitor Curvo',
            price: 0
        }) 
        expect(response.status).toBe(400) // Estamos esperando el error 400 que nos retorna thunder client cuándo enviamos el price en 0
        expect(response.body).toHaveProperty('errors') // En este caso si esperemos que tenga la propiedad de errors
        expect(response.body.errors).toHaveLength(1) // Esperamos un mensaje de error. 

        expect(response.status).not.toBe(404) // Probamos que no sea un error 404
        expect(response.body.errors).not.toHaveLength(2) // Probamos que no tengamos una extensión de 2 errores
    })


    it('should validate that the price is a number and greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Monitor Curvo',
            price: "Hola"
        }) 
        expect(response.status).toBe(400) // Estamos esperando el error 400 que nos retorna thunder client cuándo enviamos el price en 0
        expect(response.body).toHaveProperty('errors') // En este caso si esperemos que tenga la propiedad de errors
        expect(response.body.errors).toHaveLength(2) // Esperamos dos mensajes de error, porque eso retorna thunder client cuándo se manda el price en string "200" o "Hola".

        expect(response.status).not.toBe(404) // Probamos que no sea un error 404
        expect(response.body.errors).not.toHaveLength(4) // Probamos que no tengamos una extensión de 4 errores
    })


    it('should create a new product', async () => {
        const response = await request(server).post('/api/products').send({ // Le pasamos el server a ese request, de esa forma va a montar la base de datos y todo, luego le pasamos la petición de tipo post hacia la url y ese send es lo que vamos a enviarle, es decir, que información queremos pasar hacia ese endpoint.
            //.Usualmente no le vamos a aplicar el testing a la base de datos de la empresa, se recomienda una base de datos de producción, una base de datos de pruebas que probablemente tenga 2 o 3 productos.
            // Esto es lo que enviamos
            name: "Mouse - Testing", 
            price: 50
        })

        // Se puede usar toBe o toEqual
        expect(response.status).toEqual(201) // Verificamos que sea un status 201, es decir, que se permitió crear el producto correctamente.
        expect(response.body).toHaveProperty('data') // Verificamos que al momento de crearse el producto correctamente, eso nos retorna un objeto llamado data que contiene toda la información del producto.

        expect(response.status).not.toBe(404) // Verificamos que no sea 404, es decir, el error 404 que significa que no fué encontrada esa url
        expect(response.status).not.toBe(200) // Que no sea status 200
        expect(response.body).not.toHaveProperty('errors') // Verificamos que no tenga la propiedad de errors, es como la propiedad de data que nos retorna el post cuándo se creó correctamente, en este caso, si en lugar de data es errors verificamos eso.
    })
})

describe('GET /api/products', () => {

    it('should check if api/products url exists', async () => { // primero verificamos que exista esa url 
        const response = await request(server).get('/api/products')

          // Lo que no esperamos
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors') // verificamos que no tengamos errores
    })

    it('GET a JSON response with products', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).toBe(200) // Cuándo se manda la petición get para obtener el producto ya sea por thunder client o postman, se espera el status 200, eso es lo que esperamos en este expect
        expect(response.headers['content-type']).toMatch(/json/) // Se espera que haya una respuesta json, en la parte de headers en el thunder client donde hacemos la petición se logra ver ese content-type y la respuesta que se obtiene cuándo mandamos la petición get.
        expect(response.body).toHaveProperty('data') // Al enviar esa petición get, siempre nos retorna un data si se pudo realizar la consulta correctamente, verificamos que tengamos ese data como respuesta.
        expect(response.body.data).toHaveLength(1) // Verificamos que ese data tenga una respuesta o extensión de un solo producto, ya que es lo único que tendremos al hacer la prueba por lo que estamos limpiando la base de datos constantemente en el data/index.ts

    })
})

describe('GET /api/products/:id', () => { // Verificamos con un id que no existe, es decir, esperamos errores.
    it('Should return a 404 response for a non-existent product', async () => {
        const productId = 2000 // Le colocamos un id que no exista en la base de datos 
        const response = await request(server).get(`/api/products/${productId}`) // De esa forma ese id es dinámico
        expect(response.status).toBe(404) // Esperamos el error 404 porque ese producto no fué encontrado.
        expect(response.body).toHaveProperty('error') // Verificamos que lo que nos retorna esa respuesta contiene un objeto que en lugar de tener data tiene la propiedad error con el mensaje de error.
        expect(response.body.error).toBe('Producto no encontrado') // Accedemos a ese mensaje y hay que colocarlot al cuál como lo retorna thunder client 
    })

    // creamos otra prueba en caso de que en lugar de mandarle un id de number a esa url, se le mande un id como string, ejemplo: http://localhost:4000/api/products/hola
    it('Should check a valid ID in the URL', async () => {
        const response = await request(server).get('/api/products/not-valid-url') // Petición a la url no válida
        expect(response.status).toBe(400)       
        expect(response.body).toHaveProperty('errors')        
        expect(response.body.errors).toHaveLength(1) // Ese error debe tener una extensión de 1, osea un solo error   
        expect(response.body.errors[0].msg).toBe('ID no válido') // Accedemos a ese error que nos retorna la petición a la url no válida        
    })

    // Finalmente vamos a revisar si estamos obteniendo un producto
    it('Get a JSON response for a single product', async () => {
        const response = await request(server).get('/api/products/1') // Petición a la url con un id que siempre va a existir
        expect(response.status).toBe(200) // Si se obtiene correctamente ese producto el status es 200  
        expect(response.body).toHaveProperty('data') // Que tenga la propiedad de data  
    })
})

describe('PUT /api/products/:id', () => { // Probamos la actualización de productos con PUT

    // Probamos con el parámetro de la url, una url no válida pero con la información del formulario buena.
    it('Should check a valid ID in the URL', async () => {
        const response = await request(server).put('/api/products/not-valid-url').send({
            name: "Monitor Curvo",
            availability: true,
            price: 300
        })
        expect(response.status).toBe(400)       
        expect(response.body).toHaveProperty('errors')        
        expect(response.body.errors).toHaveLength(1) // Ese error debe tener una extensión de 1, osea un solo error   
        expect(response.body.errors[0].msg).toBe('ID no válido') // Accedemos a ese error que nos retorna la petición a la url no válida        
    })

    it('should display validation error messages when updating a product', async () => {
        const response = await request(server).put('/api/products/1').send({}) // Estamos enviando ese formulario vacío al momento de actualizar el producto.

        // Lo que esperamos
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy() // Ese toBeTruthy solo verifica y retorna un true o false, true si lo que mandamos, es decir, el formulario tiene información, si no tiene es false.
        expect(response.body.errors).toHaveLength(5) // Al enviar ese formulario vacío se espera el error que contiene 5 errores, esa va a ser la extensión

        // Lo que no esperamos
        expect(response.status).not.toBe(200) // Es decir, no esperamos que sea correcto.
        expect(response.body).not.toHaveProperty('data') // No esperamos que contenta la propiedad data
    })

    // Esperamos comprobar que solo el precio tenga valores positivos o sea mayor a 0
    it('should validate that the price is greater than 0', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: "Monitor Curvo",
            availability: true,
            price: 0
        }) // Estamos enviando ese formulario con información

        // Lo que esperamos
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy() 
        expect(response.body.errors).toHaveLength(1) 
        expect(response.body.errors[0].msg).toBe('Precio no válido') 

        // Lo que no esperamos
        expect(response.status).not.toBe(200) // Es decir, no esperamos que sea correcto.
        expect(response.body).not.toHaveProperty('data') // No esperamos que contenta la propiedad data
    })

    // Hacemos la prueba para verificar que no existe el producto, pero lo hacemos pasando información válida en el formulario para pasar la validación.
    it('should return a 404 response for a non-existent product', async () => {
        const productoId = 2000
        const response = await request(server).put(`/api/products/${productoId}`).send({
            name: "Monitor Curvo",
            availability: true,
            price: 300
        }) // Estamos enviando ese formulario con información

        // Lo que esperamos
        expect(response.status).toBe(404) // Estamos esperando un error 404 que es cuándo un producto no existe
        expect(response.body.error).toBe('Producto no encontrado')

        // Lo que no esperamos
        expect(response.status).not.toBe(200) // Es decir, no esperamos que sea correcto.
        expect(response.body).not.toHaveProperty('data') // No esperamos que contenta la propiedad data
    })

    // Creamos la prueba para un id existent y con la información correcta, es decir, todo correcto para realizar esa actualización del producto.
    it('should update an existing product with valid data', async () => {
        const response = await request(server).put('/api/products/1').send({
            name: "Monitor Curvo",
            availability: true,
            price: 300
        }) // Estamos enviando ese formulario con información

        // Lo que esperamos
        expect(response.status).toBe(200) // Estamos esperando un status 200, osea que todo salió bien
        expect(response.body).toHaveProperty('data')

        // Lo que no esperamos
        expect(response.status).not.toBe(400) // Es decir, no esperamos que sea incorrecto.
        expect(response.body).not.toHaveProperty('errors') // No esperamos que contenta la propiedad errors
    })
})

describe('PATCH /api/products/:id', () => {

    // Primero creamos la prueba con un producto que no existe
    it('should return a 404 response for a non-existing product', async () => {
        const productId = 2000
        const response = await request(server).patch(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        // Lo que no esperamos
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    // PLuego creamos la prueba con un producto que si existe
    it('should update the product availability', async () => {
        const response = await request(server).patch('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false) // revisamos o cambiamos la disponibilidad

        // Lo que no esperamos
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('error')
    })
})

describe('DELETE /api/products/:id', () => { // Probamos con la url no válida
    it('should check a valid ID', async () => {
        const response = await request(server).delete('/api/products/not-valid')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe('ID no válido')
    })

    // Verificamos con un id que no existe
    it('should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const response = await request(server).delete(`/api/products/${productId}`)

        // Lo que esperamos
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        // Lo que no esperamos
        expect(response.status).not.toBe(200) // Que se realice la eliminación correctamente
    })

    // Hacemos la prueba haciendo todo correctamente
    it('should delete a product', async () => {
        const response = await request(server).delete('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body.data).toBe("Producto eliminado")

        // Lo que no esperamos
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
    })
})

// Luego de realizar las pruebas, para probar nuestra métrica de validación de las pruebas de testing, es decir, para saber el porcentaje de validación de nuestras pruebas agregamos coverage a nuestro package.json, de esa forma sabemos que tan bien realizamos las pruebas de nuestro código.