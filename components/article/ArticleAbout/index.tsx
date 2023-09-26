import React from 'react';
import './index.scss'

interface IArticleAbout {
    text: string
    moreUrl: string
    author_picture: string
    country_picture: string
    authorEntity: string
    author_position: string
}

interface IArticleAboutProps {
    data: IArticleAbout
}

export const ArticleAbout = ({ data }: IArticleAboutProps) => {
    return (
        <div className="ArticleAbout">
            <div className="ArticleAbout-pattern"></div>
            <div className="ArticleAbout-wrapper">
                <p className="ArticleAbout-text text-quote-small" dangerouslySetInnerHTML={ { __html: data.text }}></p>
                <div className="ArticleAbout-infoWrapper">
                    <div className="ArticleAbout-info">
                        <div className="ArticleAbout-infoIcon">
                            <img loading="lazy" src={data.author_picture} alt=""/>
                            <img loading="lazy" src={data.country_picture} alt=""/>
                        </div>
                        <div className="ArticleAbout-infoContent text-small"><span><b>{data.authorEntity}</b></span><br/><span>{data.author_position}</span></div>
                    </div>
                    <a className="ArticleAbout-readMore btn-blue" href={data.moreUrl} target="_blank" rel="noreferrer">Read more</a>
                </div>
            </div>
        </div>
    )
}
