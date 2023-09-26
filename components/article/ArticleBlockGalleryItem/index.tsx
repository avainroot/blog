import React from 'react';
import { MediaGalleryItem } from 'components/common/MediaGalleryItem';
import { IArticleBlockImage } from 'components/article/ArticleBlockImage';
import { IArticleBlockVideo } from 'components/article/ArticleBlockVideo';
import styles from './ArticleBlockGalleryItem.module.scss'

interface IArticleBlockGalleryItemProps {
    data: IArticleBlockImage
    isActive: boolean
    zIndex: number
    onNextClick: React.MouseEventHandler<HTMLButtonElement>
    onPrevClick: React.MouseEventHandler<HTMLButtonElement>
    switchDirection: string
    hasNavigation: boolean
    caption?: string
}

export const ArticleBlockGalleryItem = ({ data, isActive, zIndex, onNextClick, onPrevClick, switchDirection, hasNavigation }: IArticleBlockGalleryItemProps) => {

    return (
        <figure className={`${styles.ArticleBlockGalleryItem} ${isActive ? styles.active : ''}`} data-direction={switchDirection} style={zIndex ? {zIndex} : {}}>
            <MediaGalleryItem
                hasNavigation={hasNavigation}
                isActive={isActive}
                onPrevClick={onPrevClick}
                onNextClick={onNextClick}
                data={{type: "image", ...data}}
                switchDirection={switchDirection}
            />
            <div className={styles['ArticleBlockGalleryItem-content']}>
                { data.caption ? <figcaption className="text-mini">{data.caption}</figcaption> : ''}
            </div>
        </figure>
    )
}