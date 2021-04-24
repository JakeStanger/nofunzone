import React from 'react';
import styles from './[id].module.scss';
import Layout from '../../components/layout/Layout';
import { GetStaticPaths, GetStaticProps } from 'next';
import Postgres from '../../lib/clients/postgres';
import IMessage from '../../lib/schema/IMessage';
import IPost from '../../lib/schema/IPost';
import getPostFromMessage from '../../lib/utils/getPostFromMessage';
import Link from 'next/link';
import formatDate from '../../lib/utils/formatDate';
import AuthorCard from '../../components/authorCard/AuthorCard';

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
  const client = await Postgres.getClient();
  const messages: IMessage[] = await client
    .query(
      `SELECT id from "Message" WHERE "channelId" = '831107719473135627' ORDER BY timestamp desc`
    )
    .then((r) => r.rows);

  const paths = messages.map((m) => ({ params: { id: m.id } }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const client = await Postgres.getClient();
  const message: IMessage = await client
    .query(`SELECT * from "Message" WHERE "id" = '${params.id}'`)
    .then((r) => r.rows[0]);

  const post = await getPostFromMessage(message);

  return {
    props: { post },
    revalidate: 60,
  };
};
