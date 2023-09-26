import React from 'react';
import { SubscribeBanner } from 'components/SubscribeBanner';
import styles from './ArticleBlockSubscribe.module.scss';

export interface IArticleBlockSubscribe {
    photo: any
    title: string
}

export const ArticleBlockSubscribe = (data:IArticleBlockSubscribe) => {
    return (
        <div className={styles.ArticleBlockSubscribe}>
            <div className={styles['ArticleBlockSubscribe-content']}>
                <SubscribeBanner {...data} />
            </div>
        </div>
    )
}
