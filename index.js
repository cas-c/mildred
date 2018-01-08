const config = require('./config.json');
const tmi = require('tmi.js');
const Discord = require('discord.js');
const mildred = new Discord.Client();
mildred.login(config.discord);

mildred.once('ready', () => {
    console.log(`discord: connected as ${mildred.user.username}`);
    mildred.channels.get(config.home).send('logged into discord!');
});

const options = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: config.username,
        password: config.twitch
    },
    channels: [config.channel]
};

const client = new tmi.client(options);

// Connect the client to the server..
client.connect();

client.on('timeout', (channel, username, reason, duration) => {
    mildred.channels.get(config.home)
            .send(new Discord.RichEmbed()
                    .addField('Timeout', `${username} has been timed out.`)
                    .addField('Reason', reason !== null ? reason : 'No reason provided.')
                    .addField('Duration', `${duration} seconds`)
            );
})

client.on('ban', (channel, username, reason) => {
    mildred.channels.get(config.home)
            .send(new Discord.RichEmbed()
                    .addField('Ban', `${username} has been banned.`)
                    .addField('Reason', reason !== null ? reason : 'No reason provided.')
            );
})
client.on('logon', () => {
    //mildred.channels.get(config.home).send('logged into twitch!');
});

client.on('connected', (address, port) => {
    //mildred.channels.get(config.home).send(`connected to twitch @ ${address} ${port}`);
});

client.on('disconnected', (reason) => {
    mildred.channels.get(config.home).send(`disconnected from twitch due to: ${reason}`);
    client.connect();
})

mildred.on('message', message => {
    if (message.cleanContent.startsWith('?m test')) {
        const username = message.cleanContent.split('test')[1];
        message.channel.send(new Discord.RichEmbed()
                    .addField('Ban', `${username} has been banned.`)
                    .addField('Reason', 'Test message, not actually a real ban. ♥')
            );
    }
})

mildred.on('disconnect', event => {
    mildred.login(config.discord).then(() => {
        mildred.channels.get(config.home).send('disconnected, but reconnected now? maybe? idk');
    });
})