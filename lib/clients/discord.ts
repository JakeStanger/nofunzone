import { Client } from 'discord.js';

class Discord {
  private static client: Client;

  public static async getClient() {
    if (!Discord.client) {
      this.client = new Client();
      await this.client.login(process.env.DISCORD_TOKEN);
    }

    return Discord.client;
  }
}

export default Discord;
