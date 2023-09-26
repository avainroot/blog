import React, {useState} from 'react';
import { ArticleBlockGalleryItem } from 'components/article/ArticleBlockGalleryItem';
import { IArticleBlockImage } from 'components/article/ArticleBlockImage';
import { IArticleBlockVideo } from 'components/article/ArticleBlockVideo';
import styles from './ArticleBlockGallery.module.scss'

export interface IArticleBlockGallery {
    type: 'image' | 'video',
    items: DataTypes[]
}

interface IArticleBlockGalleryProps {
    ArticleBlockImage: IArticleBlockImage[]
}

type DataTypes = {
    type: 'image' | 'video'
} & (IArticleBlockImage | IArticleBlockVideo)

export const ArticleBlockGallery = ({ ArticleBlockImage }: IArticleBlockGalleryProps) => {

    const data = ArticleBlockImage

    const [activeIndex, setActiveIndex] = useState(0);
    const [switchDirection, setSwitchDirection] = useState('');
    const [zIndex, setZIndex] = useState(1);

    const switchToSlide = (index: number) => {
        setZIndex(zIndex + 1);
        setActiveIndex(index);
    }

    const onPrevClick = () => {
        switchToSlide((activeIndex - 1 + data.length) % data.length);
        setSwitchDirection('left');
    }

    const onNextClick = () => {
        switchToSlide((activeIndex + 1) % data.length);
        setSwitchDirection('right');
    }

    return (
        <div className={styles['ArticleBlockGallery']}>
            <div className={styles['ArticleBlockGallery-wrapper']}>
                { data.map((item, index) =>
                    <ArticleBlockGalleryItem
                        key={index}
                        data={item}
                        isActive={activeIndex === index}
                        switchDirection={switchDirection}
                        onNextClick={onNextClick}
                        onPrevClick={onPrevClick}
                        hasNavigation={data.length > 1}
                        zIndex={activeIndex === index ? zIndex : 0}/>
                )}
            </div>
        </div>
    )
}
