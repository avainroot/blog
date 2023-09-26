import delve from 'dlv';
import styles from "../PodcastsListItem.module.scss";
import { AudioPlayer } from "components/common/AudioPlayer";
import Spotify from 'images/spotify.svg';
import Apple from 'images/apple-music.svg';
import { BlogImg } from "components/common/BlogImg";
import { usePodcast } from 'apis/usePodcasts';

export const PodcastsListItemMain = () => {
  
  const { podcast } = usePodcast();

  if(!podcast) return <></>;

  const { audio } = podcast;
  const file = delve(audio, 'file.data.attributes.url', false);
  const pic = delve(podcast, 'cover.data.attributes', false);

  const source = audio.source ? audio.source : (file ? `${process.env.NEXT_PUBLIC_URL}${file}`:'/')
  
  return(
    <div className={styles.PodcastsListItemMain}>
      <div className={styles['PodcastsListItemMain-wrapper']}>
        <div className={styles['PodcastsListItemMain-body']}>
          <div className={styles['PodcastsListItemMain-title']}>
            <div className={`${styles['PodcastsListItemMain-subtitle']} text-caption-large`}>{podcast.subtitle}</div>
            <div className="text-h1">{podcast.title}</div>
          </div>
          <div className={`${styles['PodcastsListItemMain-description']} text-small`}>{podcast.description}</div>
          <AudioPlayer 
            source={source}
            title={audio.title}
            mini
          />
          <div className={styles['PodcastsListItemMain-links']}>
            <span>Follow on:</span>
            <a href={podcast.apple} target="_blank" rel="noreferrer" className={styles['PodcastsListItemMain-link']}>
              <Apple />
            </a>
            <a href={podcast.spotify} target="_blank" rel="noreferrer" className={styles['PodcastsListItemMain-link']}>
              <Spotify />
            </a>
          </div>
        </div>
        <div className={styles['PodcastsListItemMain-picture']}>
          <picture>
            <span>
              {pic && <BlogImg 
                src={pic.url}
                width={pic.width}
                height={pic.height}
                alt={podcast.title}
                priority
              />}
            </span>
          </picture>
        </div>
      </div>
    </div>
  )
}