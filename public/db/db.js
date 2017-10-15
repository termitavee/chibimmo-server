//objetos para insertar en base de datos
const database = null;
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/chibimmo';

//insert, remove, rename, save, update, distinct, count, drop, findAndModify, findAndRemove, find, findOne, stats
//LogIn action
const checkUser = (userName)=>{

    MongoClient.connect(url, function(err, db) {
        db.collection('User').findOne({"nick":userName}).then((found)=>{
            console.log('found')
            console.log(found)
            if(found!==null)
            return true
            return false
        })
        
    });


}

const checkPass = (userName, pass)=>{

    let valid=false
    MongoClient.connect(url, function(err, db) {
        db.collection('User').findOne({"nick":userName}).then((found)=>{
            if(found!==null && found.pass==pass)
            valid = true
        })
        
        db.close();
        
    });
    console.log('valid pass for  '+ userName+'? '+ valid)
    //return valid
    return false
}

const checkToken = (user, token)=>{
    let quantity=0
    MongoClient.connect(url, function(err, db) {
        const users = db.collection('User')
        const found = users.find({nick: user, token})
        quantity = found.count()
        console.log("check user "+userName+" token "+token+", found "+quantity)
        console.log(found)
        console.log('err')
        console.log(err)
    });
    
    return quantity=0? false:true;
}

//user-related queries
const addUser = (nick, pass, email, currentDate, token)=>{
    //create user
    
    MongoClient.connect(url, function(err, db) {
        db.collection('User').insert({"nick": nick, "pass": pass,"token": {}, "email" : email, "characters": [],"started": currentDate ,"login": currentDate, "friendList": []})
        
    });
    
}

const getFullUser = (user)=>{
    //get all user 
    let userFound=0
    //TODO why userFound is 0??
    MongoClient.connect(url, function(err, db) {
        console.log(db)
        userFound = db.collection('User').find({nick: user})
    });
    
    return userFound
}

const updateToken = (user, device, token)=>{
    
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

module.exports = {checkUser,checkPass,checkToken,addUser, getFullUser, updateToken}

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
