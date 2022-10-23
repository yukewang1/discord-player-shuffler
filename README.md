# Discord Player Shuffler Bot

## Background

Often times a game such as CS:GO has a max queue size of 5, but more than 5 players are in the channel trying to play! 
It lacks an easy way to fairly and quickly select the 5 players and the observers who watch the stream.

Introducing this player shuffler: no more need to decline out of modesty! 

The bot maintains a queue of players trying to play a game.
- The players can either join by themselves, or ask a friend to add them to the queue.
- Once all players have joined, an arbitrary player can start the shuffling process, and the bot will select the n-player stack.
- The left-over players will be prompted as `go and watch the stream! :)`.

**This legacy toy project is no longer actively maintained.**

## The "How"
### To Add the Bot to Your Server

Follow this *discordapp.com* [link](https://discordapp.com/oauth2/authorize?client_id=712455092753661952&scope=bot).

### To Issue Commands to the Bot

Make sure the bot is added to the server and online.
Use the following commands to manipulate.

- Use `"!roll join"` to join the queue for yourself.
- Use `"!roll exit"` to exit the queue for yourself.
- Use `"!roll kick @player1 [@player2]"` to kick at least one player from the queue.
- Use `"!roll add @player1 [@player2]"` to add at least one player to the queue.
- Use `"!roll start partySize"` to start shuffling.
- Use `"!roll displayQueue"` to display the current queue.
- Use `"!roll clearQueue"` to clear the queue.

## Side Note on the Shuffling Algorithm

The bot uses the Fisher-Yates shuffle algorithm. 
Read more here on [Wikipedia](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle).
This algorithm completes in `O(N)` time.

Shuffling an array by switching an element with an arbitrary element in the queue (including itself) is a biased algorithm. 

Why?
Read more [here](https://spin.atomicobject.com/2014/08/11/fisher-yates-shuffle-randomization-algorithm/).

To fix this issue, the randomized index is generated like this `randomIndex = Math.floor(Math.random() * i);`.
Note the `i` is the index of the current element that's being worked on, not the length of the array.
## Example Usage

The below script was to demonstrate the standard shuffle situation and was pulled from an actual server.

- playerA: `!roll join`
- player-shuffler: 
```
@playerA joined the queue.
1 player currently in the queue: @playerA
```
- playerB: `!roll join`
- player-shuffler bot:
```
@playerB joined the queue.
2 players currently in the queue: @playerA,@playerB
```
- playerC: `!roll join`
- player-shuffler bot: 
```
@playerC joined the queue.
3 players currently in the queue: @playerA,@playerB,@playerC
```
- playerD: `!roll join`
- player-shuffler bot:
```
@playerD joined the queue.
4 players currently in the queue: @playerA,@playerB,@playerC,@playerD
```
- playerA: `!roll start 3`
- player-shuffler bot:
```
@playerC: go and watch the stream! :)
Team #1: @playerB,@playerD,@playerA.
```
