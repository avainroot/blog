import { FeaturedAPI, HomeArticlesAPI, useArticles } from 'apis/useArticles';
import { HomeAPI, useHome } from 'apis/useHome';
import { abbrURL, useAppContext } from 'context/appContext';
import Head from 'next/head'
import deleve from 'dlv';
import styles from '././Home.module.scss'
import { FeaturedGallery } from 'components/FeaturedGallery';
import { ArticlesList } from 'components/ArticlesList';
import Link from 'next/link';
import BlockManagerHome from 'components/common/BlockManagerHome';
import { paths } from 'utils/links';
import { SWRConfig } from 'swr';
import { fetcher } from 'utils/utils';

export async function getServerSideProps() {
  const abbreviations = await fetcher(abbrURL);
  const featured = await fetcher(FeaturedAPI);
  const articles = await fetcher(HomeArticlesAPI);
  const home = await fetcher(HomeAPI);
  return {
    props: {
      fallback: {
        [abbrURL]: abbreviations,
        [FeaturedAPI]: featured,
        [HomeArticlesAPI]: articles,
        [HomeAPI]: home
      }
    }
  };
}

const Home = () => {
  const { articles, isLoading, isError } = useArticles();
  const { homeData } = useHome();
  const { featuredIsLoaded } = useAppContext();

  if (!homeData.data.attributes) return <div>Loading...</div>;
  if (isLoading) return <>Loading...</>;
  if (isError) return <>Error...</>;
  const blocks = deleve(homeData, "data.attributes.blocks");
  const seo = deleve(homeData, "data.attributes.seo");
  const { data } = articles;

  const articlesDataAttributes = data.map((article: any) => article.attributes);

  return (
    <main className="HomePage page">
      <Head>
        {!seo ? (
          <>
            <title>Blog</title>
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
      <FeaturedGallery />
      {featuredIsLoaded && (
        <>
          <div className={styles['HomePage-articles']}>
            <div className={styles['HomePage-articlesWrapper']}>
              <h1 className="text-h1">Latest Articles</h1>
              <div className={styles['HomePage-articlesContent']}>
                <div className={styles['HomePage-articlesPattern']}>
                  <div className={styles['HomePage-articlesPatternAspect']}></div>
                </div>
                <ArticlesList
                  data={articlesDataAttributes.slice(0, 4)}
                  scrollForDesktop={false}
                  scrollForTablet={true}
                />
              </div>
              <Link
                href={paths.articles}
                className={`btn-white-with-border ${styles['HomePage-articlesLink']}`}
              >
                View all articles
              </Link>
            </div>
          </div>
          <BlockManagerHome blocks={blocks} />
        </>
      )}
    </main>
  )
}

export default function HomePage({ fallback }: any) {
  return (
    <SWRConfig value={{ fallback }}>
      <Home />
    </SWRConfig>
  )
}