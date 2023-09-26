import React from 'react';
import banner from 'images/banner.jpg';
import styles from './Banner.module.scss';
import delve from 'dlv';
import { BlogImg } from 'components/common/BlogImg';

interface BannerProps {
    data: any
}

export const Banner = ({data}: BannerProps) => {

    const customBannerIMG = delve(data  , 'backgroundImage.data.attributes', false)

    return (
        <article className={styles.Banner}>
            <div className={styles['Banner-content']}>
                <div className={`${styles['Banner-subtitle']} text-caption-large`}>{data.subtitle}</div>
                <h1 className="text-h1">{data.title}</h1>
                <a href={data.link} className={`${styles['Banner-link']} btn-white-no-border`}>{data.textButton}</a>
                <div className={styles['Banner-pattern']}>
                    <div className={styles['Banner-patternImage']}></div>
                </div>
            </div>
            <div className={styles['Banner-picture']}>
                { customBannerIMG ? (
                    <BlogImg 
                        src={customBannerIMG.url}
                        width={customBannerIMG.width}
                        height={customBannerIMG.height}
                        alt=''
                    />
                ):(
                    <BlogImg 
                        src={banner}
                        alt=""
                    />
                )}
            </div>
        </article>
    )
}
