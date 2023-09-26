import { PagePodcastsAPI, PodcastsAPI, useLazyPodcasts, usePodcastsPage } from "apis/usePodcasts";
import { PodcastsList } from "components/PodcastsList";
import { abbrURL } from "context/appContext";
import Head from "next/head";
import { SWRConfig } from "swr";
import { fetcher } from "utils/utils";
import styles from 'pages/articles/Articles.module.scss';
import homeStyles from 'pages/articles/home/Home.module.scss';
import podcastsStyles from './Podcasts.module.scss';
import { SubscribeBanner } from "components/SubscribeBanner";
import delve from 'dlv';
import { useEffect, useState } from "react";
import { PodcastsListItemMain } from "components/PodcastsListItem/PodcastTop";

export async function getServerSideProps(context: any) {
  const abbreviations = await fetcher(abbrURL);
  const podcasts = await fetcher(PodcastsAPI);
  const podcastsPage = await fetcher(PagePodcastsAPI);
  return {
    props: {
      fallback: {
        [abbrURL]: abbreviations,
        [PodcastsAPI]: podcasts,
        [PagePodcastsAPI]: podcastsPage
      }
    }
  }
}

const Podcasts = () => {
  const { podcasts, size, setSize, isLoading } = useLazyPodcasts();
  const { pageData } = usePodcastsPage();

  const seo = delve(pageData, "data.attributes.seo");

  const pagination = delve(podcasts, 'meta.pagination', false);
  const [moreLoading, setMoreLoading] = useState<boolean>(false);
  
  const onViewMoreClick = () => {
    setMoreLoading(true);
    setSize(size + 1);
  }

  useEffect(()=>{
    !isLoading && setMoreLoading(false)
  },[isLoading])

  return (
    <main className={`${styles.PostsPage} page`}>
      <Head>
        {!seo ? (
          <>
            <title>Podcasts</title>
          </>
        ):(
          <>
            <title>{seo.metaTitle}</title>
            <meta name="description" content={seo.metaDescription} />
            <meta property="og:title" content={seo.metaTitle} />
            <meta property="og:description" content={seo.metaDescription} />
            <meta property="og:image" content={`${process.env.NEXT_PUBLIC_URL}${seo.metaImage.data.attributes.url}`} />
          </>
        )}
      </Head>
      <div className={styles['PostsPage-articles']}>
        <PodcastsListItemMain />
        {podcasts.data.length > 0 && ( <>
          <div className={styles['PostsPage-articlesWrapper']}>
            <div className={podcastsStyles['PodcastsPage-podcastsContent']}>
              <PodcastsList {...podcasts} />
              {
                pagination.total > podcasts.data.length && (
                    isLoading && moreLoading ? (
                        <div className='preloader'></div>
                    ):(
                        <button className={`btn-white-with-border ${styles['PostsPage-articlesLink']}`} onClick={onViewMoreClick}>Load more episodes</button>
                    )
                )
              }
            </div>
          </div>
        </>)}
        {/* <div className={homeStyles['HomePage-subscribeBanner']}>
          <SubscribeBanner photo={null} title={''}/>
        </div> */}
      </div>
    </main>
  )
}

export default function PodcastsPage({ fallback, prevPage }: any) {
  return (
    <SWRConfig value={{ fallback }}>
      <Podcasts />
    </SWRConfig>
  )
}