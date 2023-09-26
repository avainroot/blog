import React, { useState, useEffect } from 'react';
import { NavBarMenu, INavLink } from 'components/NavBarMenu';
import { SubscribePopup } from 'components/SubscribePopup';
import { paths } from 'utils/links';
import Logo from 'images/logo.svg';
import styles from  './NavBar.module.scss'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FilterItems, FilterSelectItems } from 'components/Filter/data';

export const NavBar = () => {

    const router = useRouter();

    const [isMenuOpened, setIsMenuOpened] = useState(false);
    const [isSubscribeOpened, setIsSubscribeOpened] = useState(false);

    const onSubscribeClick = () => {
        setIsSubscribeOpened(true);
    }

    const onSubscribeClose = () => {
        setIsSubscribeOpened(false);
    }

    const onLogoClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (e.currentTarget.classList.contains('isCurrent')) {
            e.preventDefault();

            window.scroll({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    useEffect(() => {
        if (isMenuOpened) {
            document.documentElement.classList.add('menuIsShown');
        } else {
            document.documentElement.classList.remove('menuIsShown');
        }
    }, [isMenuOpened])

    const onMenuToggle = () => {
        setIsMenuOpened(!isMenuOpened);
    }

    const onMenuClose = (e: any, path: string) => {
        if(router.asPath === path) e.preventDefault();
        setIsMenuOpened(false);
    }

    const navLinks: INavLink[] = [
        {
            url: paths.home,
            title: 'Blog Home'
        },
        {
            url: paths.articles,
            title: 'Articles',
            filter: {
                items: FilterItems,
                select: FilterSelectItems
            }
        },
        {
            url: paths.podcasts,
            title: 'Podcasts'
        }
    ];

    return (
        <header className={styles.NavBar}>
            <div className={`${styles['NavBar-panel']} ${isMenuOpened ? `${styles.isMenuOpened}` : ''}`}>
                <a href="#" target="_blank" rel="noreferrer">
                    <Logo />
                </a>
                <nav>
                    <ul className="text-small">
                        { navLinks.map(navLink =>
                            <li key={navLink.url}>
                                <Link className={ router.pathname === navLink.url ? styles.isCurrent : ""} href={navLink.url}>{navLink.title}</Link>
                            </li>
                        )}
                    </ul>
                </nav>
                <button className={`${styles['NavBar-join']} btn-white-with-border btn-low`} onClick={onSubscribeClick}>Join Newsletter</button>
                <button className={`${styles['NavBar-burger']} ${isMenuOpened ? styles.isMenuOpened : ''}`} onClick={onMenuToggle}><span></span>Menu</button>
            </div>
            <NavBarMenu navLinks={navLinks} isOpened={isMenuOpened} onClose={onMenuClose}></NavBarMenu>
            <SubscribePopup isOpened={isSubscribeOpened} setOpen={setIsSubscribeOpened} onClose={onSubscribeClose}></SubscribePopup>
        </header>
    )
}
