import React from 'react';
import styles from './Input.module.scss';

interface IInputProps {
    placeholder: string;
    value: string;
    name: string;
    error: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onBlur: React.FocusEventHandler<HTMLInputElement>;
    onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
}

export const Input = ({placeholder, value, error, name, onChange, onBlur, onKeyDown}: IInputProps) => {
    return (
        <div className={`${styles.Input} ${value ? styles.hasData : ""} ${error && value ? styles.error : ""}`}>
            <input
                id={name}
                value={value}
                type="text"
                onChange={onChange}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                name={name}/>
            <div className={styles['Input-label']}>
                <label htmlFor={name}>{value && error || placeholder}</label>
            </div>
        </div>
    )
}
