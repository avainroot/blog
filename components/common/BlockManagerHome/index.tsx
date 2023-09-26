import React from 'react';
import { Banner } from 'components/Banner';
import { VideoGallery } from 'components/VideoGallery';
import { SubscribeBanner } from 'components/SubscribeBanner';
import homeStyles from '../../../pages/articles/home/Home.module.scss';

const getBlockComponent = (block: any) => {
  if (!block) return null;
  const name = block.__component.slice("blocks.".length);
  switch (name) {
    case "banner":
      return (
        <div className={homeStyles['HomePage-banner']} key={name+block.id}>
          <Banner data={block} />
        </div>
      );
    case "video-gallery-list":
      return (
        <div className={homeStyles['HomePage-videoGallery']} key={name+block.id}>
          <div className={homeStyles['HomePage-videoGalleryWrapper']}>
            <h1 className="text-h1">Videos</h1>
            <div className={homeStyles['HomePage-videoGalleryContent']}>
              <VideoGallery {...block} />
            </div>
          </div>
        </div>
      );
    case "subscribe-banner":
      return (
        <div className={homeStyles['HomePage-subscribeBanner']} key={name+block.id}>
          <SubscribeBanner {...block} />
        </div>
      );
    default:
      return null;
  }
};

const BlockManagerHome = ({ blocks }: any) => {
  return (
    <>
      {blocks.map((block: any) => {
        return getBlockComponent(block);
      })}
    </>
  );
};

BlockManagerHome.defaultProps = {
  blocks: [],
};

export default BlockManagerHome;
