import styles from './Home.module.scss';
import Layout from '../components/layout/Layout';
import Link from 'next/link';

const Channel: React.FC<{ name: string, url?: string }> = ({ name, url }) => {
  url = url ?? `/${name}`;
  return (
    <div className={styles.channel}>
      <Link href={url}>
        <a href={url}>{name}</a>
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
        <Channel name={'general'} />
        <Channel name={'cooking'} />
        <Channel name={'big_pointy_stick'} url={'https://lancer.nfz.toadmytoad.com'} />
      </div>
    </Layout>
  );
}
