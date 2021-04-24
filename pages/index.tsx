import styles from './Home.module.scss';
import Layout from '../components/layout/Layout';
import Link from 'next/link';

const Channel: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div className={styles.channel}>
      <Link href={`/${name}`}>
        <a href={`/${name}`}>{name}</a>
      </Link>
    </div>
  );
};

export default function Home() {
  return (
    <Layout title={'Home'}>
      <div className={styles.header}>
        <div className={styles.title}>No Fun Zone</div>
      </div>
      <div className={styles.channels}>
        <Channel name={'cooking'} />
      </div>
    </Layout>
  );
}
