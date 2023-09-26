import axios from 'axios';
import React from 'react';
import Image, { StaticImageData } from 'next/image'

let lastId = 0;
let prevAnimationFrame: ReturnType<typeof requestAnimationFrame> = 0;


const generateUUID = () => {
  lastId++;
  return String(lastId);
}

const isValidEmail = (email: string): boolean => {
  const regExpEmailformat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regExpEmailformat.test(email);
}

const smoothScroll = (el: HTMLElement, currentScroll: number, targetPos: number, direction: string) => {
  let per = 0;
  const speed = 0.05;

  cancelAnimationFrame(prevAnimationFrame);

  const easeOutQuad = (t: number, b: number, c: number, d: number) => {
    return -c * (t /= d) * (t - 2) + b;
  }

  const scroll = () => {
    per = Math.min(per + speed, 1);
    let current = easeOutQuad(per, currentScroll, targetPos - currentScroll, 1);
    el.scroll({ [direction]: current });
    if (per < 1) {
      prevAnimationFrame = requestAnimationFrame(scroll);
    }
  }

  scroll();
}

const eventBus = {
  on(event: string, callback: Function) {
    document.addEventListener(event, (e: any) => callback(e.detail));
  },
  dispatch(event: string, data: any) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  remove(event: string, callback: any) {
    document.removeEventListener(event, callback);
  },
};

const fetcher = (url: string) => axios.get(url).then(res => res.data)

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL
}

const getSubscribeUrl = () => { 
    return process.env.NEXT_PUBLIC_SUBSCRIBE_API
}

const linkParse = (text: string) => {
  return text.replaceAll('<a', '<a target="_blank" ');
}

const firstLetter = (text: string) => {
  return text.replace(/<p>([^<\s]+)/, function (matched) {
    return matched.replace(' ', '').replace(/<p>([A-z])/, '<p><mark>$1</mark>')
  })
}

const stopwords = 'a an and at but by for in nor of on or so the to yet'

interface IAbWords {
  [key: string]: string
}

let abwords: IAbWords = {
  "gssa": "GSSA", 
  "icpc": "ICPC", 
  "start-up": "Start-Up",
  "stem": "STEM",
  "utcc": "UTCC",
  "mipt": "MIPT",
  "b2b": "B2B",
  "b2c": "B2C",
  "cern": "CERN",
  "ui": "UI",
  "ux": "UX",
  "q&a": "Q&A",
  "ceo": "CEO",
  "seo": "SEO",
  "dj": "DJ",
  "offf": "OFFF",
  "swerc": "SWERC",
  "uber": "UBER",
  "paypa": "PayPal"
}

interface ITitleCase {
  stopwords: any[]
  keepSpaces: boolean
}

function titleCase(str: string, abbreviations?: any[], options?: ITitleCase) {

  let abbrSet:IAbWords = {};
  let abbr = abbreviations?.length ? abbreviations.map(({attributes}:any)=>attributes.text): [];

  abbr.forEach((element) => {
    abbrSet[element.toLowerCase()] = element;
  });

  abwords = {...abwords, ...abbrSet};

  const defaults = stopwords.split(' ')
  const opts = options || undefined

  if (!str) return ''

  const stop = opts?.stopwords || defaults
  const splitter = /(“[^”]+”|"[^"]+"|'[^']+'|\s+|!+|[-‑–—]|\.)/

  return str
    .split(splitter)
    .map((word: any, index: any, all: any) => {

      word = word.toLowerCase()

      if (
        index !== 0 &&
        index !== all.length - 1 &&
        stop.includes(word.toLowerCase())
      ) {
        return word.toLowerCase()
      }

      return abwords[word] ? abwords[word] : (
        word.match(/\s+/) ? capitalizeQuote(word) : capitalize(word)
      )
    })
    .join('')
}

function capitalize(str: any) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function capitalizeQuote(str: any) {
  return str[0] + str.charAt(1).toUpperCase() + str.slice(2)
}

interface IResponsiveIMG {
  [key: string]: any
}

function responsiveIMG(formats: IResponsiveIMG | false, className?: string, alt?: string, props?: any) {

  const BASE_URL = process.env.NEXT_PUBLIC_URL;
  let sizes: string = '';
  let imgProps = props;

  if(props && !props.priority) {
    imgProps = {...imgProps, ...{
      loading: 'lazy'
    }}
  } 
  if(props && props.priority) {
    imgProps = {...imgProps, ...{
      priority: props.priority
    }}
  }

  if(formats) {
    let i: number = 0;
    let img: any;
    for (let size in formats) {
      if(!i) { img = formats[size] } i++
      sizes += `${i > 0 ? ', ' : ''}${BASE_URL}${formats[size].url} ${formats[size].width}w`; i++
    }

    return img && <Image {...imgProps} className={className} src={`${BASE_URL}${img.url}`} alt={alt || ''} width={img.width} height={img.height} />
  }

  return <Image {...imgProps} className={className} alt={alt} />

}

export { isValidEmail, eventBus, generateUUID, smoothScroll, fetcher, getBaseUrl, firstLetter, titleCase, getSubscribeUrl, linkParse, responsiveIMG };
 