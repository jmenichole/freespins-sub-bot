const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const vettedCasinos = require('./vettedCasinos.json');

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

// Handle interactions
client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ Error executing command.', ephemeral: true });
    }
  }

  if (interaction.isButton()) {
    const [action, casino, userId] = interaction.customId.split('_');
    const announceChannel = interaction.guild.channels.cache.get(process.env.ANNOUNCE_CHANNEL);
    const freespinsRoleId = '1378603138172321862'; // Replace with your actual role ID

    if (!announceChannel) {
      return interaction.reply({ content: '⚠️ Announcement channel not found.', ephemeral: true });
    }

    if (action === 'approve') {
      const originalMsg = interaction.message.content;
      await announceChannel.send({
        content: `🎰 <@&${freespinsRoleId}> **${casino.toUpperCase()} Free Spins!**
🔗 Extracted from mod approval.
${originalMsg}`,
        allowedMentions: { roles: [freespinsRoleId] }
      });
      await interaction.update({ content: `✅ Approved by <@${interaction.user.id}>`, components: [] });
    }

    if (action === 'reject') {
      await interaction.update({ content: `❌ Rejected by <@${interaction.user.id}>`, components: [] });
    }
  }
});

client.once('ready', () => {
  console.log(`Bot ready as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
