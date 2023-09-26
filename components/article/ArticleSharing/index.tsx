import React, { useEffect, useState } from 'react';
import { FacebookShareButton, LinkedinShareButton, EmailShareButton } from "react-share";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReactTooltip from 'react-tooltip';

import styles from './ArticleSharing.module.scss'

export const ArticleSharing = () => {
    const [tipText, setTipText] = useState("Share by link")
    const [ready, setReady] = useState<boolean>(false);
    const [currentPageUrl, setCurrentPageUrl] = useState<string>('');

    useEffect(()=>{
        setCurrentPageUrl(window.location.href);
        setReady(!ready);
    },[])

    return (
        <div className={styles.ArticleSharing}>
            <div className={styles['ArticleSharing-wrapper']}>
                <h2 className="text-h1">Thanks for reading</h2>
                <p className="text-medium">If you’re interested in further growth, take a look at our website to learn what your future could look like at <a href="#" target="_blank" rel="noreferrer">Blog</a>. Lastly, get in touch with us at <a href="#">hello@blog</a> to let us know your thoughts!</p>
                <div className={`${styles['ArticleSharing-share']} text-medium`}>
                    Share article:
                    <div className={`${styles['ArticleSharing-shareButtons']} share-btn`}>
                        {/* <TwitterShareButton url={window.location.href}><span data-id="tw"></span></TwitterShareButton> */}
                        <LinkedinShareButton url={`${currentPageUrl}?latest`}><span data-id="in"></span></LinkedinShareButton>
                        <FacebookShareButton url={currentPageUrl}><span data-id="fb"></span></FacebookShareButton>
                        <EmailShareButton url={currentPageUrl}><span data-id="em"></span></EmailShareButton>
                        <CopyToClipboard text={currentPageUrl}
                            onCopy={() => setTipText("Copied to the clipboard!")}>
                            <div style={{ marginTop: "3px" }}>
                                <button data-tip={tipText}>
                                    <span data-id="web" ></span>
                                </button>
                                {ready && <ReactTooltip backgroundColor={"#685dc5"} />}
                            </div>
                        </CopyToClipboard>
                    </div>
                </div>
            </div>
        </div>
    )
}
