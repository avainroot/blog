import React from 'react';
import styles from './ArticleInfo.module.scss';
import delve from 'dlv';
import { titleCase } from 'utils/utils';
import { format } from 'date-fns';
import { useAppContext } from 'context/appContext';
import Image from 'next/image';

interface IArticleInfo {
    subtitle: string
    title: string
    category: string
    authorPicture: any
    countryPicture: any
    authorEntity: string
    authorPosition: string
    previewDescription: string
    synopsis: string
    publishAt: string
    date: string
    readingTime: string
    blocks: any[]
}

export const ArticleInfo = (data: IArticleInfo) => {

    const URL_BASE = process.env.NEXT_PUBLIC_URL;

    const { abbr }  = useAppContext();

    let authorInfo = data.authorEntity && delve(data, 'authorEntity.data.attributes');
    let authorPicture = authorInfo && `${URL_BASE}${delve(authorInfo, 'picture.data.attributes.url', '')}`;
    let countryPicture = authorInfo && `${URL_BASE}${delve(authorInfo, 'countryPicture.data.attributes.url', '')}`;

    const isBlock = data.blocks?.find(({ __component }) => __component === "article.article-info");

    data = isBlock ? isBlock : data;

    return (
        <div className={styles.ArticleInfo}>
            <div className={styles['ArticleInfo-wrapper']}>
                <div className={styles['ArticleInfo-contentLeft']}>
                    <div className={`${styles['ArticleInfo-subtitle']} text-caption-large`}>{data.category}</div>
                    <h1 className="text-h1">{titleCase(data.title, abbr)}</h1>
                    <p className={`${styles['ArticleInfo-textMobile']} text-medium`} dangerouslySetInnerHTML={{ __html: data.synopsis ? data.synopsis : data.previewDescription }}></p>
                    <div className={`${styles['ArticleInfo-footnoteMobile']} text-small`}>{format(new Date(data.publishAt), 'MMMM dd, yyyy')} &nbsp; · &nbsp; {data.readingTime} min read</div>
                    <div className={styles['ArticleInfo-info']}>
                        <div className={styles['ArticleInfo-infoIcon']}>
                            <img loading="lazy" src={isBlock ? URL_BASE + data.authorPicture.data.attributes.url : authorPicture} alt="" />
                            <img loading="lazy" src={isBlock ? URL_BASE + data.countryPicture.data.attributes.url : countryPicture} alt="" />
                        </div>
                        <div className={`${styles['ArticleInfo-infoContent']} text-small`}><span><b>{isBlock ? data.authorEntity : authorInfo?.firstName + ' ' + authorInfo?.lastName}</b></span><br /><span>{isBlock ? data.authorPosition : authorInfo?.position}</span></div>
                    </div>
                </div>

                <div className={styles['ArticleInfo-contentRight']}>
                    <div className={`${styles['ArticleInfo-caption']} text-small`}><b>Synopsis</b></div>
                    <p className={`${styles['ArticleInfo-text']} text-medium`} dangerouslySetInnerHTML={{ __html: data.synopsis ? data.synopsis : data.previewDescription }}></p>
                    <div className={`${styles['ArticleInfo-footnote']} text-small`}>{!isBlock ? format(new Date(data.publishAt), 'MMMM dd, yyyy') : format(new Date(data.date), 'MMMM dd, yyyy')} &nbsp; · &nbsp; {data.readingTime} min read</div>
                </div>
            </div>
        </div>
    )
}

