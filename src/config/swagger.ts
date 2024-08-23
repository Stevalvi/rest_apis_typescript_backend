// Swagger es para documentar las APIS
// Instalamos las dependencias npm i swagger-jsdoc que nos permite con una sintaxis especial de un formato llamado YAML, nos va a permitir crear la documentación. Y otra dependencia es npm i swagger-ui-express que nos va a permitir tener una URL en la cuál vamos a poder tener la documentación bastante bien formateada. Al instalar esas dependencias también instalamos los @types: @types/swagger-jsdoc, @types/swagger-ui-express
// Acá es donde vamos a colocar la información general de nuestra api, como se llama, que es lo que hace, donde va a encontrar las rutas, etc.

import swaggerJSDoc from "swagger-jsdoc"
import { SwaggerUiOptions } from "swagger-ui-express"

const options : swaggerJSDoc.Options = { // Como ese options va a tener un type any, le asignamos ese type de swagger y ya se quita ese any, y aparte va a tener un buen autocompletado.
    swaggerDefinition: {
        openapi: '3.0.2', // Le decimos que vamos a usar esa versión, openapi es el que dá los lineamientos para la API REST
        tags: [
            {
                name: 'Products', // En este caso vamos a documentar los products
                description: 'API operations related to products' // Operaciones de API relacionadas a productos
            }
        ],
        info: { // Esta es la información general de nuestra api
            title: 'REST API Node.js / Express / TypeScript',
            version: "1.0.0",
            description: "API Docs for Products"
        }
    },
    apis: ['./src/router.ts'] // Es dónde va a encontrar los endpoints que queremos documentar, en este caso son los endpoints del router.ts
}

const swaggerSpec = swaggerJSDoc(options) // Creamos la variable de especificaciónes de ese swagger y le pasamos las options

// Cambiamos logotipo de Swagger
const swaggerUiOptions: SwaggerUiOptions = { // Le asignamos el type para tener el autocompletado
    customCss: `
        .topbar-wrapper .link {
            content: url('https://codigoconjuan.com/wp-content/themes/cursosjuan/img/logo.svg');
            height: 80px;
            width: auto;
        }
        .swagger-ui .topbar {
            background-color: #2b3b45;
        }

    `,
    customSiteTitle: 'Documentación REST API Express / TypeScript'
}

export default swaggerSpec // Para hacerlo disponible en otros archivos.
export {
    swaggerUiOptions
}