module.exports = {
    name: 'messageCreate',
    execute(message) {
        if (message.author.bot || message.channel.id !== '869517460896907334') return
        message.react('⏳')
    }
}