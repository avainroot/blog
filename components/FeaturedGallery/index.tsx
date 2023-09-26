import React, { useState, useEffect, useRef } from 'react';
import { TimerButton } from 'components/common/TimerButton';
import { FeaturedGalleryItem, IFeaturedGalleryItem } from 'components/FeaturedGalleryItem';
import { eventBus } from "utils/utils";
import styles from './FeaturedGallery.module.scss';
import { useFeatured } from 'apis/useArticles';
import { useAppContext } from 'context/appContext';

export const FeaturedGallery = () => {

    const { articles, isLoading } = useFeatured();
    
    const { setFeaturedLoaded } = useAppContext();

    const data:IFeaturedGalleryItem[] = articles && articles.data.map((article: any) => article.attributes);

    const [activeIndex, setActiveIndex] = useState(0);
    const [zIndex, setZIndex] = useState(1);
    const [switchDirection, setSwitchDirection] = useState('');
    const [isTimerActive, setIsTimerActive] = useState(true);
    const [isTimerPaused, setIsTimerPaused] = useState(false);
    const [isOnView, setIsOnView] = useState(true);
    const intersectionObserver = useRef<any>(null);
    const elRef = useRef<HTMLElement>(null);

    const switchToSlide = (index: number, direction: string) => {
        if (!direction) {
            direction = index < activeIndex ? 'left' : 'right';
            setIsTimerActive(false);
        }
        setZIndex(zIndex + 1);
        setActiveIndex(index);
        setSwitchDirection(direction);
    }

    const onPrevClick = (isAuto: boolean) => {
        switchToSlide((activeIndex - 1 + data.length) % data.length, 'left');
        if (!isAuto) {
            setIsTimerActive(false);
        }
    }

    const onNextClick = (isAuto: boolean) => {
        switchToSlide((activeIndex + 1) % data.length, 'right');
        if (!isAuto) {
            setIsTimerActive(false);
        }
    }

    const onIntersect = (entries: any) => {
        if (!entries[0].isIntersecting) {
            setIsOnView(false);
            return;
        }

        setIsOnView(true);
    }

    const pauseTimer = () => {
        setIsTimerPaused(true);
    }

    const resumeTimer = () => {
        setIsTimerPaused(false);
    }

    useEffect(() => {
        eventBus.on('feature-article-line-mouse-enter', pauseTimer);
        eventBus.on('feature-article-line-mouse-leave', resumeTimer);

        if (elRef.current &&
            typeof window !== 'undefined' &&
            'IntersectionObserver' in window &&
            'IntersectionObserverEntry' in window &&
            'intersectionRatio' in window.IntersectionObserverEntry.prototype) {

            intersectionObserver.current = new IntersectionObserver(onIntersect, {
                root: null,
                rootMargin: `0% 0% 0% 0%`,
                threshold: 0
            });
            intersectionObserver.current.observe(elRef.current);

        }

        return () => {
            eventBus.remove('feature-article-line-mouse-enter', pauseTimer);
            eventBus.remove('feature-article-line-mouse-leave', resumeTimer);

            if (intersectionObserver?.current) {
                intersectionObserver.current.disconnect();
            }
        }
    }, [])

    useEffect(()=>{
        articles && !isLoading && setFeaturedLoaded(true);
    },[articles, isLoading, setFeaturedLoaded])

    return (
        <>
            <article ref={elRef} className={styles.FeaturedGallery}>
                <div className={styles['FeaturedGallery-wrapper']}>
                    <div className={styles['FeaturedGallery-pattern']}>
                        <div className={styles['FeaturedGallery-patternAspect']}></div>
                    </div>
                    <div className={styles['FeaturedGallery-items']}>
                        {articles && !isLoading && data.map((item, index) => 
                            <FeaturedGalleryItem
                                key={index}
                                data={item}
                                isActive={activeIndex === index}
                                zIndex={activeIndex === index ? zIndex : 0}
                                switchDirection={switchDirection} />
                        )}
                    </div>
                    {
                        articles && !isLoading && data.length > 1 ?
                            <>
                                <div className={styles['FeaturedGallery-thumbs']}>
                                    { data.map((item, index) =>
                                        <button className={`${activeIndex === index ? styles.active : ''}`} key={index} onClick={() => switchToSlide(index, '')}></button>
                                    )}
                                </div>
                                <div className={styles['FeaturedGallery-arrows']}>
                                    <TimerButton direction={'right'} onClick={onNextClick} isTimerActive={isTimerActive} isTimerPaused={!isOnView || isTimerPaused} duration={10000}/>
                                    <TimerButton direction={'left'} onClick={onPrevClick} isTimerActive={false} isTimerPaused={false} duration={0}/>
                                </div>
                            </> : ''
                    }
                </div>
            </article>
        </>
    )
}