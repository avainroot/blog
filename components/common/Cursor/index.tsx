import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { eventBus } from "utils/utils";
import styles from './Cursor.module.scss';

export const Cursor = () => { 

    const el = useRef<HTMLDivElement>(null);
    const [ cursorVisible,  setCursorVisible ] = useState(false);
    const [ cursorType,  setCursorType ] = useState('');
    const cursorVisibleRef = useRef(false);

    const router = useRouter();

    const onMouseMove = (e: MouseEvent) => {
        if (el.current) {
            el.current.style.top = e.clientY + 'px';
            el.current.style.left = e.clientX + 'px';
        }
    };

    const onMouseEnter = (e: MouseEvent) => {
        if ((e.target as HTMLElement)?.classList?.contains('special-cursor')) {
            setCursorType((e.target as HTMLElement)?.getAttribute('data-cursor') || '');
            setCursorVisible(true);
            cursorVisibleRef.current = true;
            document.documentElement.classList.add('hasCustomCursor');
        }
    };

    const onMouseLeave = (e: MouseEvent) => {
        if ((e.target as HTMLElement)?.classList?.contains('special-cursor')) {
            hideCursor();
        }
    };

    const hideCursor = () => {
        setCursorVisible(false);
        cursorVisibleRef.current = false;
        document.documentElement.classList.remove('hasCustomCursor');
    }

    useEffect(()=>hideCursor(),[router])

    useEffect(() => {
        eventBus.on('hide-cursor', hideCursor);

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseenter', onMouseEnter, true);
        document.addEventListener('mouseleave', onMouseLeave, true);

        if (el.current) {
            el.current.ontransitionend = () => {
                if (!cursorVisibleRef.current) {
                    document.documentElement.classList.remove('hasCustomCursor');
                }
            }
        }

        return () => {
            eventBus.remove('hide-cursor', hideCursor);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseenter', onMouseEnter, true);
            document.removeEventListener('mouseleave', onMouseLeave, true);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className={`${styles.Cursor} ${cursorVisible ? styles.visible : ''}`} ref={el} data-cursor={cursorType}></div>
    )
}
