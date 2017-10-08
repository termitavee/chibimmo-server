const socketio = require('socket.io')
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser');
//const https = require('https')
var fs = require('fs');
var util = require('util');

import {fileLog, parseBody} from 'public/utils';
import{checkUser,checkPass,checkToken,addUser, getFullUser} from 'public/db/db'

const app = express()
const server = http.Server(app)

const ioGame = socketio(server,{
	path: '/game',
	serveClient: true,
}).listen(server);

//TODO implement namespaces for private chat
const ioChat = socketio(server,{
	path: '/chat',
	serveClient: true,
}).listen(server);

//TODO comprobar extructura en la web de socket.io
//TODO usar raiz y otras rutas para login y otras funciones en app


//io.listen(app.listen(process.env.PORT || 1337));

//TODO definir variables globales necesarias

//definir ruta por defecto
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
app.use(bodyParser.text());

app.get('/', function(req, res){
	//info? no se, ya veré (redirigir a tumblr?)
	res.send("hey")
	
});

app.get('/login', function(req, res){
	
	const {user, pass, token} = parseBody(req.body)
	/**mobile access */
	if(token!=null && checkToken(token)){		
		//TODO update token
		res.send({status: "success", user: getFullUser(user)})
		
	}
	
	if(!valid && checkUser(user)){
		checkPass(user,pass)
		? res.send({status: "success", user: getFullUser(user)})
		: res.send({status: "fairule", error: "password"})
	}
	res.send({status: "fairule", error: "user"})
	
});

app.post('/signup', function(req, res){
	//crear usuario
	const {user, pass, email} = parseBody(req.body)
	//comprobar si existe usuario
	if(checkUser(user)){
		//TODO error existe
	}else{
		//comprobar si existe email
		
		//comprobar seguridad de la contraseña
		addUser(user, pass, email, new Date())
		//TODO success
	}
	
	
	//si algo anterior falla, parar y enviar respuesta
	
	//si todo correcto enviar verificación por email
});

app.get('/create', function(req, res){
	//crear personaje
	
});

app.get('/delete', function(req, res){
	//borrar personaje
	
});

app.get('/enter', function(req, res){
	//pasa del launcher al juego (redireccionar a /game?) 
	//tomar hora
	
});

ioGame.on('connection', function(cocket){
	
	console.log("ioGame connection")
	
	socket.on('mensaje',function(mensaje){
		console.log('nuevo mensaje de "'+ socket.username +'": "'+ mensaje+'"');
		//io.emit('chat', mensaje);
		socket.broadcast.emit('mensaje', {"mensaje": socket.username+ " ha dicho: "+mensaje});
	});
	
	//toda la mecanica de comunicación del juego
	
})

ioChat.on('connection', function(cocket){
	console.log("iochat connection")
	
})

server.listen(3000);