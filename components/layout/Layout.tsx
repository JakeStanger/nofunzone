import React from 'react';
import styles from './Layout.module.scss';
import ILayoutProps from './ILayoutProps';
import Head from 'next/head';

const Layout: React.FC<ILayoutProps> = ({ children, title, imageUrl, description }) => {
  const fullTitle = [title, 'No Fun Zone'].join(' | ');

  return (
    <div>
      <Head>
        {/* HTML meta tags */}
        <title>{fullTitle}</title>
        <meta name='description' content={description} />
        {/*<meta name='theme-color' content={meta.color} />*/}

        {/* Search engine tags */}
        <meta itemProp='name' content={fullTitle} />
        <meta itemProp='description' content={description} />
        <meta itemProp='image' content={imageUrl} />

        {/* Facebook meta tags */}
        <meta property='og:type' content='website' />
        <meta property='og:title' content={fullTitle} />
        <meta property='og:description' content={description} />
        <meta property='og:image' content={imageUrl} />

        {/* Twitter meta tags */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={fullTitle} />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:image' content={imageUrl} />
      </Head>
      <div className={styles.container}>{children}</div>
    </div>
  );
};

export default Layout;
