import React from 'react';
import styles from './ArticleBlockQuote.module.scss'

export interface IArticleBlockQuote {
    type: string
    quote: string
}

export const ArticleBlockQuote = (data: IArticleBlockQuote) => {
    return (
        <div className={`${styles['ArticleBlockQuote']} text-quote-large`}>
            <blockquote className={styles['ArticleBlockQuote-wrapper']} dangerouslySetInnerHTML={ { __html: data.quote }}></blockquote>
        </div>
    )
}
