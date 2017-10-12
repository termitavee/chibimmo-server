//objetos para insertar en base de datos
const database = null;
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/chibimmo';

const open = ()=>{
    if(database==null){
        MongoClient.connect(url, function(err, db) {
            database = db;
        });
    }
}


const queries = ()=>{
    //get
    
    const elements = db.collection('documents');
    //insert, remove, rename, save, update, distinct, count, drop, findAndModify, findAndRemove, find, findOne, stats
    elements.find({}).toArray(function(err, docs) {
        console.log("Found?");
    })
    
}

//LogIn action
const checkUser = (userName)=>{
    let quantity=0
    MongoClient.connect(url, function(err, db) {
        const users = db.collection('user')
        const found = users.find({nick: userName})
        quantity = found.count()
    });
    
    return quantity=0? false:true;
}

const checkPass = (userName, pass)=>{
    let quantity=0
    MongoClient.connect(url, function(err, db) {
        const users = db.collection('user')
        const found = users.find({nick: userName, pass})
        quantity = found.count()
    });
    
    return quantity=0? false:true;
}

const checkToken = (user, token)=>{
    let quantity=0
    MongoClient.connect(url, function(err, db) {
        const users = db.collection('user')
        const found = users.find({nick: user, token})
        quantity = found.count()
    });
    
    return quantity=0? false:true;
}

//user-related queries
const addUser = (nick, pass, email, currentDate)=>{
    //create user
    
    MongoClient.connect(url, function(err, db) {
        db.collection('user').insert({"nick": nick, "pass": pass,"token": {}, "email" : email, "characters": [],"started": currentDate ,"login": currentDate, "friendList": []})
        
    });
    
}

const getFullUser = (user)=>{
    //get all user 
    let userFound=0
    
    MongoClient.connect(url, function(err, db) {
        userFound = db.collection('user').find({nick: userName})
    });
    
    return userFound
}

const updateUser = ()=>{
    
}

const deleteUser = ()=>{
    
}
//character-related queries
const AddCharacter = ()=>{
    
}

const getCharacter = ()=>{
    
}

const editCharacter = ()=>{
    
}

const deleteCharacter = ()=>{
    
}



//modelos

class User{
    constructor(nick, pass,deskToken, mobToken, email, characters, started, login, friendList) {
        this.nick = nick;//string
        this.pass = pass;//string
        this.token = token;//{id: token, id:token}
        this.email = email;//string
        this.characters = characters;//array
        this.login = login;//date
        this.friendList = friendList
    }
    
}

class Character{
    constructor(Usernick,name, type, qualities, statistics, equipment, inventory, pets, login) {
        this.Usernick = Usernick; //string
        this.name = name;//string
        this.type = type;//string soldier/mage/rogue
        this.qualities = qualities;
        /*{
            sprite color
            hair
            hair color
        }*/
        this.statistics = statistics;
        /*{
            variable
            life
            magic
            hab
            money
            fixed
            type (off, deff)
            fuerza
            resistencia
            inteligencia
            mente
            destreza
            carisma
        }*/
        this.equipment = equipment;
        /*{
            head:
            body:
            leftArm:
            rightArm:
            leftLeg:
            rightLeg:
        }*/
        this.inventory = inventory;//[]
        this.pets = pets//objet or []
        this.archivements = archivements//[]
        this.login = login;//date
    }
}

class Monster{
    constructor(level, size) {
        this.level = level;//string
        this.size = size;
    }
}

//borrar, lo almacena el cliente
class NPC{
    constructor( name, type, qualities, statistics, equipment, inventory, pets, login) {
        this._id =_id; //string
        this.name = name;//string
        this.type = type;//string seller/standar/whatever
        this.qualities = qualities;
        /*{
            sprite color
            hair
            hair color
        }*/
        this.equipment = equipment;
        /*{
            head:
            body:
            leftArm:
            rightArm:
            leftLeg:
            rightLeg:
        }*/
        this.inventory = inventory;//[]
    }
}

class Monster{
    constructor(_id, name, statistics, sprite, drop) {
        this._id =_id; //string
        this.name = name;//string
        this.statistics = statistics;
        /*{
            variable
            life
            magic
            hab
            money
            fixed
            fuerza
            resistencia
            inteligencia
            mente
            destreza
            carisma
        }*/
        this.sprite = sprite;
        this.drop = drop//[] items that the user gets
    }
}

class Pet{
    constructor(_id, name, sprite, action) {
        this._id =_id; //string
        this.name = name;//string
        this.sprite = sprite;//number
        this.action = action;//{name, endDate}
        
    }
}

class Inventory{
    constructor(items) {
        this.items = items;//[]
    }
}

class Item{
    constructor(_id, name, sprite, description, data) {
        this._id =_id;//
        this.name = name;//
        this.sprite = sprite;//
        this.description = description;//
        this.data = data;//where to equip or number of uses
    }
}

class News{
    constructor(articles) {
        this.articles = articles;//[]
    }
    
}

class article{
    constructor(_id, name, description, update, event, important) {
        this._id =_id; //string
        this.name = name;//string
        this.description = description;//string soldier/mage
        this.update = update;//boolean
        this.event = event;//boolean
        this.important = important//boolean
    }
}

class Messages{
    constructor(sender, to, message){
        this.sender = sender;//boolean
        this.to = to;//boolean
        this.message = message//boolean
    }
}
