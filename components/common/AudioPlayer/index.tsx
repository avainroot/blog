/* eslint-disable react/display-name */
import React, { useRef, useState, useEffect, memo } from 'react';
import styles from './AudioPlayer.module.scss';

interface IAudioPlayerProps {
    source: string
    title: string
    mini?: boolean
}

export const AudioPlayer = memo(({ source, title, mini = false }: IAudioPlayerProps) => {
    const audio = useRef<HTMLAudioElement>(null);
    const scrubber = useRef<HTMLInputElement>(null);
    const spectrum = useRef<HTMLCanvasElement>(null);
    const spectrumCtx = useRef<any>(null);
    const svgProgressPath = useRef<SVGPathElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isScrubbing, setIsScrubbing] = useState(false);
    const [mediaTime, setMediaTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const perTop = useRef(0);
    const perMiddle = useRef(0);
    const analyser = useRef<any>(null);
    const dataArray = useRef<any>([]);
    const dataArraySecondary = useRef<any>([]);
    const resizeData = useRef({width: 0, height: 0, dpi: 1});
    const prevAnimationFrame = useRef<ReturnType<typeof requestAnimationFrame>>(0);
    const scrubbingTimeout: { current: ReturnType<typeof setTimeout> | null} = useRef<ReturnType<typeof setTimeout>>(null);
    const pauseTimeout: { current: ReturnType<typeof setTimeout> | null} = useRef<ReturnType<typeof setTimeout>>(null);

    const togglePlaying = () => {
        setIsPlaying(!isPlaying);

        if (!audio.current) return;

        isPlaying ? audio.current.pause() : audio.current.play();

        if (audio.current && !analyser.current) {
            const context = new window.AudioContext();
            const src = context.createMediaElementSource(audio.current);
            analyser.current = context.createAnalyser();
            analyser.current.minDecibels = -90;
            analyser.current.maxDecibels = -10;
            analyser.current.smoothingTimeConstant = 0.65;
            src.connect(analyser.current);
            analyser.current.connect(context.destination);
            analyser.current.fftSize = 256;
            const bufferLength = analyser.current.frequencyBinCount;
            dataArray.current = new Uint8Array(bufferLength);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(()=> {
        
        function testList() {
            if(audio.current)
            setDuration(Math.round(audio.current.duration * 1000))
        }
        
        if (audio.current) {
            const player = audio.current;
            setDuration(Math.round(audio.current.duration * 1000));
    
            player.addEventListener('loadeddata', testList);
    
            return () => {
                player.removeEventListener('loadeddata', testList);
            };
        }

    },[audio])

    const downSample = (data: Uint8Array, count: number) => {
        let st = 0;
        const ed = data.length - 1;
        const len = (ed - st) + 1;
        const bins = Array(count).fill(0);

        const step = (count - 1) / (len - 1);
        let ind = 0;
        while (st <= ed + 0.000001) {
            const curInd = Math.floor(ind);
            const nextInd = Math.min(curInd + 1, count - 1);
            const per = ind - curInd;
            const stVal = data[st];

            bins[curInd] += stVal * (1 - per);
            bins[nextInd] += stVal * (per);

            st += 1;
            ind += step;
        }

        return bins.map(item => item * (count / len) / 255);
    }

    const drawSpectrum = () => {
        if (!spectrum.current || !spectrumCtx.current) return;

        const w = resizeData.current.width;
        const h = resizeData.current.height;
        const dpi = resizeData.current.dpi;

        if (!w) return;

        const bw = h > 64 ? 4 : 3;
        const bo = h > 64 ? 5 : 3;
        const minH1 = h > 64 ? 24 : 16;
        const minH2 = h > 64 ? 40 : 32;
        const minRange1 = minH1 / h;
        const minRange2 = minH2 / h;
        const barsCount = Math.floor((w + bo) / (bw + bo));
        let samples, i;

        if (analyser.current) {
            analyser.current.getByteFrequencyData(dataArray.current);
            samples = downSample(dataArray.current, barsCount);
        } else {
            samples = Array(barsCount).fill(0);
        }

        spectrumCtx.current.clearRect(0, 0, w * dpi, h * dpi);

        let x = bw / 2;
        spectrumCtx.current.strokeStyle = "#CAC6EB";
        spectrumCtx.current.lineWidth = bw * dpi;
        spectrumCtx.current.lineCap = 'round';
        spectrumCtx.current.beginPath();

        for (i = 0; i < barsCount; i++) {
            const prev = dataArraySecondary.current[i];
            dataArraySecondary.current[i] = prev > samples[i] ? Math.max(prev - 0.01, 0) : samples[i];

            const barHeight = (dataArraySecondary.current[i] * (1 - minRange2) + minRange2) * h;

            spectrumCtx.current.moveTo(x * dpi, (h / 2 + barHeight / 2) * dpi);
            spectrumCtx.current.lineTo(x * dpi, (h / 2 - barHeight / 2) * dpi);

            x += bw * dpi + bo * dpi;
        }

        spectrumCtx.current.stroke();

        x = bw / 2;
        spectrumCtx.current.strokeStyle = "#685DC5";
        spectrumCtx.current.beginPath();

        for (i = 0; i < barsCount; i++) {
            const barHeight = (samples[i] * (1 - minRange1) + minRange1) * h;

            spectrumCtx.current.moveTo(x * dpi, (h / 2 + barHeight / 2) * dpi);
            spectrumCtx.current.lineTo(x * dpi, (h / 2 - barHeight / 2) * dpi);

            x += bw * dpi + bo * dpi;
        }

        spectrumCtx.current.stroke();
    }

    const updateProgress = () => {
        if (!audio.current) return;

        const mediaTimeInner = Math.floor(audio.current.currentTime * 1000);

        setMediaTime(mediaTimeInner);

        if (!svgProgressPath.current) return;

        const target = mediaTimeInner / duration;
        const perTopInner = perTop.current + (target - perTop.current) * (isScrubbing ? 0.07 : 1);
        const perMiddleInner = perMiddle.current + (target - perMiddle.current) * (isScrubbing ? 0.11 : 1);

        perTop.current = perTopInner;
        perMiddle.current = perMiddleInner;
        svgProgressPath.current.setAttribute('d', `M0 0 L${10 * perTopInner} 0 Q ${10 * perMiddleInner} 1 ${10 * perTopInner} 2 L 0 2 Z`);

        drawSpectrum();
    }

    const updateProgressLoop = () => {
        prevAnimationFrame.current = requestAnimationFrame(updateProgressLoop);
        updateProgress();
    }

    const onPlay = () => {
        cancelAnimationFrame(prevAnimationFrame.current);

        clearTimeout(pauseTimeout.current as ReturnType<typeof setTimeout>);

        updateProgressLoop();

        setIsPlaying(true);
    };

    const onPause = () => {
        if (!isScrubbing) {
            pauseTimeout.current = setTimeout(() => {
                cancelAnimationFrame(prevAnimationFrame.current);
            }, 1500);
        }

        setIsPlaying(false);
    };

    const onScrubberChange = () => {
        if (!audio.current || !scrubber.current) return;

        const playhead = parseFloat(scrubber.current.value);

        setMediaTime(playhead);

        cancelAnimationFrame(prevAnimationFrame.current);

        updateProgressLoop();

        audio.current.currentTime = playhead / 1000;
    };

    const formatTime = (time: number, addHours: boolean): string => {
        time = Math.floor(time / 1000);
        return new Date(time * 1000).toISOString().substr(addHours ? 11 : 14, addHours ? 8 : 5);
    }

    const onScrubberPointerDown = () => {
        if (!audio.current) return;

        clearTimeout(scrubbingTimeout.current as ReturnType<typeof setTimeout>);

        setIsScrubbing(true);

        audio.current.pause();
    }

    const onScrubberPointerUp = () => {
        clearTimeout(scrubbingTimeout.current as ReturnType<typeof setTimeout>);

        scrubbingTimeout.current = setTimeout(() => {
            setIsScrubbing(false);

            updateProgress();
        }, 600);

        if (!audio.current) return;

        audio.current.play();
    }

    const onResize = () => {
        if (!spectrum.current) return;

        resizeData.current.width = spectrum.current.offsetWidth;
        resizeData.current.height = spectrum.current.offsetHeight;
        resizeData.current.dpi = window.devicePixelRatio;

        spectrum.current.width = resizeData.current.width * resizeData.current.dpi;
        spectrum.current.height = resizeData.current.height * resizeData.current.dpi;

        if (dataArraySecondary.current) {
            dataArraySecondary.current = Array(100).fill(0);
        }

        drawSpectrum();
    }

    useEffect(() => {
        if (spectrum.current) {
            spectrumCtx.current = spectrum.current.getContext('2d');
        }

        window.addEventListener('resize', onResize);

        onResize();

        return () => {
            window.removeEventListener('resize', onResize);

            clearTimeout(scrubbingTimeout.current as ReturnType<typeof setTimeout>);

            clearTimeout(pauseTimeout.current as ReturnType<typeof setTimeout>);

            cancelAnimationFrame(prevAnimationFrame.current);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={`${styles.AudioPlayer} ${mini ? styles['AudioPlayer-mini'] : ''}`}>
            <div className={styles['AudioPlayer-panel']}>
                <div className={styles['AudioPlayer-progress']}>
                    <svg version="1.1" viewBox="0 0 10 2" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                        <path ref={svgProgressPath} fill="rgb(208,205,236)"></path>
                    </svg>
                </div>
                <input
                    ref={scrubber}
                    type="range"
                    value={mediaTime}
                    min={0}
                    max={duration || 0}
                    onMouseDown={onScrubberPointerDown}
                    onMouseUp={onScrubberPointerUp}
                    onTouchStart={onScrubberPointerDown}
                    onTouchEnd={onScrubberPointerUp}
                    onChange={onScrubberChange}
                />
                <button className={`${styles['AudioPlayer-play']} ${isPlaying ? styles.isPlaying: ''}`} onClick={togglePlaying}></button>

                <div className={styles['AudioPlayer-controls']}>
                    <div className={`${styles['AudioPlayer-controlsTop']} ${styles['AudioPlayer-contolsText']}`}></div>
                    <div className={styles['AudioPlayer-controlsSpectrum']}>
                        <canvas ref={spectrum}/>
                    </div>
                    <div className={styles['AudioPlayer-controlsBottom']}>
                        <div className={`${styles['AudioPlayer-controlsTitle']} ${styles['AudioPlayer-contolsText']}`}>{title}</div>
                        {duration && (
                            <div className={`${styles['AudioPlayer-controlsTime']} ${styles['AudioPlayer-contolsText']}`}>
                            {formatTime(mediaTime, duration / 1000 >= 3600)} - {formatTime(duration, duration/ 1000 >= 3600)}</div>
                        )}
                    </div>
                </div>

            </div>

            <audio
                crossOrigin="anonymous"
                ref={audio}
                src={source || '/'}
                controls
                onPlay={onPlay}
                onPause={onPause}
            />
        </div>
    )
})