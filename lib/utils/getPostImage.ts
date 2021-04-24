import IMessage from '../schema/IMessage';
import ogs from 'open-graph-scraper';
import Discord from '../clients/discord';

/**
 * Gets the cover image for a post.
 * @param message
 */
async function getPostImage(message: IMessage) {
  // get from attached image
  if(message.attachments.length) {
    return message.attachments[0];
  }

  // get from scraping attached link
  const pageUrl = /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*))/.exec(message.content)?.[0];
  if(pageUrl) {
    const url =  await ogs({url: pageUrl}).then(({result}) => result?.ogImage?.url);
    if(url) {
      return url;
    }
  }

  // fallback to avatar
  const client = await Discord.getClient();
  return await client.users.fetch(message.authorId).then(user => user.displayAvatarURL());
}

export default getPostImage;