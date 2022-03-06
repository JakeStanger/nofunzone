import IMessage from '../schema/IMessage';
import IPost, { ITableData } from '../schema/IPost';
import getPostImage from './getPostImage';
import cleanString from './cleanString';
import { startCase } from 'lodash';
import getMessageByAuthorId from './getMessageByAuthorId';
import remark from 'remark';
import html from 'remark-html';

async function getPostFromMessage(message: IMessage): Promise<IPost> {
  const author = await getMessageByAuthorId(message.id);
  const image = await getPostImage(message, author);

  const lines = message.content.split('\n').map((line) => line.trim());

  let title: string;
  while (!title && lines.length) {
    const line = lines.shift();
    if (!/^<(.*)>$/.test(line)) {
      title = startCase(cleanString(line));
    }
  }

  const tableData: ITableData[] = [];
  const bodyLines: string[] = [];

  lines.forEach((line) => {
    const meta = /^([^:]+): ?(.+)$/.exec(line);
    if (meta && !line.startsWith('http')) {
      tableData.push({
        key: startCase(cleanString(meta[1])),
        value: cleanString(meta[2]),
      });
    } else if(/(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*))/.test(line)) {
      bodyLines.push(`<${line}>`)
    } else {
      bodyLines.push(line);
    }
  });

  const body = await remark()
    .use(html)
    .process(bodyLines.join('\n\n'))
    .then((processed) => processed.toString());

  return {
    id: message.id,
    title,
    author,
    imageUrl: image,
    timestamp: message.timestamp,
    body,
    tableData,
  };
}

export default getPostFromMessage;
