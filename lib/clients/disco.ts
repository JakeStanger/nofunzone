import fetch from 'node-fetch';
import path from 'path';
import IChannel from '../schema/IChannel';
import IGuild from '../schema/IGuild';
import IMessage from '../schema/IMessage';
import IMember from '../schema/IMember';

type Constructor<C> = new (baseUrl: string) => C;

interface Response<T> {
  data: T;
  aggregate?: {
    count: number;
  };
}

abstract class Request<T> {
  protected baseUrl: string;
  protected params: URLSearchParams;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.params = new URLSearchParams();
  }

  public get(): Promise<Response<T>> {
    const url = `${new URL(
      this.baseUrl,
      process.env.NEXT_PUBLIC_API_URL
    )}?${this.params.toString()}`;

    return fetch(url, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
      },
    }).then((r) => r.json());
  }
}

abstract class CollectionRequest<T, C extends Request<T>> extends Request<T[]> {
  private readonly childConstructor;

  constructor(baseUrl: string, childConstructor: Constructor<C>) {
    super(baseUrl);
    this.childConstructor = childConstructor;
  }

  public getById(id: string): C {
    return new this.childConstructor(path.join(this.baseUrl, id));
  }
}

class BaseRequest extends Request<never> {
  public get guilds() {
    return new Guilds(path.join(this.baseUrl, 'guild'), Guild);
  }
}

class Guilds extends CollectionRequest<IGuild, Guild> {}

class Guild extends Request<IGuild> {
  public get channels() {
    return new Channels(path.join(this.baseUrl, 'channel'), Channel);
  }

  public get members() {
    return new Members(path.join(this.baseUrl, 'member'), Member);
  }
}

class Members extends CollectionRequest<IMember, Member> {}
class Member extends Request<IMember> {}

class Channels extends CollectionRequest<IChannel, Channel> {}

class Channel extends Request<IChannel> {
  public get messages() {
    return new Messages(path.join(this.baseUrl, 'message'), Message);
  }
}

class Messages extends CollectionRequest<IMessage, Message> {
  public top(n: number) {
    this.params.set('$top', n.toString());
    return this;
  }

  public skip(n: number) {
    this.params.set('$skip', n.toString());
    return this;
  }

  public filter(f: string) {
    this.params.set('$filter', f);
    return this;
  }
}

class Message extends Request<IMessage> {}

const disco = new BaseRequest('');
export default disco;
