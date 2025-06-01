const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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

    const freespinsRoleId = '1378603138172321862'; // Replace with your actual role ID
    const announceChannel = interaction.guild.channels.cache.get(process.env.ANNOUNCE_CHANNEL);
    const modChannel = interaction.guild.channels.cache.get(process.env.MOD_CHANNEL);

    if (/ref|aff|code|partner/i.test(link) && casino !== 'seal') {
      return interaction.reply({ content: '❌ Referral links are not allowed unless from Seal.', ephemeral: true });
    }

    if (vettedCasinos[casino]?.allowed) {
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
      if (modChannel) {
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`approve_${casino}_${interaction.user.id}`)
            .setLabel('✅ Approve')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId(`reject_${casino}_${interaction.user.id}`)
            .setLabel('❌ Reject')
            .setStyle(ButtonStyle.Danger)
        );

        modChannel.send({
          content: `🚨 New unvetted free spins submission by <@${interaction.user.id}>:
Casino: **${casino}**
${description}
🔗 ${link}`,
          components: [row]
        });

        await interaction.reply({ content: '🕵️ Sent for moderator approval.', ephemeral: true });
      } else {
        await interaction.reply({ content: '⚠️ Mod channel not found.', ephemeral: true });
      }
    }
  }
};
