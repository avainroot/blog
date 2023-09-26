/* eslint-disable react-hooks/exhaustive-deps */
import { articlesURL, queryArticle, useArticle } from "apis/useArticles";
import { abbrURL, useAppContext } from "context/appContext";
import { useEffect, useRef, useState } from "react";
import delve from 'dlv';
import { fetcher, smoothScroll, titleCase } from "utils/utils";
import { ArticleInfo } from "components/article/ArticleInfo";
import BlockManager from "components/common/BlockManager";
import { ArticleSharing } from "components/article/ArticleSharing";
import { ArticleRecommended } from "components/article/ArticleRecommended";
import styles from "./Article.module.scss";
import { SWRConfig } from "swr";
import Head from "next/head";
import { ArticleAboutAuthor } from "components/article/ArticleAboutAuthor";
import { useRouter } from "next/router";
import { BlogImg } from "components/common/BlogImg";

export async function getServerSideProps(context: any) {
  const prev = context.req.headers.referer;
  const preview = prev && new URL(context.req.headers.referer).searchParams.get('slug');
  const slug = context.query.slug[context.query.slug.length - 1];
  const endpoint = `${articlesURL}/?${queryArticle(slug, preview)}`;
  const abbreviations = await fetcher(abbrURL);
  const article = await fetcher(endpoint);
  return {
    props: {
      slug: slug,
      preview: preview || null,
      fallback: {
        [abbrURL]: abbreviations,
        [endpoint]: article
      }
    }
  };
}

export const Article = ({ preview, slug }: any) => {

  const router = useRouter();
  const el = useRef<HTMLDivElement>(null);
  const { abbr } = useAppContext();

  const { setArticle } = useAppContext();

  const [heroImageScale, setHeroImageScale] = useState(1);

  const { article, isLoading, isError } = useArticle(
    slug, preview
  );

  useEffect(()=>{
    setArticle({
      id: article.data.id, 
      slug: slug,
      preview: preview
    });
  },[router])

  useEffect(() => {
      document.documentElement.classList.add('hasActiveModals');
      const elSaved = el.current;

      if (elSaved) {
          elSaved.addEventListener('scroll', onPageScroll);
      }

      const revealContentTimeout = setTimeout(() => {
          if (el.current && el.current.scrollTop === 0 && window.innerWidth >= 768) {
              smoothScroll(el.current, 0, Math.round(window.innerHeight / 3), 'top');
          }
      }, 2000);

      return () => {
          document.documentElement.classList.remove('hasActiveModals');

          clearTimeout(revealContentTimeout);

          if (elSaved) {
              elSaved.removeEventListener('scroll', onPageScroll);
          }
      }
  }, []);

  if (isLoading && !article.data.attributes) return <>Loading...</>
  if (isError && !article.data.attributes) return <>Error...</>

  const recommendedList = delve(article, 'data.attributes.recommended.data', false) && delve(article, 'data.attributes.recommended.data')?.map((item: any) => item.attributes);

  const SEO = delve(article, 'data.attributes.seo');
  const category = delve(article, 'data.attributes.category');
  const articleData = delve(article, 'data.attributes');
  const backPic = delve(article, 'data.attributes.backgroundImage.data.attributes');
  const prevPic = delve(article, 'data.attributes.previewPicture.data.attributes');

  const author = delve(article, 'data.attributes.altAuthorEntity.data.attributes', false) || delve(article, 'data.attributes.authorEntity.data.attributes', false);
  const aboutAuthor = delve(article, 'data.attributes.aboutAuthor', false);

  const backgroundImage = backPic ? backPic : prevPic;

  const onPageScroll = () => {
      if (!el.current) return;
      const wh = window.innerHeight;
      const scale = 1 + Math.min(el.current.scrollTop / wh, 1) * 0.3;
      setHeroImageScale(scale);
  }

  const { data } = article

  const { blocks }: { blocks: any } = data.attributes;
  
  return (
    <main className={styles.ArticlePage} ref={el}>
      <Head>
        {!SEO ? (
          <>
            <title>{titleCase(article.data.attributes.title, abbr)}</title>
            <meta property="og:title" content={titleCase(article.data.attributes.title, abbr)} />
            <meta name="description" content={article.data.attributes.previewDescription} />
            <meta name="og:description" content={article.data.attributes.previewDescription} />
            <meta property="og:image" content={`${process.env.NEXT_PUBLIC_URL}${article.data.attributes.previewPicture.data.attributes.url}`} />
          </>
        ):(
          <>
            <title>{titleCase(SEO.metaTitle, abbr)}</title>
            <meta property="og:title" content={titleCase(SEO.metaTitle, abbr)} />
            <meta name="description" content={SEO.metaDescription} />
            <meta name="og:description" content={SEO.metaDescription} />
            {SEO.keywords && <meta name="keywords" content={SEO.keywords} />}
            <meta property="og:image" content={`${process.env.NEXT_PUBLIC_URL}${SEO.metaImage.data.attributes.url}`} />
          </>
        )}
      </Head>
      <div className={styles['ArticlePage-image']}>
          {backgroundImage &&
            <BlogImg
              src={backgroundImage.url}
              width={backgroundImage.width}
              height={backgroundImage.height}
              alt={article.data.attributes.title}
              style={{ transform: `scale(${heroImageScale})` }}
            />
          }
      </div>
      <div className={styles['ArticlePage-content']}>
          <ArticleInfo {...articleData} />
          {blocks && <BlockManager blocks={blocks} />}
          <ArticleSharing />
          {author && aboutAuthor && <ArticleAboutAuthor {...author} />}
          {slug && <ArticleRecommended data={recommendedList} current={slug} category={category} />}
      </div>
    </main>
  )
}

export default function ArticlePage({ fallback, slug, preview }: any) {
  return (
    <SWRConfig value={{ fallback }}>
      <Article 
        slug={slug} 
        preview={preview}
      />
    </SWRConfig>
  )
}