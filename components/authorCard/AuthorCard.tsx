import React from 'react';
import styles from './AuthorCard.module.scss';
import IAuthorCardProps from './IAuthorCardProps';
import formatDate from '../../lib/utils/formatDate';

const AuthorCard: React.FC<IAuthorCardProps> = ({ author, timestamp }) => {
  return (
    <div className={styles.authorCard}>
      <div className={styles.img}>
        <img src={author.avatarUrl} />
      </div>
      <div className={styles.text}>
        <div>@{author.nickname}</div>
        <div>{formatDate(timestamp)}</div>
      </div>
    </div>
  );
};

export default AuthorCard;
