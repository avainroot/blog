import React from "react";
import { ArticleBlockAudio } from "components/article/ArticleBlockAudio";
import { ArticleBlockText } from "components/article/ArticleBlockText";
import { ArticleBlockImage } from "components/article/ArticleBlockImage";
import { ArticleBlockHeader } from "components/article/ArticleBlockHeader";
import { ArticleBlockSubscribe } from "components/article/ArticleBlockSubscribe";
import { ArticleBlockQuote } from "components/article/ArticleBlockQuote";
import { ArticleBlockVideo } from "components/article/ArticleBlockVideo";
import { ArticleBlockGallery } from "components/article/ArticleBlockGallery";


const getBlockComponent = ({ id, __component, ...rest }: any, index: any, firstText = false) => {
  let Block;

  const name = __component.slice("article.".length);

  switch (name) {
    case "article-block-audio":
      Block = ArticleBlockAudio;
      break;
    case "article-block-text":
      Block = ArticleBlockText;
      break;
    case "article-block-image":
      Block = ArticleBlockImage;
      break;
    case "article-block-header":
      Block = ArticleBlockHeader;
      break;
    case "article-block-subscribe":
      Block = ArticleBlockSubscribe;
      break;
    case "article-block-quote":
      Block = ArticleBlockQuote;
      break;
    case 'article-block-video':
      Block = ArticleBlockVideo;
      break;
    case 'article-block-gallery':
      Block = ArticleBlockGallery;
      break;
  }



  return Block ? <Block key={`index-${index}`} {...rest} test firstText={firstText} /> : null;
};

const BlockManager = ({ blocks }: any) => {

  const firstText = blocks.find(({__component}: any)=>{
    return __component.slice("article.".length) === 'article-block-text'
  })

  return <div>{blocks.map((item: any, index: any) => {
    return getBlockComponent(item, index, firstText && item.text === firstText.text)
  })}</div>;
};

BlockManager.defaultProps = {
  blocks: [],
};

export default BlockManager;
