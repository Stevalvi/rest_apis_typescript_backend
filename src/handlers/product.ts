import { Request, Response } from 'express' // Instalamos express de forma global con npm i express y luego como dependencia instalamos npm i -D @types/express, con eso vamos a tener los types necesarios para trabajar con express cuándo estamos con typescriot, en caso de que solo queramosel código de javascript, no sería necesario ese npm i -D @types/express. Para tener un buen autocompletado con esos res. y req. importamos Request y Response y los asignamos como tipo de dato para que no nos salga que son any. Ambas son interfaces que ya vienen en express.
import Product from '../models/Product.model' // Importamos ese modelo


// Este handler llamado product.ts tiene unas funciones que nos ayudan a separar nuestra funcionalidad de ese router

// Siempre que vayamos a interactuar con nuestros modelos estas funciones deben ser asíncronas, y tienen que ser asíncronas porque en lo que hace la consulta a la base de datos se trae la información, va a tardar un poco y haciéndolo asíncrono aseguramos de que el código detenga su ejecución hasta que tengamos resultados.

export const getProducts = async (req: Request, res: Response) => {
    const products = await Product.findAll({
        order: [
            ['price', 'DESC']
        ]
    })
    res.json({data: products}) // json es para recibir esa respuesta de tipo json
}

export const getProductById = async (req: Request, res: Response) => { // el req o request es lo que mandamos y el res o response lo que recibimos
    const { id } = req.params // Extraemos ese id de req.params, de esa forma lo recuperamos de la base de datos, y como en la url nombramos esa variable router.get('/:id', de esa forma debemos nombrarla acá para extraerla.
        const product = await Product.findByPk(id) // await porque vamos a interactuar con la base de datos, usamos la función findByPrimaryKey porque ese id es un primary key

        if(!product) { // Si no hay un producto, es decir, no existe ese id.
            return res.status(404).json({ // Retornamos el error, el error 404 es cuándo algo no se encuentra.
                error: 'Producto no encontrado'
            })
        }

        res.json({data: product}) // Pasamos ese product
}

// Crear producto, es de tipo post
export const createProduct = async (req : Request, res : Response) => { // el req o request es lo que mandamos y el res o response lo que recibimos
   // Usamos dentro de try catch porque en caso de que se presnete un error que no tiene nada que ver con los errores de validación que creamos sinó más bien que no se pudo establecer conexión con la base de datos o algo similar, con ese catch vemos ese error.
        const product = await Product.create(req.body) // Con ese req.body recuperamos lo que mandemos desde thunder client en el body, y eso nos crea el objeto y finalmente lo almacenamos en la base de datos. Ese método de create primero crea la instancia y lo va a almacenar en la base de datos.
        res.status(201).json({data: product}) // Retornamos el producto como objeto, de esa forma va a ser el producto que se ingresó a la base de datos, que sería el que enviamos desde thunder client en el body. Cuándo creamos un producto se utiliza el status(201) que queire decir que se realizó correctamente.
}

// Editar o actualizar producto con PUT
// La diferencia entre PATCH y PUT, es que PATCH cuándo solo editas una propiedad, ya sea name, price o la disponibilidad, solo te actualiza esa propiedad y te deja las demás como estaban, en cambio PUT si solo modificas una propiedad te reemplaza todo el objeto y solo te retorna esa propiedad y las que no actualizaste las elimina. Colocándo ese update evitamos que PUT haga eso, update solo reemplaza la propiedad que estamos actualizando y mantiene las demás como están sin borrarlas.
// Cuándo actualizamos primero se verifica que el producto exista
export const updateProduct = async (req: Request, res: Response) => { // el req o request es lo que mandamos y el res o response lo que recibimos
    const { id } = req.params
    const product = await Product.findByPk(id)

    if(!product) {
        return res.status(404).json({
            error: 'Producto no encontrado'
        })
    }
    
    // Actualizar
    await product.update(req.body) // Con req.body recuperamos esos datos, ya sea para un post o put, con ese await product.update y ese req.body va a actualizar el producto con lo que le pasemos. update solo actualiza lo que le mandemos. Colocándo ese update evitamos que PUT haga eso, update solo reemplaza la propiedad que estamos actualizando y mantiene las demás como están sin borrarlas.
    await product.save() // Almacenamos esos cambios 
    res.json({data: product}) // Retornamos el producto como objeto, de esa forma va a ser el producto que se ingresó a la base de datos, que sería el que enviamos desde thunder client en el body
}

// Actualizar producto con PATCH
// La diferencia entre PATCH y PUT, es que PATCH cuándo solo editas una propiedad, ya sea name, price o la disponibilidad, solo te actualiza esa propiedad y te deja las demás como estaban, en cambio PUT si solo modificas una propiedad te reemplaza todo el objeto y solo te retorna esa propiedad y las que no actualizaste las elimina.
// Cuándo actualizamos primero se verifica que el producto exista
export const updateAvailability = async (req: Request, res: Response) => { // el req o request es lo que mandamos y el res o response lo que recibimos
    const { id } = req.params // Leemos el parámetro para identificarlo
    const product = await Product.findByPk(id)

    if(!product) { // Si no existe ese producto
        return res.status(404).json({ // El error 404 es cuándo no se encuentra un producto
            error: 'Producto no encontrado'
        })
    }
    
    // Actualizar
    product.availability = !product.dataValues.availability // Si está como true ponle false y si está como false ponle true, con esto no tenemos que especificarle ese cambio en el body del request de Thunder client, únicamente basta con darle click en send y se cambian esos valores dinámicamente de true a false.
    await product.save() // Almacenamos los cambios
    res.json({data: product})
}

// Eliminar un producto
export const deleteProduct = async (req: Request, res: Response) => { // el req o request es lo que mandamos y el res o response lo que recibimos
    const { id } = req.params // Leemos el parámetro para identificarlo
    const product = await Product.findByPk(id)

    if(!product) { // Si no existe ese producto
        return res.status(404).json({ // El error 404 es cuándo no se encuentra un producto
            error: 'Producto no encontrado'
        })
    }
    
    await product.destroy() // Utilizamos await y la instancia de ese producto y con el método destroy() lo eliminamos.
    res.json({data: 'Producto eliminado'}) // En lugar de retorna el producto como hacíamos con los otros request, se retorna el mensaje de Producto eliminado
}