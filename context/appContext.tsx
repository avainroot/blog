import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { fetcher, getBaseUrl } from "utils/utils";

type ArticleInfo = {
  id: number | null
  slug: string | null
  preview: string | undefined
} | null
interface IAppContext {
  abbr: any[]
  article: ArticleInfo
  setArticle: Dispatch<SetStateAction<ArticleInfo>>
  featuredIsLoaded: boolean
  setFeaturedLoaded: Dispatch<SetStateAction<boolean>>
}

const AppContext = React.createContext<IAppContext>({
  abbr: [],
  article: null,
  setArticle: () => {},
  featuredIsLoaded: false,
  setFeaturedLoaded: () => {}
});

export const abbrURL = `${getBaseUrl()}/abbreviations`;

export const AppContextProvider = ({ children }: any) => {

  const { asPath } = useRouter();

  const [ featured, setFeatured ] = useState<boolean>(false);
  const [ claps, setClaps ] = useState<number | null>(0);
  const [ articleInfo, setArticleInfo ] = useState<ArticleInfo>(null);
  const { data } = useSWR(`${abbrURL}`, fetcher);

  return (
    <AppContext.Provider value={{
      abbr: data?.data,
      article: articleInfo,
      setArticle: setArticleInfo,
      featuredIsLoaded: featured,
      setFeaturedLoaded: setFeatured
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)