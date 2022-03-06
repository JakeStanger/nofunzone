import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import IMessage from '../../lib/schema/IMessage';
import disco from '../../lib/clients/disco';
import { groupBy } from 'lodash';
import getMessageByAuthorId from '../../lib/utils/getMessageByAuthorId';
import { IAuthor } from '../../lib/schema/IPost';
import Layout from '../../components/layout/Layout';
import styles from '../cooking/index.module.scss';

interface Props {
  wordleMessages: Record<string, IMessage[]>;
  wordleAuthors: IAuthor[];
}

function getMessageWordleScore(message: IMessage): number {
  let guesses = message.content.match(/([1-6X])\/6/)[1].replace('X', '7');
  return 7 - parseInt(guesses);
}

function getAverageScore(scores: number[]) {
  return scores.reduce((acc, v, i, a) => acc + v / a.length, 0);
}

const Cell: React.FC = ({ children }) => (
  <div
    style={{
      display: 'flex',
      gap: 10,
      padding: 2,
      borderBottom: '1px solid #ddd',
    }}
  >
    {children}
  </div>
);

const General: NextPage<Props> = ({ wordleMessages, wordleAuthors }) => {
  return (
    <Layout title={'general'}>
      <div className={styles.header}>
        <div className={styles.title}>No Fun Zone #general</div>
      </div>
      <div className={styles.subHeader}>
        <div className={styles.title}>Wordle</div>
      </div>
      <div>
        <code>Score = 7 - guesses</code>. 0 points are awarded for lost games.
        Higher = better.
      </div>
      <br />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto auto auto auto auto',
          gap: 10,
        }}
      >
        <Cell />
        <Cell>
          <b>Games Played</b>
        </Cell>
        <Cell>
          <b>Average Score</b>
        </Cell>
        <Cell>
          <b>Highest Score</b>
        </Cell>
        <Cell>
          <b>Lowest Score</b>
        </Cell>
        {wordleAuthors
          .sort(
            (a, b) =>
              getAverageScore(wordleMessages[b.id].map(getMessageWordleScore)) -
              getAverageScore(wordleMessages[a.id].map(getMessageWordleScore))
          )
          .map((author, i) => {
            const scores = wordleMessages[author.id].map(getMessageWordleScore);

            return (
              <React.Fragment key={i}>
                <Cell>
                  <img
                    src={author.avatarUrl}
                    style={{
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                    }}
                  />
                  <div>{author.nickname}</div>
                </Cell>
                <Cell>{scores.length}</Cell>
                <Cell>{getAverageScore(scores).toPrecision(3)}</Cell>
                <Cell>{Math.max(...scores)}</Cell>
                <Cell>{Math.min(...scores)}</Cell>
              </React.Fragment>
            );
          })}
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const GENERAL_CHANNEL_ID = '142689001986326529';

  const messages = groupBy(
    await disco.guilds
      .getById(process.env.NEXT_PUBLIC_GUILD_ID)
      .channels.getById(GENERAL_CHANNEL_ID)
      .messages.filter('content startsWith Wordle')
      .get()
      .then((r) => r.data)
      .then((messages) =>
        messages.filter((msg) => /Wordle \d+ [1-6X]\/6\*?/.test(msg.content))
      ),
    'authorId'
  );

  const authors = await Promise.all(
    Object.keys(messages).map(getMessageByAuthorId)
  );

  return {
    props: {
      wordleMessages: messages,
      wordleAuthors: authors,
      revalidate: 10,
    },
  };
};

export default General;
