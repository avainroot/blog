import React from 'react';
import { AudioPlayer } from 'components/common/AudioPlayer';
import styles from './ArticleBlockAudio.module.scss';
import delve from 'dlv';

export interface IArticleBlockAudio {
    file: any
    source: string
    title: string
}

export const ArticleBlockAudio = ({ title, source, file }: IArticleBlockAudio) => {

    let fileSrc = delve(file, 'data.attributes.url', false);
    fileSrc = fileSrc && `${process.env.NEXT_PUBLIC_URL}${fileSrc}`;

    return (
        <div className={styles.ArticleBlockAudio}>
            <div className={styles['ArticleBlockAudio-wrapper']}>
                <AudioPlayer source={fileSrc || source} title={title}/>
            </div>
        </div>
    )
}
