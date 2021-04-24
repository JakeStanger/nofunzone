import IMessage from '../schema/IMessage';
import Discord from '../clients/discord';
import { IAuthor } from '../schema/IPost';

async function getPostAuthor(message: IMessage): Promise<IAuthor> {
  const client = await Discord.getClient();
  const author = await client.users.fetch(message.authorId);

  return {
    nickname: author.username,
    avatarUrl: author.displayAvatarURL()
  }
}

export default getPostAuthor;