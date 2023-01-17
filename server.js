// import the HTTP package from Node and use it to create a server //
const http = require('http')

// import app.js //
const app = require('./app')

// normalizePort function returns a valid port, as a number or a string //
const normalizePort = val => {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        return val
    }
    if (port >= 0) {
        return port
    }
    return false
}
const port = normalizePort(process.env.PORT || '3000')

// setting the port with the express set method //
app.set('port', port)

// errorHandler function searches for the different errors and handles them appropriately //
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error
    }
    const address = server.address()
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.')
            process.exit(1)
            break
        default:
            throw error
    }
}

// create a server with the method createServer() and uses the argument app  //
const server = http.createServer(app)

server.on('error', errorHandler)
server.on('listening', () => {
    const address = server.address()
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
    console.log('Listening on ' + bind)
})

// starts the http server and listens for connections //
server.listen(port)