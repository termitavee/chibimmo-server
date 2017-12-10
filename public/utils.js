var fs = require('fs');
var util = require('util');

const log_file = fs.createWriteStream(__dirname + '/logs/console.log', {flags : 'w'});
const log_stdout = process.stdout;


fileLog = function(d) { 
    log_file.write('['+Date()+']'+util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};

parseBody = function(text){
    return JSON.parse(Object.keys(text)[0])
}

printIP = () =>{
    var ips = require('child_process').execSync("ifconfig | grep inet | grep -v inet6 | awk '{gsub(/addr:/,\"\");print $2}'").toString().trim().split("\n")
    return `${ips}`
}

module.exports = { fileLog, parseBody, printIP}