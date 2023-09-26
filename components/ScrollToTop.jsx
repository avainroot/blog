import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { paths } from 'utils/links';

export const ScrollToTop = (props) => {
    const { asPath } = useRouter();
    useEffect(() => {
        if (props.isActive && asPath !== paths.articles) {
            if(document.documentElement.classList.contains('hasActiveModals')) {
                document.getElementsByTagName('main')[0].scrollTo(0, 0);
            } else {
                document.documentElement.scrollTo(0, 0);
            }
        }
    }, [asPath, props.isActive]);

    return <>{props.children}</>
};