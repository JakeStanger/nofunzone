import { Client } from 'pg';

class Postgres {
  private static client: Client;

  public static async getClient() {
    if (!Postgres.client) {
      this.client = new Client();
      await this.client.connect();
    }

    return Postgres.client;
  }
}

export default Postgres;
