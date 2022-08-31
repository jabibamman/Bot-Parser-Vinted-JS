const config = require('../config.json')
const prefix = config.prefix;

module.exports = async (client) => {
    console.log(`${client.user.username} est en ligne !`);

    setInterval(function() {
        let statusstyle = [
            '🟢 Le BOT est ON !',
            `${prefix}vinted`
        ]

        let status = statusstyle[Math.floor(Math.random() * statusstyle.length)];
        client.user.setPresence({
                activities: [
                        {
                            name: status,
                            type: 'PLAYING'
                        }]
            })
    }, 10000)
};
