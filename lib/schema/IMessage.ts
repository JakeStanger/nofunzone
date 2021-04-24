interface IMessage {
  id: string;
  authorId: string;
  channelId: string;
  guildId: string;
  content: string;
  attachments: string[];
  timestamp: Date;
}

export default IMessage;