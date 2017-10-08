const log_file = fs.createWriteStream(__dirname + '/console.log', {flags : 'w'});
const log_stdout = process.stdout;


fileLog = function(d) { 
    log_file.write('['+Date()+']'+util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};

parseBody = function(text){
    return JSON.parse(Object.keys(text)[0])
}

export default {fileLog, parseBody}