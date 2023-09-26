import styles from './ArticleAboutAuthor.module.scss' 
import delve from 'dlv'
import { BlogImg } from 'components/common/BlogImg';

export const ArticleAboutAuthor = ({about, appeal, moreLink, moreText, firstName, lastName, picture, countryPicture, position}: any) => {

  const portrait = delve(picture, 'data.attributes', false);
  const country = delve(countryPicture, 'data.attributes', false);

  return (
      <div className={styles.ArticleAboutAuthor}>
        <div className={styles['ArticleAboutAuthor-wrapper']}>
          <div className={styles['ArticleAboutAuthor-container']}>
            <div className='text-quote-small'>
              <b>{appeal}</b> – {about}
            </div>
            <div className={styles['ArticleAboutAuthor-info']}>
              {portrait && (
                <div className={styles['ArticleAboutAuthor-infoIcon']}>
                  <BlogImg 
                    src={portrait.url}
                    width={portrait.width}
                    height={portrait.height}
                    alt={firstName}
                  />
                  {country && (
                    <BlogImg 
                      src={country.url}
                      width={country.width}
                      height={country.height}
                      alt={firstName}
                    />
                  )}
                </div>
              )}
              <div className={`${styles['ArticleAboutAuthor-infoText']} text-small`}>
                <b>{firstName} {lastName}</b>
                {position}
              </div>
            </div>
            {moreLink && <a className='btn-blue' href={moreLink} target='_blank' rel='noreferrer'>{moreText}</a>}
          </div>
        </div>
      </div>
  )
}