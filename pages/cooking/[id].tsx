import React from 'react';
import styles from './[id].module.scss';
import Layout from '../../components/layout/Layout';
import { GetStaticPaths, GetStaticProps } from 'next';
import IMessage from '../../lib/schema/IMessage';
import IPost from '../../lib/schema/IPost';
import getPostFromMessage from '../../lib/utils/getPostFromMessage';
import Link from 'next/link';
import formatDate from '../../lib/utils/formatDate';
import AuthorCard from '../../components/authorCard/AuthorCard';
import disco from '../../lib/clients/disco';

interface Props {
  post: IPost;
}

const Post: React.FC<Props> = ({ post }) => {
  // console.log(post);

  return (
    <Layout
      title={post.title + ' | Cooking'}
      imageUrl={post.imageUrl}
      description={`Recipe posted by @${post.author.nickname}`}
    >
      <Link href={'/cooking'}>
        <a>Back</a>
      </Link>
      <div className={styles.header}>
        <div className={styles.title}>{post.title}</div>
        <AuthorCard author={post.author} timestamp={post.timestamp} />
      </div>
      {!!post.tableData.length && (
        <div className={styles.table}>
          {post.tableData.map((row, i) => (
            <React.Fragment key={i}>
              <div className={styles.cell}>{row.key}</div>
              <div className={styles.cell}>{row.value}</div>
            </React.Fragment>
          ))}
        </div>
      )}
      <div
        className={styles.body}
        dangerouslySetInnerHTML={{ __html: post.body }}
      />
      <div className={styles.img}>
        <img src={post.imageUrl} />
      </div>
    </Layout>
  );
};

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  const COOKING_CHANNEL_ID = '831107719473135627';

  const messages = await disco.guilds
    .getById(process.env.GUILD_ID)
    .channels.getById(COOKING_CHANNEL_ID)
    .messages.get()
    .then((msg) => msg.data.filter((m) => m.content.length > 0));

  const paths = messages.map((m) => ({ params: { id: m.id } }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const COOKING_CHANNEL_ID = '831107719473135627';

  const message = await disco.guilds
    .getById(process.env.GUILD_ID)
    .channels.getById(COOKING_CHANNEL_ID)
    .messages.getById(params.id as string)
    .get();

  const post = await getPostFromMessage(message.data);

  return {
    props: { post },
    revalidate: 10,
  };
};
