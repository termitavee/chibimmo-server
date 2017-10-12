const socketio = require('socket.io')
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser');
const crypto = require("crypto");
//const https = require('https')

const {fileLog, parseBody} = require('./public/utils');
const {checkUser,checkPass,checkToken,addUser, getFullUser, updateToken} = require('./public/db/db')

const PORT = 3000
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

app.post('/login', function(req, res){
	
	const {user, pass, token=null, remember=false, device=null} = parseBody(req.body)
	/**remembered user */
	if(token!=null && checkToken(user, device, token)){		
		
		const token = crypto.randomBytes(10).toString('hex');
		console.log("token="+token)
		updateToken(user,device, token)
		res.send({status: "success", user: getFullUser(user)})
		
	}

	if(checkUser(user)){
		if(checkPass(user,pass)){
			if(remember){
				const token = crypto.randomBytes(10).toString('hex');
				console.log("token="+token)
				updateToken(user,device, token)
			}
			//TODO update user last login
			res.send({status: "success", user: getFullUser(user)})
		}else
		res.send({status: "fairule", error: "password"})		
	}else
	res.send({status: "fairule", error: "user"})
	
});

app.post('/signup', function(req, res){
	//crear usuario
	try{
		const {user, pass, email} = parseBody(req.body)
		console.log("user " +user+ " pass "+pass+ " email "+email)
		
		//comprobar si existe usuario
		console.log('check user')
		if(checkUser(user)){
			console.log('User already exists')
			res.send({status: "fairule", error: "user"})
		}
		console.log('User is available')
		
		//comprobar si existe email
		console.log('check mail')
		const emailPatt = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/i;
		if(!emailPatt.test(email)){
			console.log('email not valid')
			res.send({status: "fairule", error: "email"})
		}
		console.log('email ok')
		
		//si no se inserta correctamente
		if(!addUser(user, pass, email, new Date())){
			
			console.log('not inserted properly becouse unknown reason')
			res.send({status: "fairule", error: "unknown"})
		}
		
		console.log('inserted properly')
		
		
		//si no ha fallado nada se manda los datos insertados
		const userData = getFullUser(user)
		console.log(userData)
		res.send({status: "success", user: userData})
		
		//TODO enviar verificación por email
	}catch(e){
		console.log(e.message)
		res.send({message: 'navegador?'})
	}
	
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

server.listen(PORT);
console.log('Server suposely running on port '+PORT)