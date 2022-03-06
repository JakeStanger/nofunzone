interface IMessage {
  id: string;
  channelId: string;
  guildId: string;
  authorId: string;
  timestamp: string;
  updatedAt: string;
  createdAt: string;
  content: string;
  attachments: string[];
}

export default IMessage;