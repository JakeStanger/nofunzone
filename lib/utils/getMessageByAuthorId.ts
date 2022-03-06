import IMessage from '../schema/IMessage';
import { IAuthor } from '../schema/IPost';
import disco from '../clients/disco';

async function getMessageByAuthorId(id: string): Promise<IAuthor> {
  const author = await disco.guilds
    .getById(process.env.NEXT_PUBLIC_GUILD_ID)
    .members.getById(id)
    .get()
    .then((r) => r.data)
    .catch(() => ({
      username: 'Unknown',
      avatarUrl:
        // green default avatar
        'https://discord.com/assets/7c8f476123d28d103efe381543274c25.png',
    }));

  return {
    id,
    nickname: author.username,
    avatarUrl: author.avatarUrl,
  };
}

export default getMessageByAuthorId;
