const socketio = require('socket.io')
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser');
const crypto = require("crypto");
//const https = require('https')
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/chibimmo';

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

//res.send({action:"signup",status: "401", data: "bad header"})
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

	/*
	if(token!=null && checkToken(user, device, token)){		
		
		const token = crypto.randomBytes(10).toString('hex');
		console.log("token="+token)
		updateToken(user,device, token)
		res.send({status: "success", user: getFullUser(user)})
		
	}
	*/
    MongoClient.connect(url, function(err, db) {
        db.collection('User').findOne({"nick":user}).then((found)=>{
            console.log('found')
			console.log(found)
			//TODO check token 

            if(found!==null){
				if(found.pass==pass){
					//TODO update user last login
					res.send({action:"login",status: "202", user: found})
				}else{
					res.send({action:"login",status: "401", error: "password"})	
				}
			}else{
				res.send({action:"login",status: "401", error: "user"})
			}

        })
        
    });
	
});

app.post('/signup', function(req, res){
	//crear usuario
	try{
		const {user, pass, email} = parseBody(req.body)
		console.log("user " +user+ " pass "+pass+ " email "+email)
		//TODO modificar como en login
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
		res.send({action:"signup",status: "202", user: userData})
		
		//TODO enviar verificación por email
	}catch(e){
		console.log(e.message)
		res.send({action:"signup",status: "401", error: "bad header"})
	}
	
});

app.post('/create', function(req, res){
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