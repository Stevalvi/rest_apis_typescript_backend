import colors from 'colors' // Se instala npm i
import server from './server'

// Va a ser nuestro archivo principal

// Dependencias que se instalaron en el package.json:
// npm i -D typescript ts-node, con ese código instalamos un intérprete para que nodejs pueda recibir archivos de typescript e identifique ese código. typescript para añadir el soporte hacia el lenguaje y ts-node es la versión para typescript. Y algo que se hizo para ver si se conectaban otros archivos con código de typescript a este index.ts fué colocar en la terminal npx ts-node src/index.ts.

// Instalamos nodemon npm i -D nodemon, para que se actualice y reinicie la aplicación siempre que se guarden los cambios y se coloca --exec que significa execution, de esa forma nos evitamos estar ejecutando cierto código para reflejar los cambios. El código queda así: "dev": "nodemon --exec ts-node src/index.ts" se ejecuta npm run dev y de esa forma la aplicación se actualiza siempre que hayan cambios.

const port = process.env.PORT || 4000 // Asignamos el puerto de nuestra variable PORT que por defecto la asigna nuestro servidor, dado el caso de que no se conecte con ese puerto por colocamos el puerto 4000.

server.listen(port, () => { // Mandamos a llamar el servidor de express con listen y le pasamos un puerto
    console.log( colors.cyan.bold( `REST API en el puerto ${port}`)) // Es un color llamado cyan y lo colocamos en negrita
})