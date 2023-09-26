import React, { useRef, useEffect } from 'react';
import { generateUUID } from 'utils/utils';
import styles from './Checkbox.module.scss';

interface ICheckboxProps {
    value: boolean
    color: string
    onChange: React.ChangeEventHandler<HTMLInputElement>
    children: React.ReactNode
}

export const Checkbox = ({value, color, onChange, children}: ICheckboxProps) => {
    const uuid = useRef<String>('');

    useEffect(() => {
        uuid.current = generateUUID();
    }, []);

    return (
        <div className={styles.Checkbox}>
            <input
                id={`checkbox_${uuid.current}`}
                type="checkbox"
                onChange={onChange}
                checked={value}/>
                <label className="text-small" htmlFor={`checkbox_${uuid.current}`} data-color={color}>{children}</label>
        </div>
    )
}
