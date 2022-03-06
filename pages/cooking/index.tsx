import React, { useCallback, useMemo, useState } from 'react';
import styles from './index.module.scss';
import { GetStaticProps } from 'next';
import IMessage from '../../lib/schema/IMessage';
import IPost from '../../lib/schema/IPost';
import getPostFromMessage from '../../lib/utils/getPostFromMessage';
import Layout from '../../components/layout/Layout';
import PostCard from '../../components/postCard/PostCard';
import disco from '../../lib/clients/disco';

interface Props {
  posts: IPost[];
}

const index: React.FC<Props> = ({ posts }) => {
  const [query, setQuery] = useState('');

  const onQueryChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(ev.target.value);
    },
    []
  );

  const postMatches = useCallback(
    (post: IPost) => {
      const q = query.trim().toLowerCase();

      return (
        post.title.toLowerCase().includes(q) ||
        post.author.nickname.toLowerCase().includes(q) ||
        post.body.toLowerCase().includes(q) ||
        post.tableData
          .map((t) => t.value.toLowerCase())
          .join('')
          .includes(q)
      );
    },
    [query]
  );

  const filteredPosts = useMemo(
    () => (query ? posts.filter(postMatches) : posts),
    [postMatches, query, posts]
  );

  return (
    <Layout title={'Cooking'}>
      <div className={styles.header}>
        <div className={styles.title}>No Fun Zone #cooking</div>
      </div>
      <div>
        <input
          className={styles.search}
          placeholder={'🔍 search'}
          value={query}
          onChange={onQueryChange}
        />
      </div>
      {filteredPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Layout>
  );
};

export default index;

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const COOKING_CHANNEL_ID = '831107719473135627';

  const messages = await disco.guilds
    .getById(process.env.NEXT_PUBLIC_GUILD_ID)
    .channels.getById(COOKING_CHANNEL_ID)
    .messages.get()
    .then((msg) => msg.data.filter((m) => m.content.length > 0));

  const posts: IPost[] = await Promise.all(messages.map(getPostFromMessage));

  return {
    props: {
      posts,
      revalidate: 10,
    },
  };
};
