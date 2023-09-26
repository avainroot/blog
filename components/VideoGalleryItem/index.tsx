import React from 'react';
import { MediaGalleryItem } from 'components/common/MediaGalleryItem';
import styles from './VideoGalleryItem.module.scss'

export interface IVideoGalleryItem {
    subtitle: string
    title: string
    url: string
    coverPicture: string
    videoId: string
    playerType: 'youtube' | 'vimeo'
    description: string
    duration: string
}

interface IVideoGalleryItemProps {
    data: IVideoGalleryItem
    isActive: boolean
    zIndex: number
    onNextClick: React.MouseEventHandler<HTMLButtonElement>
    onPrevClick: React.MouseEventHandler<HTMLButtonElement>
    switchDirection: string
    hasNavigation: boolean
}

export const VideoGalleryItem = ({ data, isActive, zIndex, onNextClick, onPrevClick, switchDirection, hasNavigation }: IVideoGalleryItemProps) => {
    return (
        <article className={`${styles.VideoGalleryItem} ${isActive ? styles.active : ''}`} data-direction={switchDirection} style={zIndex ? {zIndex} : {}}>
            <MediaGalleryItem
                hasNavigation={hasNavigation}
                isActive={isActive}
                onPrevClick={onPrevClick}
                onNextClick={onNextClick}
                data={{ type: 'video', ...data }}
                switchDirection={switchDirection}
            />
            <div className={styles['VideoGalleryItem-content']}>
                <div className={styles['VideoGalleryItem-contentLeft']}>
                    <div className={`${styles['VideoGalleryItem-subtitle']} text-caption-large`}>{data.subtitle}</div>
                    <h2 className="text-h2">{data.title}</h2>
                    <div className={`${styles['VideoGalleryItem-duration']} text-small`}><b>Duration:</b> {data.duration} min</div>
                </div>

                <div className={styles['VideoGalleryItem-contentRight']}>
                    <div className={`${styles['VideoGalleryItem-caption']} text-small`}><b>Description</b></div>
                    <p className="text-medium" dangerouslySetInnerHTML={ { __html: data.description }}></p>
                    <div className={`${styles['VideoGalleryItem-durationMobile']} text-small`}><b>Duration:</b> {data.duration} min</div>
                </div>
            </div>
        </article>
    )
}