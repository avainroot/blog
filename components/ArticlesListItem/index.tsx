import React from 'react';
import { eventBus, titleCase } from "utils/utils";
import styles from './ArticlesListItem.module.scss'
import delve from 'dlv';
import { useAppContext } from 'context/appContext';
import Link from 'next/link';
import { BlogImg } from 'components/common/BlogImg';

export interface IArticlesListItem {
    subtitle: string
    title: string
    url: string
    slug?: string
    picture: string
    preview_picture: string
    author_picture?: string
    country_picture?: string
    authorEntity?: any
    author_position?: string
    date?: string
    type: string
    readingTime?: string
    previewDescription: string
    category?: string
}

interface IArticlesListItemProps {
    data: IArticlesListItem
    scrollForTablet: boolean
    scrollForDesktop: boolean
}

export const ArticlesListItem = ({ data, scrollForTablet, scrollForDesktop }: IArticlesListItemProps) => {

    const URL_BASE = process.env.REACT_APP_URL;
    const { abbr } = useAppContext();

    const onClick = () => {
        eventBus.dispatch('hide-cursor', {});
    }

    const { subtitle, title, type, authorEntity, date, readingTime, previewDescription, slug, category } = data

    let authorInfo = authorEntity && authorEntity.data?.attributes;

    let previewPicture = delve(data, 'previewPicture.data.attributes', '');
    let authorPicture = delve(authorInfo, 'picture.data.attributes', '');
    let countryPicture = delve(authorInfo, 'countryPicture.data.attributes', '');

    let previewPictureSmall = delve(data, 'previewPicture.data.attributes.formats.small', '');
    

    // replace spaces with dashes
    const slugifiedCategory = category ? category.replace(/\s+/g, '-').toLowerCase() : '';

    return (
        <article className={`${styles.ArticlesListItem} special-cursor ${scrollForTablet ? styles['scroll-for-tablet'] : styles['list-for-tablet']} ${scrollForDesktop ? styles['scroll-for-desktop'] : styles['list-for-desktop']}`} data-cursor="plus" onClick={onClick}>
            <Link href={`/${slugifiedCategory}/articles/${slug}`} >
                <div className={styles['ArticlesListItem-picture']}>
                    <BlogImg 
                        src={previewPictureSmall.url || previewPicture.url}
                        width={previewPictureSmall.width || previewPicture.width}
                        height={previewPictureSmall.height || previewPicture.height}
                        alt={title}
                        priority
                    />
                </div>
                <div className={styles['ArticlesListItem-content']}>
                    <div className={styles['ArticlesListItem-contentWrapper']}>
                        <div className={`${styles['ArticlesListItem-subtitle']} text-caption-small`}>{subtitle}</div>
                        <h2 className="text-h3">{titleCase(title, abbr)}</h2>
                        <p className="text-small" dangerouslySetInnerHTML={{ __html: previewDescription }}></p>
                        {authorInfo && (
                            <div className={styles['ArticlesListItem-info']}>
                                <div className={styles['ArticlesListItem-infoIcon']} data-type={type}>
                                    {type === 'article' ? <BlogImg src={authorPicture.url} width={authorPicture.width} height={authorPicture.height} alt='' /> : ''}
                                    {type === 'article' ? <BlogImg src={countryPicture.url} width={countryPicture.width} height={countryPicture.height} alt='' /> : ''}
                                </div>
                                <div className={`${styles['ArticlesListItem-infoContent']} text-small`}><span><b>{type === 'article' ? authorInfo.firstName + ' ' + authorInfo.lastName : readingTime + (type === 'video' ? ' min view' : ' min')}</b></span><span>{type === 'article' ? authorInfo.position : date}</span></div>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </article>
    )
}