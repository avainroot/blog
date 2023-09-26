import React from 'react';
import { VideoPlayer } from 'components/common/VideoPlayer';
import styles from './ArticleBlockVideo.module.scss'
import delve from 'dlv';

export interface IArticleBlockVideo {
    caption?: string
    playerType: 'youtube' | 'vimeo'
    videoId: string
    coverPicture: any
}

export const ArticleBlockVideo = ({ caption, playerType, videoId, coverPicture }: IArticleBlockVideo) => {
    const URL_BASE = process.env.REACT_APP_URL;
    
    let picture = delve(coverPicture, 'data.attributes.formats', false);

    return (
        <div className={styles.ArticleBlockVideo}>
            <figure className={styles['ArticleBlockVideo-wrapper']}>
                <div className={styles['ArticleBlockVideo-aspect']}>
                    <VideoPlayer isActive={true} coverPicture={picture} playerType={playerType} videoId={videoId}  />
                </div>
                { caption ? <figcaption className="text-mini">{caption}</figcaption> : ''}
            </figure>
        </div>
    )
}
