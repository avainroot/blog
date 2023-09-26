import React, { Dispatch, SetStateAction } from 'react';
import { Subscribe } from 'components/common/Subscribe';
import styles from './SubscribePopup.module.scss'

interface ISubscribePopupProps {
    isOpened: boolean
    setOpen?: Dispatch<SetStateAction<boolean>>
    onClose: React.MouseEventHandler<HTMLButtonElement>
}

export const SubscribePopup = ({ isOpened, setOpen, onClose }: ISubscribePopupProps) => {
    return (
        <aside className={`${styles.SubscribePopup} ${isOpened ? styles.isOpened : ''}`}>
            <div className={styles['SubscribePopup-overlay']}></div>
            <div className={styles['SubscribePopup-panel']}>
                <div className={styles['SubscribePopup-panelContent']}>
                    <h2 className="text-h2">Join our Newsletter to stay in the loop about Blog</h2>
                    <Subscribe checkboxColor="white" closeWrap={setOpen}>I consent to receive informational emails about Blog <a href="#" target="_blank" rel="noreferrer" data-icon>Privacy Policy</a></Subscribe>
                </div>
                <button className={styles['SubscribePopup-close']} onClick={onClose}></button>
            </div>
        </aside>
    )
}
