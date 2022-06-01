/* eslint-disable react/no-danger */
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { useEffect, useState } from 'react';

import Info from '../../components/Info';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import { formatDate, formatReadingTime } from '../../utils/date';
import styles from './post.module.scss';

interface Post {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();
  const [readingTime, setReadingTime] = useState('');

  useEffect(() => {
    if (!router.isFallback) {
      setReadingTime(
        formatReadingTime(
          Math.ceil(
            post?.data.content.reduce((acc, content) => {
              const body = RichText.asText(content.body);
              const words =
                content.heading?.split(/\s+/).length + body.split(/\s+/).length;
              return acc + words;
            }, 0) / 200
          )
        )
      );
    }
  }, [router.isFallback, post]);

  return router.isFallback ? (
    <h1 className={commonStyles.container}>Carregando...</h1>
  ) : (
    <>
      <Head>
        <title>Criando um app CRA do zero</title>
      </Head>
      <img
        src={post.data.banner.url}
        alt={post.data.title}
        width="100%"
        height="400px"
      />
      <main className={`${commonStyles.container} ${styles.main}`}>
        <article className={styles.info}>
          <h1>{post.data.title}</h1>
          <Info
            author={post.data.author}
            time={formatDate(post.first_publication_date)}
            readingTime={readingTime}
            textBigger
          />
          {post.data.content.map(p => (
            <div className={styles.content} key={p.heading}>
              <h2>{p.heading}</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(p.body),
                }}
              />
            </div>
          ))}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts', {
    pageSize: 10,
  });

  const slugs = posts?.results.map(post => {
    return { params: { slug: post.uid } };
  });

  return {
    paths: [...slugs],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(slug));

  const post: Post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
    },
    redirect: 60 * 30, // 30 minutos
  };
};
