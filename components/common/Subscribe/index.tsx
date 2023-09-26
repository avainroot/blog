import React, { Dispatch, SetStateAction, useState } from 'react';
import { Input } from 'components/common/Input';
import { Checkbox } from 'components/common/Checkbox';
import { isValidEmail, getSubscribeUrl } from 'utils/utils';
import Submit from 'images/submit.svg';
import styles from './Subscribe.module.scss'
import axios from 'axios';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface ISubscribeProps {
    checkboxColor: string
    children: React.ReactNode
    closeWrap?: Dispatch<SetStateAction<boolean>>
}

export const Subscribe = ({ checkboxColor, children, closeWrap }: ISubscribeProps) => {

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setEmail(e.target.value);
        setError('');
    }

    const onInputBlur = (): void => {
        setError(isValidEmail(email) || !email ? "" : "Not a valid email address");
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.keyCode === 13) {
            onInputBlur();
            onSubmit();
        }
    }

    const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setIsAgreed(e.target.checked);
    }

    const onSubmit = (): void => {
        if (!isValidEmail(email) || !email) return;

        if (!isAgreed) {
            setIsShaking(true);
            setTimeout(setIsShaking, 500, false);
            return
        }

        axios.post(`${getSubscribeUrl()}`, { email: email })
            .then(function (response) {
                setIsAgreed(!isAgreed)
                setEmail('')
                closeWrap && closeWrap(false)
                toast.success(<div>Thank You for subscribing! <br /> <b>{email}</b></div>)
            })
            .catch(function (error) {
                setError('Such a user already exists');
            });
    }

    return (
        <div className='Subscribe'>
            <div className={styles['Subscribe-inputWrapper']}>
                <Input
                    placeholder="Insert your email..."
                    value={email}
                    name="subscribeEmail"
                    error={error}
                    onChange={onInputChange}
                    onBlur={onInputBlur}
                    onKeyDown={onKeyDown} />
                {email ? <button onClick={onSubmit} className={`${styles['Subscribe-submit']} btn-blue`}>
                    <Submit />
                </button> : ''}
            </div>
            <div className={`${styles['Subscribe-checkboxWrapper']} ${isShaking ? styles.shake : ''}`}>
                <Checkbox
                    color={checkboxColor}
                    value={isAgreed}
                    onChange={onCheckboxChange}>{children}</Checkbox>
            </div>
        </div>
    )
}

