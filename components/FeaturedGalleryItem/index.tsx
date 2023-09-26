import React, { useEffect, useState } from 'react';
import { eventBus, titleCase } from "utils/utils";
import styles from './FeaturedGalleryItem.module.scss'
import delve from 'dlv';
import { format } from 'date-fns';
import { useAppContext } from 'context/appContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { BlogImg } from 'components/common/BlogImg';

export interface IFeaturedGalleryItem {
    subtitle?: string
    title: string
    url: string
    picture: string
    previewPicture: string
    featuredPicture?: string
    authorPicture?: string
    countryPicture?: string
    authorEntity?: string
    authorPosition?: string
    date?: string
    publishAt?: string
    type: string
    readingTime?: string
    previewDescription: string
    slug?: string
    category?: string
}

interface IFeaturedGalleryItemProps {
    data: IFeaturedGalleryItem
    isActive: boolean
    zIndex: number
    switchDirection: string
}

export const FeaturedGalleryItem = ({ data, isActive, zIndex, switchDirection }: IFeaturedGalleryItemProps) => {

    let location = useRouter();

    const { abbr } = useAppContext();

    const [isInitial, setIsInitial] = useState(isActive);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsInitial(false);
        }, 1500)

        return () => {
            clearTimeout(timeout);
        }
    }, [])

    const onMouseEnter = () => {
        eventBus.dispatch('feature-article-line-mouse-enter', {});
    }

    const onMouseLeave = () => {
        eventBus.dispatch('feature-article-line-mouse-leave', {});
    }

    const URL_BASE = process.env.REACT_APP_URL;

    let authorInfo = delve(data, 'authorEntity.data.attributes', false);
    let authorPicture = authorInfo && delve(authorInfo, 'picture.data.attributes', '');
    let countryPicture = authorInfo && delve(authorInfo, 'countryPicture.data.attributes', '');
    let previewPicture = delve(data, 'previewPicture.data.attributes', '');
    let featuredPicture = delve(data, 'featuredPicture.data.attributes', false);

    const { subtitle, title, previewDescription, type, readingTime, publishAt, slug, category } = data


    const slugifiedCategory = category ? category.replace(/\s+/g, '-').toLowerCase() : '';

    return (
        <article className={`${styles.FeaturedGalleryItem} ${isActive ? styles.active : ''} ${isInitial ? styles.isInitial : ''}`} data-direction={switchDirection} style={zIndex ? { zIndex } : {}}>
            <div className={styles['FeaturedGalleryItem-picture']}>
                <Link 
                    onMouseEnter={onMouseEnter} 
                    onMouseLeave={onMouseLeave} 
                    href={`/${slugifiedCategory}/articles/${slug}`} 
                >
                    <div className={`${styles['FeaturedGalleryItem-pictureAspect']} text-medium`}>
                        {!featuredPicture ? (
                            <BlogImg 
                                src={previewPicture.url}
                                width={previewPicture.width}
                                height={previewPicture.height}
                                alt={title}
                            />
                        ) : (
                            <BlogImg 
                                src={featuredPicture.url}
                                width={featuredPicture.width}
                                height={featuredPicture.height}
                                alt={title}
                            />
                        )}
                    </div>
                </Link>
            </div>
            <div className={styles['FeaturedGalleryItem-content']}>
                <div className={styles['FeaturedGalleryItem-contentWrapper']}>
                    {data.category ? <div className={`${styles['FeaturedGalleryItem-subtitle']} text-caption-large`}>{data.category}</div> : ''}
                    <h2 className="text-h1">
                        <Link 
                            onMouseEnter={onMouseEnter} 
                            onMouseLeave={onMouseLeave} 
                            href={`/${slugifiedCategory}/articles/${slug}`}
                        >
                            {titleCase(title, abbr)}
                        </Link>
                    </h2>
                    <p className="text-small" dangerouslySetInnerHTML={{ __html: previewDescription }}></p>
                    <div className={styles['FeaturedGalleryItem-info']}>
                        {authorInfo && (
                            <div className={styles['FeaturedGalleryItem-infoIcon']} data-type={type}>
                                {type === 'article' ? <BlogImg src={authorPicture.url} width={authorPicture.width} height={authorPicture.height} alt={authorInfo.firstName} /> : ''}
                                {type === 'article' ? <BlogImg src={countryPicture.url} width={countryPicture.width} height={countryPicture.height} alt={authorInfo.firstName} /> : ''}
                            </div>
                        )}
                        <div className={`${styles['FeaturedGalleryItem-infoContent']} text-small`}>
                            <span>
                                <b>{type === 'article' ? (authorInfo && authorInfo.firstName + ' ' + authorInfo.lastName) : readingTime + (type === 'video' ? ' min view' : ' min')}</b>
                            </span>
                            <br />
                            <span>{type === 'article' ? (authorInfo && authorInfo.position) : (publishAt && format(new Date(publishAt), 'MMMM dd, yyyy'))}</span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}