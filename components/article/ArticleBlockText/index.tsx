import React from 'react';
import { firstLetter, linkParse } from 'utils/utils';
import styles from './ArticleBlockText.module.scss'

export interface IArticleBlockText {
    type: string
    text: string
    firstText: boolean
}

export const ArticleBlockText = (data: IArticleBlockText) => {
    return (
        <div className={`${styles['ArticleBlockText']} text-medium`}>
            <div className={styles['ArticleBlockText-wrapper']} dangerouslySetInnerHTML={ { __html: linkParse(data.firstText ? firstLetter(data.text) : data.text) }}></div>
        </div>
    )
}
