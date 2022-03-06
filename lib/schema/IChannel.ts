interface IChannel {
  id: string;
  name: string;
  type: string;
  messages: { count: number };
}

export default IChannel;