import { useRecommended } from "apis/useArticles";
import { ArticlesList } from "components/ArticlesList"
import { TimerButton } from "components/common/TimerButton"
import React, { useRef } from "react"
import { smoothScroll } from "utils/utils";
import styles from '../../../pages/Article.module.scss';
import stylesArticleList from '../../ArticlesList/ArticlesList.module.scss';
import stylesArticleListItem from '../../ArticlesListItem/ArticlesListItem.module.scss';

interface IArticleRecommended {
  current: string
  category: string
  data?: any
}

export const ArticleRecommended = ({current, category, data}:IArticleRecommended) => {

  const { articles, isLoading, isError } = useRecommended(current, category, 2, data);

  const recommendedList = data.length ? data : articles ? articles.data.map((item:any) => item.attributes) : [];
  const recommended = useRef<HTMLDivElement>(null);

  const scrollTo = (shift: number) => {

    
    
    if (!recommended.current) return;
    
    const articlesList = recommended.current.querySelector<HTMLElement>(`.${stylesArticleList.ArticlesList}`);
    if (!articlesList) return;
    
    const articlesListItem = recommended.current.querySelector<HTMLElement>(`.${stylesArticleListItem.ArticlesListItem}`);
    if (!articlesListItem) return;

    const currentScroll = articlesList.scrollLeft;
    const itemSize = articlesListItem.getBoundingClientRect().width;
    const gap = parseInt(window.getComputedStyle(articlesList).columnGap);
    const shiftStep = itemSize + gap;
    const func = shift > 0 ? Math.floor : Math.ceil;
    const newScroll = func((currentScroll + shiftStep * shift + (recommendedList.length / 2) * shift) / shiftStep) * shiftStep;
    smoothScroll(articlesList, currentScroll, Math.round(newScroll), 'left')
  }

  const onNextClick = () => {
      scrollTo(+1);
  }

  const onPrevClick = () => {
      scrollTo(-1);
  }

  if (isLoading) return <>Loading...</>;
  if (isError) return <>Error...</>;

  return (
    <>
      {recommendedList.length && (
        <div className={styles['ArticlePage-recommended']}>
          <div className={styles['ArticlePage-recommendedWrapper']}>
              <h2 className="text-h1">Recommended</h2>
              {
                  recommendedList.length > 2 ?
                      <div className={styles['ArticlePage-recommendedArrowsWrapper']}>
                          <div className={styles['ArticlePage-recommendedArrows']}>
                              <TimerButton direction={'left'} onClick={onPrevClick} isTimerActive={false} duration={0}/>
                              <TimerButton direction={'right'} onClick={onNextClick} isTimerActive={false} duration={0}/>
                          </div>
                      </div> 
                      : ''
              }
              <div className={styles['ArticlePage-recommendedContent']} ref={recommended}>
                  <ArticlesList data={recommendedList} scrollForDesktop={true} scrollForTablet={true}/>
              </div>
          </div>
        </div>
      )}
    </>
  )
}