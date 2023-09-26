import { useAppContext } from 'context/appContext';
import React from 'react';
import { titleCase } from 'utils/utils';
import styles from './ArticleBlockHeader.module.scss';

export interface IArticleBlockHeader {
    type: string
    order: string
    header: string
    heading: string
}

export const ArticleBlockHeader = (data: IArticleBlockHeader) => {
    let tag = !data.heading || data.heading === 'h1' ? 'h2' : data.heading || 'h2';
    const Heading = (props: any) => React.createElement(tag, props, props.children);
    const { abbr } = useAppContext();

    return (
        <div className={`${styles.ArticleBlockHeader} text-${data.heading !== 'h3'?'h1':'h3'}`}>
            <Heading className={`${styles['ArticleBlockHeader-wrapper']} ${data.order ? styles.hasOrder : ''}`} data-order={data.order + '. '}>{titleCase(data.header, abbr)}</Heading>
        </div>
    )
}
