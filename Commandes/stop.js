
module.exports.run = async(client, message) => {
    message.delete();

    // SI L'user n'est pas un admin
    if (!message.member.roles.cache.some(r => r.name === "A")) {return message.channel.send("Vous n'avez pas la permission de faire cette commande !"); }

    let channelPerso = await message.guild.channels.cache.find (channel => channel.name === 'etat-bot');

    // Clone channel
    const channelEtat = await channelPerso.clone()
    channelEtat.send('🚫 Le BOT est `OFF` !');

    // Delete old channel
    await channelPerso.delete()

    // On déconnecte le bot
    process.exit(0);

}
module.exports.help = {
    name: 'stop',
    description: 'Stop le bot'
};
