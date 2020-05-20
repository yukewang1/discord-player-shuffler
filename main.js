const Discord = require('discord.js');
const client = new Discord.Client();

// .joinQueue
// .exitQueue
// .startGame [partySize]
// .clearQueue

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
    // Index from 1
    let team = 1;

    while (players.length > n) {
        let tempPlayers = players.slice(0, n);
        players.splice(0, n);

        ch.send('Team #${team}: ${tempPlayers}.');
        team += 1;
    }

    if (players.length > 0) {
        ch.send('Unfortunately, these players are left over: ${players}');
    }
}


client.on('ready', () => {
    console.log('Bot connected!');
});


client.on('message', message => {
    const commandList = message.split(' ');

    if (commandList.length > 1) {
        switch (commandList[1]) {
            case 'joinQueue':
                if (!players.includes(message.author)) {
                    players.push(message.author);
                    message.channel.send('${message.author} joined the queue.');
                    message.channel.send('Players currently in queue: ${players}');
                }
                else {
                    message.channel.send('${message.author} is already in queue.');
                }
                break;

            case 'exitQueue':
                if (players.includes(message.author)) {
                    players.splice(players.indexOf(message.author), 1);
                    message.channel.send('${message.author} has exited the queue.');
                    message.channel.send('Players currently in queue: ${players}');
                }
                else {
                    message.channel.send('${message.author} is not in queue.');
                }
                break;

            case 'startGame':
                if (commandList.length > 2) {
                    partySize = commandList[2];
                }

                if (players.length >= partySize) {
                    // Can start game
                    rollTheDice(partySize, message.channel);
                    clearQueue();
                }
                else {
                    message.channel.send('Not enough players have joined the queue.');
                    message.channel.send('Players currently in queue: ${players}');
                }

                break;

            case 'clearQueue':
                clearQueue();
                message.channel.send('The queue is cleared.');
                break;
       }
    }

});