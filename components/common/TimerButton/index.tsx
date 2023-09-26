import React, { useEffect, useRef } from 'react';
import Arrow from 'images/arrow.svg';
import styles from './TimerButton.module.scss';
import Image from 'next/image';

interface ITimerButtonProps {
    direction: string
    onClick: Function
    isTimerActive: boolean
    isTimerPaused?: boolean
    duration: number
}

export const TimerButton = ({ direction, onClick, isTimerActive, isTimerPaused, duration }: ITimerButtonProps) => {
    const savedCallback = useRef(onClick);
    const elRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        savedCallback.current = onClick
    }, [onClick])

    useEffect(() => {
        if (elRef.current) {
            //can't use timout/interval, because if tab is inactive (or whole browser) timeouts and css animations runs into async
            elRef.current.onanimationiteration = () => {
                savedCallback.current(true);
            }
        }
    }, []);

    return (
        <button ref={elRef} className={`${styles.TimerButton} ${isTimerActive ? styles['has-timer'] : ''} ${isTimerPaused ? styles['paused'] : ''}`} onClick={() => onClick(false)} data-direction={direction}>
            <Arrow />
            <svg viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <circle r="23" cx="24" cy="24"></circle>
                <circle r="23" cx="24" cy="24" style={{animationDuration: `${duration}ms`}}></circle>
            </svg>
        </button>
    )
}