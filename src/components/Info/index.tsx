import styles from './info.module.scss';

interface InfoProps {
  time: string;
  author: string;
  readingTime?: string;
  textBigger?: boolean;
}

export default function Info({
  time,
  author,
  readingTime,
  textBigger,
}: InfoProps): JSX.Element {
  return (
    <div
      className={
        textBigger ? `${styles.info} ${styles.textBigger}` : styles.info
      }
    >
      <img src="/images/calendar.svg" alt="calendar" />
      <time>{time}</time>
      <img src="/images/user.svg" alt="user" />
      <span>{author}</span>
      {readingTime && (
        <>
          <img src="/images/clock.svg" alt="clock" />
          <span>{readingTime}</span>
        </>
      )}
    </div>
  );
}
