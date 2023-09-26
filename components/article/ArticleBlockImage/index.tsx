import React from 'react';
import styles from './ArticleBlockImage.module.scss';
import delve from 'dlv';
import { BlogImg } from 'components/common/BlogImg';

export interface IArticleBlockImage {
    picture: string
    caption?: string
    alt?: string
    special?: boolean
}

export const ArticleBlockImage = (data: IArticleBlockImage) => {
    const BASE_URL = process.env.NEXT_PUBLIC_URL;
    let pictureSet = delve(data  , 'picture.data.attributes', false);

    let blockStyle = `${styles['ArticleBlockImage-wrapper']} ${data.special?styles['Special']:''}`
    

    return (
        <div className={styles.ArticleBlockImage}>
            <figure className={blockStyle}>
                <BlogImg 
                    src={pictureSet.url}
                    width={pictureSet.width}
                    height={pictureSet.height}
                    alt={data.caption? data.caption: ''}
                />
                { data.caption ? <figcaption className="text-mini">{data.caption}</figcaption> : ''}
            </figure>
        </div>
    )
}
