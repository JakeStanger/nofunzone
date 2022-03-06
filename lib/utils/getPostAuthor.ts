import IMessage from '../schema/IMessage';
import { IAuthor } from '../schema/IPost';
import disco from '../clients/disco';

async function getPostAuthor(message: IMessage): Promise<IAuthor> {
  const author = await disco.guilds
    .getById(process.env.GUILD_ID)
    .members.getById(message.authorId)
    .get()
    .then((r) => r.data);

  return {
    nickname: author.username,
    avatarUrl: author.avatarUrl,
  };
}

export default getPostAuthor;
