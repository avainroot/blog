import React, { useState } from 'react';
import { VideoGalleryItem, IVideoGalleryItem } from 'components/VideoGalleryItem';
import { TimerButton } from 'components/common/TimerButton';
import styles from './VideoGallery.module.scss';

interface IVideoGalleryProps {
    videoGalleryItem: IVideoGalleryItem[]
}

export const VideoGallery = ({ videoGalleryItem }: IVideoGalleryProps) => {

    const data = videoGalleryItem;

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
        <article className={styles.VideoGallery}>
            <div className={styles['VideoGallery-wrapper']}>
                <div className={styles['VideoGallery-items']}>
                    { data.map((item, index) =>
                        <VideoGalleryItem
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
                {
                    data.length > 1 ?
                        <div className={styles['VideoGallery-arrows']}>
                            <TimerButton direction={'right'} onClick={onNextClick} isTimerActive={false} duration={0}/>
                            <TimerButton direction={'left'} onClick={onPrevClick} isTimerActive={false} duration={0}/>
                        </div> : ''
                }

            </div>
        </article>
    )
}