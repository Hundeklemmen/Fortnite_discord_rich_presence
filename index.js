const { Client } = require('discord-rpc'),
    fs = require('fs'),
    readline = require('readline'),
    stream = require('stream');


const rpc = new Client({ transport: "ipc" }),
    appClient = "413414231187390466";
    
var lastidk = "";

async function updatediscord() {
    console.log("Checking..")
    var instream = fs.createReadStream(process.env.LOCALAPPDATA+"/FortniteGame/Saved/Logs/FortniteGame.log");
    var outstream = new stream;
    var rl = readline.createInterface(instream, outstream);
    rl.on('line', function(line) {
        // process line here
        i++;
        var id = "["+i+"] ";
        line = line.replace("[", "")
        var split = line.split("]");
        var command = split[2]+"";
        var ctype = command.split(": ");
        var type = ctype[0];
        if(type=="LogExit"){
            lastidk = "";
        } else if(type=="LogOnline"){
            var split = line.split(" ");
            var split2 = command.split(" ");
            if(split[3]=="FOnlinePresenceMcp::OnXmppPresenceReceived"){
                if(split[7]){
                    var total = "";
                    for (var i = 7; i < split.length; i++) {
                   // console.log(split[7]+split[8])
                       total = total+split[i];
    
                    }
                    lastidk = total;
                }
            }
        
        }
    });
    if(lastidk != ""){
        var obj = JSON.parse(lastidk);
        console.log(obj)
        if(obj[0].bIsPlaying==true){
            if(obj[0].Status+"".includes("-")){
                var split = obj[0].Status.split("-");
                var alive = split[1];
                alive = alive.replace("Alive", "");
                rpc.setActivity({
                    details: `Battle Royale`,
                    state: `Ingame - ${alive} Alive`,
                    largeImageKey: 'battle_royale',
                    smallImageKey: 'logo',
                    largeImageText: `Battle Royale`,
                    smallImageText: `Fortnite`,
                    instance: false,
                });
            }
        } else {
            rpc.setActivity({
                details: `Battle Royale`,
                state: `Main Menu`,
                largeImageKey: 'battle_royale',
                smallImageKey: 'logo',
                largeImageText: `Battle Royale`,
                smallImageText: `Fortnite`,
                instance: false,
            });
        }
    } else {

    }
    lastidk = "";
}

rpc.on('ready', () => {
    console.log(`Connected to Discord! (${appClient})`);
    global.intloop = setInterval(updatediscord, 1500);
});

rpc.login(appClient).catch(console.log("Discord error"));