import React from 'react';
import { VideoPlayer } from 'components/common/VideoPlayer';
import { IArticleBlockImage } from 'components/article/ArticleBlockImage';
import { IArticleBlockVideo } from 'components/article/ArticleBlockVideo';
import styles from './MediaGalleryItem.module.scss'
import delve from 'dlv'
import { BlogImg } from '../BlogImg';


type Props = {
    hasNavigation: boolean
    isActive: boolean
    onPrevClick: React.MouseEventHandler<HTMLButtonElement>
    onNextClick: React.MouseEventHandler<HTMLButtonElement>
    data: {
        type: 'video' | 'image'
    } & (IArticleBlockVideo | IArticleBlockImage)
    switchDirection: string
}

export const MediaGalleryItem = ({ hasNavigation, isActive, onPrevClick, onNextClick, data, switchDirection }: Props) => {
    const URL_BASE = process.env.NEXT_PUBLIC_URL;
    let coverPicture = delve(data, 'coverPicture.data.attributes', false);
    let img = delve(data, 'picture.data.attributes', '');

    const { videoId, playerType } = data as IArticleBlockVideo

    return (
        <div className={`${styles.MediaGalleryItem} ${isActive ? styles.active : ''}`} data-direction={switchDirection}>
            <div className={`${styles['MediaGalleryItem-aspect']} text-medium`}>
                <div className={styles['MediaGalleryItem-wrapper']}>
                    <div className={styles['MediaGalleryItem-content']}>
                        { data.type === 'video' ? <VideoPlayer isActive={isActive} videoId={videoId} playerType={playerType} coverPicture={coverPicture} /> : ''}
                        { data.type === 'image' ? <BlogImg className={styles['MediaGalleryItem-image']} src={img.url} width={img.width} height={img.height} alt='' /> : ''}
                    </div>
                </div>
                {
                    hasNavigation ?
                        <>
                            <button className={`${styles['MediaGalleryItem-arrow']} ${styles.left}`} data-type={data.type} onClick={onPrevClick}>
                                <span className={styles['MediaGalleryItem-arrow-figure']}></span>
                            </button>
                            <button className={`${styles['MediaGalleryItem-arrow']} ${styles.right}`} data-type={data.type} onClick={onNextClick}>
                                <span className={styles['MediaGalleryItem-arrow-figure']}></span>
                            </button>
                        </> : ''
                }
            </div>
        </div>
    )
}