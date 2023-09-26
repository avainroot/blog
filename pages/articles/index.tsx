/* eslint-disable react-hooks/exhaustive-deps */
import { ArticlesAPI, PageArticlesAPI, useArticlesPage, useLazyArticles } from "apis/useArticles";
import { ArticlesList } from "components/ArticlesList";
import delve from 'dlv';
import styles from './Articles.module.scss'
import { useEffect, useState } from "react";
import { paths } from "utils/links";
import { fetcher } from "utils/utils";
import { SWRConfig } from "swr";
import Head from "next/head";
import { abbrURL } from "context/appContext";
import { Title } from "components/Title";
import { Filter } from "components/Filter";

export async function getServerSideProps(context: any) {
  const abbreviations = await fetcher(abbrURL);
  const articles = await fetcher(ArticlesAPI);
  const articlesPage = await fetcher(PageArticlesAPI);
  return {
    props: {
      prevPage: context.req.headers.referer ? new URL(context.req.headers.referer).pathname : null,
      fallback: {
        [abbrURL]: abbreviations,
        [ArticlesAPI]: articles,
        [PageArticlesAPI]: articlesPage
      }
    }
  }
}

const Articles = ({ prevPage }: any) => {

  const { articles, size, setSize, isLoading } = useLazyArticles();
  const { pageData } = useArticlesPage();
  const seo = delve(pageData, "data.attributes.seo");
  const [moreLoading, setMoreLoading] = useState<boolean>(false);
  const pagination = delve(articles, 'meta.pagination', false);
  const listData = articles.data.map((article: any) => article.attributes)


  const onViewMoreClick = () => {
    setMoreLoading(true);
    setSize(size + 1);
  }

  useEffect(()=>{
    !isLoading && setMoreLoading(false)
  },[isLoading])

  useEffect(()=>{
    if((prevPage === paths.home) && articles) {
      // @ts-ignore
      document.querySelectorAll('.App-loader animate')[0].beginElement()
    }
  }, [])

  return (
      <main className={`${styles.PostsPage} page`}>
          <Head>
            {!seo ? (
              <>
                <title>Articles</title>
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
              <Title text="Articles" />
              <Filter />
              {isLoading && !moreLoading ? (
                <div className='preloader'></div>
              ):
                listData.length ? (
                  <div className={styles['PostsPage-articlesWrapper']}>
                      <div className={styles['PostsPage-articlesContent']}>
                          <ArticlesList data={listData} scrollForDesktop={false} scrollForTablet={false}/>
                      </div>
                      {
                          pagination.total > listData.length && (
                              isLoading && moreLoading ? (
                                  <div className='preloader'></div>
                              ):(
                                  <button className={`btn-white-with-border ${styles['PostsPage-articlesLink']}`} onClick={onViewMoreClick}>View more</button>
                              )
                          )
                      }
                  </div>

                ): (
                  <div>No articles...</div>
                )}
              
          </div>
      </main>
  )
}

export default function ArticlesPage({ fallback, prevPage }: any) {
  return (
    <SWRConfig value={{ fallback }}>
      <Articles prevPage={prevPage} />
    </SWRConfig>
  )
}