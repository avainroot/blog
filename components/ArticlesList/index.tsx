import React from 'react';
import { ArticlesListItem, IArticlesListItem } from 'components/ArticlesListItem';
import styles from './ArticlesList.module.scss';

interface IArticlesListProps {
    data: IArticlesListItem[]
    scrollForDesktop: boolean
    scrollForTablet: boolean
 }

export const ArticlesList = ({ data, scrollForTablet, scrollForDesktop }: IArticlesListProps) => {

    if (!data || data.length === 0) {
        return null;
    }
    return (
        <article className={`${styles.ArticlesList} ${ scrollForTablet ? styles['scroll-for-tablet'] : styles['list-for-tablet']} ${ scrollForDesktop ? styles['scroll-for-desktop'] : styles['list-for-desktop']}`}>
            { data.map((item, index) => 
                <ArticlesListItem key={index} data={item} scrollForTablet={scrollForTablet} scrollForDesktop={scrollForDesktop}/>
            )}
        </article>
    )
}