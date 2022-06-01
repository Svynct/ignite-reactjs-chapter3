/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';

import Posts from '../components/Posts';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  function handleNextPage(): void {
    if (!nextPage) {
      return;
    }

    fetch(postsPagination.next_page)
      .then(result => result.json())
      .then(json => {
        const nextPosts = json.results.map(p => {
          return {
            uid: p.uid,
            first_publication_date: p.first_publication_date,
            data: {
              title: p.data.title,
              subtitle: p.data.subtitle,
              author: p.data.author,
            },
          };
        });
        setPosts(prevPosts => [...prevPosts, ...nextPosts]);
        setNextPage(json.next_page);
      })
      .catch();
  }

  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>

      <div className={styles.pageContainer}>
        <Posts posts={posts} />
        {nextPage && (
          <div className={`${commonStyles.container} ${styles.morePosts}`}>
            <span onClick={handleNextPage}>Carregar mais posts</span>
          </div>
        )}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {
    pageSize: 5,
  });

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title as string,
        subtitle: post.data.subtitle as string,
        author: post.data.author as string,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      },
    },
    redirect: 60 * 30, // 30 minutos
  };
};
