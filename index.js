const socketio = require('socket.io')
const express = require('express')
const http = require('http')
//const https = require('https')

const app = express()
const server = http.Server(app)

const io = socketio(server,{
    path: '/game',
    serveClient: false,
})
//TDO comprobar extructura en la web de socket.io
//TODO usar raiz y otras rutas para login y otras funciones en app


io.listen(app.listen(process.env.PORT || 1337));
//TODO definir variables globales necesarias

//definir ruta por defecto
app.use(express.static("public"));

app.get('/', function(req, res){
	//info? no se, ya veré
	
});

app.get('/login', function(req, res){
	//iniciar sesion
	
});

app.get('/signup', function(req, res){
	//crear usuario
	
});

app.get('/create', function(req, res){
	//crear personaje
	
});

app.get('/delete', function(req, res){
	//borrar personaje
	
});

app.get('/enter', function(req, res){
	//pasa del launcher al juego (redireccionar a /game?)
	
});

io.on('connection', function(cocket){
    

    socket.on('mensaje',function(mensaje){
    	console.log('nuevo mensaje de "'+ socket.username +'": "'+ mensaje+'"');
		//io.emit('chat', mensaje);
		socket.broadcast.emit('mensaje', {"mensaje": socket.username+ " ha dicho: "+mensaje});
    });

//toda la mecanica de comunicación del juego

})

server.listen(3000);