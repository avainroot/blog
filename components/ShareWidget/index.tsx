import styles from './ShareWidget.module.scss'
import { FacebookShareButton, LinkedinShareButton, EmailShareButton } from 'react-share'
import { useEffect, useState } from 'react';
import Clap from 'images/clap.svg'
import { useAppContext } from 'context/appContext';
import { useRouter } from 'next/router';
import { paths } from 'utils/links';

export const ShareWidget = () => {

  const [ isClap, setIsClap ] = useState<boolean>(false);

  const { asPath } = useRouter();

  const [currentPageUrl, setCurrentPageUrl] = useState<string>('');


  useEffect(()=>{
    setCurrentPageUrl(window.location.href);
  },[])


  // useEffect(()=>{
  //   const clapsList = localStorage.getItem('clapping');
  //   if(clapsList) {
  //     setIsClap(clapsList.split(',').includes(asPath))
  //   }
  // })

  return(
    <div className={styles.ShareWidget}>
      {/* <div className={styles['ShareWidget-body']}>
        {asPath !== paths.home && asPath !== paths.articles && (
          <div onClick={setClaps} className={`${styles['ShareWidget-clap']} ${isClap? styles.isClap:''}`}>
            <Clap />
            <span>{claps}</span>
          </div>
        )}
        <div className={styles['ShareWidget-social']}>
          <LinkedinShareButton url={currentPageUrl}><span data-id="in"></span></LinkedinShareButton>
          <FacebookShareButton url={currentPageUrl}><span data-id="fb"></span></FacebookShareButton>
          <EmailShareButton url={currentPageUrl}><span data-id="em"></span></EmailShareButton>
        </div>
      </div> */}
    </div>
  )
}