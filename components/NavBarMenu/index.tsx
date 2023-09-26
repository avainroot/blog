import React, { createRef, useRef, useState } from 'react';
import { Subscribe } from 'components/common/Subscribe';
import styles from './NavBarMenu.module.scss'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IFilterItem } from 'components/Filter/data';
import Drop from 'images/arrowDown.svg';
import { paths } from 'utils/links';
import { useFilterContext } from 'context/filterContext';
import { FilterSearchMobile } from 'components/Filter/FilterSearch';

export interface INavLinkFilter {
    items: IFilterItem[]
    select: IFilterItem[]
}
export interface INavLink {
    url: string
    title: string
    filter?: INavLinkFilter
}

interface INavBarMenuProps {
    navLinks: INavLink[]
    isOpened: boolean
    onClose: (e: React.MouseEventHandler<HTMLAnchorElement>, path: string) => void
}

const DropItem = ({children, items, select, root, onClose}: any) => {

    const [show, setShow] = useState<boolean>(false);
    const router = useRouter();
    const { setCategory } = useFilterContext();

    return (
        <li className={`${styles.DropItem}${root?' text-h1':''}`}>
            <span>
                {children}
                <Drop 
                    onClick={()=>{
                        setShow(!show)
                    }}
                />
            </span>
            <ul data-show={show}>
                {root && <li onClick={()=>{
                    onClose()
                    setCategory([])
                    router.push(paths.articles)
                }}>All Categories</li>}
                {items.map((el: IFilterItem, i: number)=>{
                    return(
                        <li 
                            key={i}
                            onClick={()=>{
                                onClose()
                                setCategory([el.value])
                                router.push(paths.articles)
                            }}
                        >
                            <span>{el.text}</span>
                        </li>
                    )
                })}
                {select}
            </ul>
        </li>
    )
}

const MenuFilter = ({children, filter, onClose}: any) => {
    return (
        <DropItem
            root={true} 
            items={filter.items}
            onClose={onClose}
            select={
                <DropItem 
                    items={filter.select}
                    onClose={onClose}
                >
                    {`By Programme`}
                </DropItem>
            }
        >
            {children}
        </DropItem>
    )
}

export const NavBarMenu = ({ navLinks, isOpened, onClose }: INavBarMenuProps) => {
    
    const router = useRouter();

    return (
        <aside className={`${styles.NavBarMenu} ${isOpened ? styles.isOpened : ''}`}>
            <div className={styles['NavBarMenu-wrapper']}>
                <ul>
                    <li>
                        <FilterSearchMobile 
                            onClose={onClose}
                        />
                    </li>
                    { navLinks.map(navLink =>
                        !navLink.filter ? (
                            <li key={navLink.url} className="text-h1">
                                <Link onClick={(e: any)=>{
                                    onClose(e, navLink.url)
                                }} className={router.pathname === navLink.url ? styles.isCurrent : ""} href={navLink.url}>{navLink.title}</Link>
                            </li>
                        ) : (
                            <MenuFilter 
                                key={navLink.url} 
                                filter={navLink.filter}
                                onClose={onClose}
                            >
                                <Link onClick={(e: any)=>{
                                    onClose(e, navLink.url)
                                }} className={router.pathname === navLink.url ? styles.isCurrent : ""} href={navLink.url}>{navLink.title}</Link>
                            </MenuFilter>
                        )
                    )}
                </ul>

                <div className={styles['NavBarMenu-subscribe']}>
                    <div className={styles['NavBarMenu-subscribePattern']}></div>
                    <div className={styles['NavBarMenu-subscribeContent']}>
                        <h2>Join our Newsletter to stay in the loop</h2>
                        <Subscribe checkboxColor="white">I agree with the Blog <a href="/" target="_blank" rel="noreferrer">Privacy Policy</a></Subscribe>
                    </div>
                    <div className={styles['NavBarMenu-subscribeFooter']}>© 2016—2022 Blog All rights reserved.</div>
                </div>
            </div>
        </aside>
    )
}