/* eslint-disable react/display-name */
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { eventBus } from "utils/utils";
import styles from './VideoPlayer.module.scss'
import Plyr, { APITypes } from "plyr-react";
import "plyr-react/plyr.css";
import axios from 'axios';
import { BlogImg } from '../BlogImg';

interface IVideoPlayerProps {
    isActive: boolean
    playerType: 'youtube' | 'vimeo'
    videoId: string
    coverPicture: any
    ref?: any
}

export const VideoPlayer = memo(({ isActive, playerType, videoId, coverPicture, ref }: IVideoPlayerProps) => {

    const [cover, setCover] = useState<string | undefined>();

    const plyrRef = useRef<APITypes>(null);
    const playerBlock = useRef<any>();

    if(playerType === 'vimeo' && !coverPicture && !cover) {
        axios.get(
            `https://api.vimeo.com/videos/${videoId}/pictures?sizes=1280x720`,
            {
                headers: {
                    Authorization: `bearer ${process.env.NEXT_PUBLIC_VIMEO}`,
                    Accept:	`application/vnd.vimeo.*+json;version=3.4`
                }
            }
        ).then(({data})=>{
            setCover(data.data[0].base_link)
        })
    }
    if (playerType === "youtube" && !coverPicture && !cover) {
        setCover(`http://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
    }

    useEffect(() => {
        if (!isActive) {
            stopVideo();
        }
    }, [isActive]);

    
    const stopVideo = () => {
        if (playerBlock.current.attributes['data-state'].value === 'playing' || playerBlock.current.attributes['data-state'].value === 'paused') {
            playerBlock.current.setAttribute('data-state', 'stopped');
        }
    }

    const playVideo = () => {
        // @ts-ignore
        if(playerBlock.current && plyrRef.current && plyrRef.current.plyr.ready) {
            playerBlock.current.setAttribute('data-state', 'playing');
            plyrRef.current.plyr.play();
            plyrRef.current.plyr.on('pause', () => {
                playerBlock.current?.setAttribute('data-state', 'paused');
            })
        }
        eventBus.dispatch('hide-cursor', {});
    }

    return (
        <div ref={playerBlock} className={styles['VideoPlayer']} data-state={'stopped'}> 
            <Plyr 
                ref={plyrRef}
                source={{
                    type: 'video',
                    sources: [{ src: videoId, provider: playerType }]
                }}
            />
            {coverPicture ? (
                <BlogImg
                    className='special-cursor'
                    src={coverPicture.url}
                    width={coverPicture.width}
                    height={coverPicture.height}
                    alt='Video'
                    data-cursor='play'
                    onClick={playVideo}
                />
            ):(
                // eslint-disable-next-line @next/next/no-img-element
                <img className="special-cursor" loading="lazy" src={cover} alt="" data-cursor="play" onClick={playVideo} />
            )}
        </div>
    )
})