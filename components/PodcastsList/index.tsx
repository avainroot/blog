import { PodcastsListItem } from 'components/PodcastsListItem';
import styles from './PodcastsList.module.scss';

export type Podcast = {
  apple: string
  audio: any
  cover: any
  description: string
  duration: string
  episode: number
  publishAt: string
  spotify: string
  subtitle: string
  thumbnail: any
  title: string
}

interface IPodcasts {
  data: {
    id: number
    attributes: Podcast
  }[]
}

export const PodcastsList = ({data}: IPodcasts) => {
  return(
    <div className={styles.PodcastsList}>
      {data.map((podcast, i)=> i !== 0 && <PodcastsListItem key={i} {...podcast.attributes}/>)}
    </div>
  )
}