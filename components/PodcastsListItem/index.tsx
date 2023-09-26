/* eslint-disable react/display-name */
/* eslint-disable @next/next/no-img-element */
import { Podcast } from "components/PodcastsList";
import { format } from "date-fns";
import styles from './PodcastsListItem.module.scss';
import Spotify from 'images/spotify.svg';
import Apple from 'images/apple-music.svg';
import delve from 'dlv';
import { BlogImg } from "components/common/BlogImg";
import { useState } from "react";
import Arrow from 'images/arrow.svg';
import React from "react";

export const PodcastsListItem = (data: Podcast) => {

  const durationDate = new Date(`July 1, 1999, ${data.duration}`);
  let durationView = parseInt(format(durationDate, 'H')) > 0 ? `${format(durationDate, 'H')} h` : '';
  durationView += ` ${format(new Date(`July 1, 1999, ${data.duration}`), 'm')} min`;

  const thumb = delve(data, 'thumbnail.data.attributes', false)

  const ReadMore = React.memo(({content}:any) => {
    const [more, setMore] = useState<boolean>(false);
    return(
      <>
        <div>{!more ? `${content.substring(0, 172)}...` : content}</div>
        <div className={styles['PodcastsListItem-more']} data-more={more}>
          <span className="text-mini" onClick={()=>setMore(!more)}>
            {more ? 'Read Less': 'Read More'}
            <Arrow />
          </span>
        </div>
      </>
    )
  })

  return (
    <div className={styles.PodcastsListItem}>
      <div className={styles['PodcastsListItem-preview']}>
        {thumb ? (
          <BlogImg 
            src={thumb.url}
            width={thumb.width}
            height={thumb.height}
            alt={data.title}
          />
        ) : (
          <div className="text-h1">{`${data.episode}.`}</div>
        )}
      </div>
      <div className={styles['PodcastsListItem-body']}>
        <div className={`${styles['PodcastsListItem-title']} text-h3`}><span>{`${data.episode}. `}</span>{data.title}</div>
        <div className={`${styles['PodcastsListItem-description']}`}>
          {data.description.length > 173 ? <ReadMore content={data.description}/>: data.description}
        </div>
        <div className={`${styles['PodcastsListItem-info']}`}>
          {`Episode ${data.episode} • ${format(new Date(data.publishAt), 'dd LLL')} • ${durationView}`}
        </div>
      </div>
      <div className={styles['PodcastsListItem-links']}>
        <div className={styles['PodcastsListItem-links_wrap']}>
          <div className={styles['PodcastsListItem-links_container']}>
            {data.spotify && (
              <a href={data.spotify} className={styles['PodcastsListItem-link']} target="_blank" rel="noreferrer"><Spotify /><span>Listen on</span> Spotify</a>
            )}
            {data.apple && (
              <a href={data.apple} className={styles['PodcastsListItem-link']} target="_blank" rel="noreferrer"><Apple /><span>Listen on</span> Apple</a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}