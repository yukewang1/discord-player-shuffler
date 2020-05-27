const Discord = require('discord.js');
const client = new Discord.Client();

let players = [];
let partySize = 0;


function clearQueue() {
    players = [];
    partySize = 0;
}


function shuffle(inArray) {
    let i = inArray.length, temp, randomIndex;

    while (i != 0) {
      randomIndex = Math.floor(Math.random() * i);
      i -= 1;

      temp = inArray[i];
      inArray[i] = inArray[randomIndex];
      inArray[randomIndex] = temp;
    }

    return inArray;
}


function rollTheDice(n, ch) {
    shuffle(players);
    const teamList = [];

    while (players.length >= n) {
        const tempPlayers = players.slice(0, n);
        players.splice(0, n);
        teamList.push(tempPlayers);
    }

    while (players.length > 0) {
        ch.send(`${players[0]}: 爬!`);
        players.splice(0, 1);
    }

    for (let i = 0; i < teamList.length; i++) {
        ch.send(`Team #${i + 1}: ${teamList[i]}.`);
    }
}


function displayQueue(ch) {
    if (players.length > 1) {
        ch.send(`${players.length} players currently in the queue: ${players}`);
    }
    else if (players.length == 1) {
        ch.send(`1 player currently in the queue: ${players}`);
    }
    else {
        ch.send('No one is currently in the queue.');
    }
}


function joinQueue(person, ch, multi) {
    if (!players.includes(person)) {
        players.push(person);

        if (multi) {
            ch.send(`${person} has been added to the queue.`);
        }
        else {
            ch.send(`${person} joined the queue.`);
        }
    }
    else {
        ch.send(`${person} is already in queue.`);
    }
}


client.on('ready', () => {
    console.log('Bot connected!');
});


client.on('message', message => {
    const commandList = message.content.split(' ');

    if ((commandList.length > 1) && (commandList[0] == '!roll')) {
        switch (commandList[1]) {
            case 'hello': {
                message.channel.send('Hello!');
                break;
            }

            case 'join': {
                joinQueue(message.author, message.channel, false);
                displayQueue(message.channel);
                break;
            }

            case 'exit': {
                if (players.includes(message.author)) {
                    players.splice(players.indexOf(message.author), 1);
                    message.channel.send(`${message.author} has exited the queue.`);

                    displayQueue(message.channel);
                }
                else {
                    message.channel.send(`${message.author} is not in queue.`);
                }
                break;
            }

            case 'kick': {
                if (commandList.length > 2 && message.mentions.members.size > 0) {
                    for (const n of message.mentions.members.values()) {
                        if (players.includes(n.user)) {
                            players.splice(players.indexOf(n.user), 1);
                            message.channel.send(`${n.user}: 爬!`);
                        }
                        else {
                            message.channel.send(`${n.user} is not in the queue.`);
                        }
                    }

                    displayQueue(message.channel);
                    break;
                }
                else {
                    message.channel.send('Invalid *kick* command: to kick players from the quee, use *"!roll kick @player1 [@player2]"*.');
                    break;
                }
            }

            case 'add': {
                if (commandList.length > 2 && message.mentions.members.size > 0) {
                    for (const n of message.mentions.members.values()) {
                        // console.log(n.user);
                        joinQueue(n.user, message.channel, true);
                    }

                    displayQueue(message.channel);
                    break;
                }
                else {
                    message.channel.send('Invalid *add* command: to add players to the quee, use *"!roll add @player1 [@player2]"*.');
                    break;
                }
            }

            case 'start': {
                if (commandList.length > 2) {
                    const temp = parseInt(commandList[2]);
                    if (!isNaN(temp) && temp > 0) {
                        partySize = temp;
                    }
                    else {
                        message.channel.send('Invalid *party size*: pass in an integer greater than 0.');
                        break;
                    }
                }
                else {
                    message.channel.send('Invalid *start* command: to start a game, pass in party size.');
                    break;
                }

                if (players.length >= partySize) {
                    // Can start game
                    rollTheDice(partySize, message.channel);
                    clearQueue();
                }
                else {
                    message.channel.send('Not enough players have joined the queue.');
                    displayQueue(message.channel);
                }

                break;
            }

            case 'clearQueue': {
                clearQueue();
                message.channel.send('The queue is cleared.');
                break;
            }

            case 'displayQueue': {
                displayQueue(message.channel);
                break;
            }

            case 'help': {
                const helpInfo = new Discord.MessageEmbed()
                    .setTitle('Available Commands')
                    .setDescription('Use *"!roll join"* to join the queue.\n\
                        Use *"!roll exit"* to exit the queue.\n\
                        Use *"!roll kick @player1 [@player2]"* to kick players from the queue.\n\
                        Use *"!roll add @player1 [@player2]"* to add players to the queue.\n\
                        Use *"!roll start partySize"* to start shuffling.\n\
                        Use *"!roll displayQueue"* to display the current queue.\n\
                        Use *"!roll clearQueue"* to clear the queue.');
                message.channel.send(helpInfo);

                break;
            }

            default: {
                message.channel.send('Invalid !roll command. Use *!roll help* to display available commands.');
                break;
            }
       }
    }

});

client.login(process.env.BOT_TOKEN);