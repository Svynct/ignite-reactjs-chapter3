import Link from 'next/link';
import Info from '../Info';

import commonStyles from '../../styles/common.module.scss';
import styles from './posts.module.scss';
import { formatDate } from '../../utils/date';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps): JSX.Element {
  return (
    <>
      {posts &&
        posts.map(post => (
          <div
            className={`${commonStyles.container} ${styles.postsContainer}`}
            key={post.uid}
          >
            <Link href={`/post/${post.uid}`}>
              <a>
                <h2>{post.data.title}</h2>
              </a>
            </Link>
            <p>{post.data.subtitle}</p>
            <Info
              author={post.data.author}
              time={formatDate(post.first_publication_date)}
            />
          </div>
        ))}
    </>
  );
}
