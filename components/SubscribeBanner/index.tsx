import React from 'react';
import { Subscribe } from 'components/common/Subscribe';
import pattern from 'images/pattern.png';
import subscribeImage from 'images/subscribe.jpg';
import styles from './SubscribeBanner.module.scss'
import delve from 'dlv';
import { IArticleBlockSubscribe } from 'components/article/ArticleBlockSubscribe';
import { BlogImg } from 'components/common/BlogImg';

export const SubscribeBanner = (data: IArticleBlockSubscribe) => {

    const { photo, title } = data
    let picture = delve(photo  , 'data.attributes', false);

    return (
        <article className={styles['SubscribeBanner']}>
            <div className={styles['SubscribeBanner-images']}>
                <div className={styles['SubscribeBanner-imagesWrapper']}>
                    <BlogImg 
                        src={pattern}
                        className={styles['SubscribeBanner-pattern']}
                        alt=''
                        priority
                    />
                    {picture ? (
                        <BlogImg 
                            src={picture.url}
                            width={picture.width}
                            height={picture.height}
                            alt=''
                            className={styles['SubscribeBanner-image']}
                        /> 
                    ):(
                        <BlogImg 
                            className={styles['SubscribeBanner-image']} 
                            src={subscribeImage} 
                            alt=""
                        />
                    )}
                </div>
            </div>
            <section className={styles['SubscribeBanner-content']}>
                <div className={styles['SubscribeBanner-contentWrapper']}>
                    <h1 className="text-h1">{title ? title : "Our top stories and news, curated monthly."}</h1>
                    <Subscribe checkboxColor="blue">I consent to receive informational emails about Blog news, products and services according to <a href="#" target="_blank" rel="noreferrer" data-icon>Privacy Policy</a></Subscribe>
                </div>
            </section>
        </article>
    )
}
