const { SlashCommandBuilder } = require('discord.js');
const vettedCasinos = require('../vettedCasinos.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('submitspin')
    .setDescription('Submit a free spins link')
    .addStringOption(option =>
      option.setName('casino_name')
        .setDescription('Casino name')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('link')
        .setDescription('Free spins link')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Optional description')
        .setRequired(false)),

  async execute(interaction) {
    const casino = interaction.options.getString('casino_name').toLowerCase();
    const link = interaction.options.getString('link');
    const description = interaction.options.getString('description') || '';

    const freespinsRoleId = '1378603138172321862'; // Replace with actual role ID

    if (/ref|aff|code|partner/i.test(link) && casino !== 'seal') {
      return interaction.reply({ content: '❌ Referral links are not allowed unless from Seal.', ephemeral: true });
    }

    if (vettedCasinos[casino]?.allowed) {
      const announceChannel = interaction.guild.channels.cache.find(c => c.name === process.env.ANNOUNCE_CHANNEL);
      if (announceChannel) {
        announceChannel.send({
          content: `🎰 <@&${freespinsRoleId}> **${casino.toUpperCase()} Free Spins!**
${description}
🔗 ${link}`,
          allowedMentions: { roles: [freespinsRoleId] }
        });
        await interaction.reply({ content: '✅ Submitted to announcements!', ephemeral: true });
      } else {
        await interaction.reply({ content: '⚠️ Announcement channel not found.', ephemeral: true });
      }
    } else {
      const modChannel = interaction.guild.channels.cache.find(c => c.name === process.env.MOD_CHANNEL);
      if (modChannel) {
        modChannel.send(`🚨 New unvetted free spins submission by <@${interaction.user.id}>:
Casino: **${casino}**
${description}
🔗 ${link}`);
        await interaction.reply({ content: '🕵️ Sent for moderator approval.', ephemeral: true });
      } else {
        await interaction.reply({ content: '⚠️ Mod channel not found.', ephemeral: true });
      }
    }
  }
};
