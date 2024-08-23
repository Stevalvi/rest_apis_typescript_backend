import { Table, Column, Model, DataType, Default } from 'sequelize-typescript' // Se instala con npm i sequelize-typescript, importamos nuestros decoradores ya sea para generar una tabla, columnas, etc

// Los modelos son los que interactúan con los datos de nuestra aplicación, en este caso, es lo que va a interactuar con nuestra base de datos. Siempre está sincroniado con las columnas de la base de datos.

// Los decoradores usualmente inician con @ y lo que hacen es mandan a llamar una función, es agregar una función dentro de otra función o de un código, que no modifica el código existente solamente habilita esas funciones.

// De esta forma definimos nuestras columnas de la base de datos y se irán creando en la base de datos, pero hay que definir este modelo en db.ts.

@Table({
    tableName: 'products' // Nombre de la tabla
})

class Product extends Model { // Ese Model es una clase que podemos heredar y en esa clase reescribir y definir nuestros modelos. Con eso heredamos las funcionalidades de ese modelo. En el modelo vamos a definir los atributos que va a tener este producto
    @Column({ // Vamos a tener una columna con el nombre del producto
        type: DataType.STRING(100)  // Tipo de dato y la extensión de las columnas en nuestra base de datos, es decir, máximo 100 caracteres.
    })
    declare name: string // Nombramos esa columna como name y su tipo de dato es string

    @Column({
        type: DataType.FLOAT // Los floats son para números enteros o decimales, entonces el 6 es la extensión de números enteros, osea máximo 6 y 2 es la de los decimales, máximos dos decimales. Para saber que tipo de dato se puede usar para postgresSQL nos dirigimos a la página oficial de sequelize en models/tables data types aparece los tipos de datos que se pueden usar 
    })
    declare price: number // El precio

    @Default(true) // Es el que va a estar presente cuándo no le pasemos ningún valor, default es para nosotros agregarle un valor que no esté presente una vez que enviemos el request, de esta forma no necesito pasarlo en el request, osea en el body de thunder client, sinó que va a tomarlo aquí, y es para que esos productos aparezcan como disponibles.
    @Column({
        type: DataType.BOOLEAN
    })
    declare availability: boolean // Creamos la columna para la disponibilidad del producto
}

export default Product
