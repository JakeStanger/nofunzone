import React from 'react';
import styles from './PostCard.module.scss';
import IPostCardProps from './IPostCardProps';
import Link from 'next/link';
import AuthorCard from '../authorCard/AuthorCard';

const PostCard: React.FC<IPostCardProps> = ({ post }) => {
  const type = post.tableData.find((data) => data.key.toLowerCase() === 'type');
  const difficulty = post.tableData.find(
    (data) => data.key.toLowerCase() === 'difficulty'
  );
  const time = post.tableData.find((data) => data.key.toLowerCase() === 'time');
  const cuisine = post.tableData.find(
    (data) => data.key.toLowerCase() === 'cuisine'
  );

  return (
    <div className={styles.postCard}>
      <div className={styles.img}>
        <Link href={`/cooking/posts/${post.id}`}>
          <a href={`/cooking/posts/${post.id}`}>
            <img src={post.imageUrl} alt={post.title} />
          </a>
        </Link>
      </div>
      <div className={styles.content}>
        <div className={styles.title}>
          <Link href={`/cooking/posts/${post.id}`}>
            <a href={`/cooking/posts/${post.id}`}>{post.title}</a>
          </Link>
        </div>
        <div className={styles.info}>
          {type && <div>Type: {type.value}</div>}
          {difficulty && <div>Difficulty: {difficulty.value}</div>}
          {time && <div>Time: {time.value}</div>}
          {cuisine && <div>Cuisine: {cuisine.value}</div>}
        </div>
      </div>
      <div>
        <AuthorCard author={post.author} timestamp={post.timestamp} />
      </div>
    </div>
  );
};

export default PostCard;
