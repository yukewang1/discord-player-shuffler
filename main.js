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
    if (players.length > 0) {
        ch.send(`Players currently in queue: ${players}`);
    }
    else {
        ch.send('No one is currently in queue.');
    }
}


client.on('ready', () => {
    console.log('Bot connected!');
});


client.on('message', message => {
    const commandList = message.content.split(' ');

    if ((commandList.length > 1) && (commandList[0] == '!roll')) {
        switch (commandList[1]) {
            case 'join':
                if (!players.includes(message.author)) {
                    players.push(message.author);
                    message.channel.send(`${message.author} joined the queue.`);
                    displayQueue(message.channel);
                }
                else {
                    message.channel.send(`${message.author} is already in queue.`);
                }
                break;

            case 'exit':
                if (players.includes(message.author)) {
                    players.splice(players.indexOf(message.author), 1);
                    message.channel.send(`${message.author} has exited the queue.`);

                    displayQueue(message.channel);
                }
                else {
                    message.channel.send(`${message.author} is not in queue.`);
                }
                break;

            case 'start':
                if (commandList.length > 2) {
                    const temp = parseInt(commandList[2]);
                    if (!isNaN(temp) && temp > 0) {
                        partySize = commandList[2];
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

            case 'clearQueue':
                clearQueue();
                message.channel.send('The queue is cleared.');
                break;

            case 'displayQueue':
                displayQueue(message.channel);
                break;

            case 'help':
                message.channel.send('Use *"!roll join"* to join the queue.');
                message.channel.send('Use *"!roll exit"* to exit the queue.');
                message.channel.send('Use *"!roll start [partySize]"* to start shuffling.');
                message.channel.send('Use *"!roll displayQueue"* to display the current queue.');
                message.channel.send('Use *"!roll clearQueue"* to clear the queue.');
                break;
       }
    }

});

client.login(process.env.BOT_TOKEN);