import type { AppProps } from 'next/app'
import { Flip, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import 'styles/app.scss';
import 'plyr/src/sass/plyr.scss';
import { Cursor } from 'components/common/Cursor';
import { NavBar } from 'components/NavBar';
import { ScrollToTop } from 'components/ScrollToTop';
import { AppContextProvider } from 'context/appContext';
import { primaryInput } from 'detect-it';
import { useEffect, useRef } from 'react';
import { useInterceptNextDataHref } from 'utils/linkRewrite';
import useScrollRestoration from 'utils/useScrollRestoration';
import ErrorBoundary from 'utils/errorHandling';
import { FilterContextProvider } from 'context/filterContext';

export default function App({ Component, pageProps, router }: AppProps) {


  const resizeTimeout = useRef<ReturnType<typeof setTimeout>|null>(null);

  useInterceptNextDataHref({
    router,
    namespace: process.env.PUBLIC_URL || '',
  });

  useScrollRestoration(router);

  useEffect(()=>{
    document.documentElement.classList.add(primaryInput === 'touch' ? 'isTouch' : 'isPointer');
  },[])

  const setScrollBarWidth = () => {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';

    document.body.appendChild(outer);

    const widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = 'scroll';

    const inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    const widthWithScroll = inner.offsetWidth;
    outer.parentNode!.removeChild(outer);

    document.documentElement.style.setProperty('--scrollbar-width', (widthNoScroll - widthWithScroll) + 'px');
  }

  const onResize = () => {
    if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current);
    }
    document.documentElement.classList.add('stopAnimations');

    resizeTimeout.current = setTimeout(() => {
        document.documentElement.classList.remove('stopAnimations');
    }, 1000);
  }

  useEffect(() => {
    setScrollBarWidth();

    document.documentElement.classList.add('pageIsLoading');

    setTimeout(() => {
        document.documentElement.classList.remove('pageIsLoading');
    }, 1500)

    window.addEventListener('resize', onResize);

    return () => {
        window.removeEventListener('resize', onResize);

        if (resizeTimeout.current) {
            clearTimeout(resizeTimeout.current);
        }
    }
  }, []);

  return(
    <ErrorBoundary>
      <AppContextProvider>
        <FilterContextProvider>
          <div className="App-loader">
            <svg viewBox="0 0 100 100">
              <defs>
                <mask id="loader-mask">
                  <rect x="0" y="0" height="100" width="100" fill="#fff" />
                  <circle cx="50" cy="50" r="0" fill="#000">
                    <animate
                      attributeName="r"
                      calcMode="spline"
                      keySplines="0.9 0 0.6 0"
                      values="0;100"
                      dur="0.85s"
                      fill="freeze"
                      repeatCount="1" />
                  </circle>
                </mask>
              </defs>
              <rect x="0" y="0" height="100" width="100" fill="#685dc5" mask="url(#loader-mask)" />
            </svg>
          </div>
          <NavBar/>
          <Cursor/>
          <ScrollToTop isActive={true}>
            <Component {...pageProps} />
          </ScrollToTop>
          <ToastContainer 
            position="bottom-right"
            pauseOnHover={false}
            draggable={false}
            closeOnClick={false}
            transition={Flip}
          />
        </FilterContextProvider>
      </AppContextProvider>
    </ErrorBoundary>
  )
}
