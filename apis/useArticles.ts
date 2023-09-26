import { fetcher, getBaseUrl } from "utils/utils";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import qs from "qs";
import { useFilterContext } from "context/filterContext";

export const articlesURL = `${getBaseUrl()}/articles`;

function useRecommended(current: string, category: string, limit?: number, recommended?: any) {
  const query = qs.stringify(
    {
      filters: {
        category: category,
        $not: {
          slug: current
        }
      },
      sort: ['publishAt:desc'],
      pagination: {
        start: 0,
        limit: limit || 5
      },
      populate: {
        authorEntity: {
          populate: '*'
        },
        featuredPicture: {
          populate: '*'
        },
        previewPicture: {
          populate: '*'
        },
      }
    },
    { encodeValuesOnly: true } // prettify URL
  );

  const { data, error } = useSWR(recommended ? `${articlesURL}?${query}`:null, fetcher);

  return {
    articles: data,
    isLoading: !error && !data,
    isError: error,
  };
}

const queryFeatured = qs.stringify(
  {
    filters: {
      isFeatured: true
    },
    sort: ['publishAt:desc'],
    pagination: {
      start: 0,
      limit: 3
    },
    populate: {
      authorEntity: {
        populate: '*'
      },
      featuredPicture: {
        populate: '*'
      },
      previewPicture: {
        populate: '*'
      },
    }
  },
  { encodeValuesOnly: true } // prettify URL
);

export const FeaturedAPI = `${articlesURL}?${queryFeatured}`;

function useFeatured() {
  const { data, error } = useSWR(FeaturedAPI, fetcher);
  return {
    articles: data,
    isLoading: !error && !data,
    isError: error,
  };
}

const queryLazyArticles = (search?: string | null, category?: string[] | null) => {
  return qs.stringify(
    {
      filters: {
        $or: [
          {
            title: {
              $containsi: search || null,
            }
          },
          {
            previewDescription: {
              $containsi: search || null,
            }
          }
        ],
        category: {
          $in: category,
        },
      },
      sort: ['publishAt:desc'],
      populate: {
        authorEntity: {
          populate: '*'
        },
        featuredPicture: {
          populate: '*'
        },
        previewPicture: {
          populate: '*'
        },
      }
    },
    { encodeValuesOnly: true } // prettify URL
  );
} 

const limitLazyArticles = 10;

export const ArticlesAPI = `${articlesURL}?pagination[pageSize]=${limitLazyArticles}&pagination[page]=0&${queryLazyArticles()}`;

function useLazyArticles() {
  const { search, category } = useFilterContext();

  const getKey = (pageIndex: number) => {
    if (pageIndex === 0) return `${articlesURL}?pagination[pageSize]=${limitLazyArticles}&pagination[page]=0&${queryLazyArticles(search, category)}`

    return `${articlesURL}?pagination[pageSize]=${limitLazyArticles}&pagination[page]=${pageIndex + 1}&${queryLazyArticles(search, category)}`
  }

  const { data, error, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher);


  let articles: any = {
    data: [],
    meta: {}
  };

  data?.map(({data, meta}, index: number) => {
    articles = { 
      data: [...articles.data, ...data],
      meta: meta
    };
    return false;
  })

  return {
    articles: articles,
    isLoading: isValidating,
    size: size,
    setSize: setSize,
    isError: error
  };
}

const queryHomeArticles = qs.stringify(
  {
    sort: ['publishAt:desc'],
    pagination: {
      start: 0,
      limit: 4
    },
    populate: {
      authorEntity: {
        populate: '*'
      },
      featuredPicture: {
        populate: '*'
      },
      previewPicture: {
        populate: '*'
      },
    }
  },
  { encodeValuesOnly: true } // prettify URL
);

export const HomeArticlesAPI = `${articlesURL}?${queryHomeArticles}`;

function useArticles() {

  const { data, error } = useSWR(HomeArticlesAPI, fetcher);

  return {
    articles: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export const queryArticle = (
  id: string | null | undefined, 
  preview: string | undefined
) => {
  return qs.stringify({
    publicationState: preview ? 'preview' : 'live',
    filters: {
      slug: id
    },
    populate: {
      authorEntity: {
        populate: '*'
      },
      altAuthorEntity: {
        populate: '*'
      },
      previewPicture: {
        populate: '*'
      },
      backgroundImage: {
        populate: '*'
      },
      blocks: {
        populate: {
          coverPicture: {
            populate: '*'
          },
          picture: {
            populate: '*'
          },
          photo: {
            populate: '*'
          },
          file: {
            populate: '*'
          },
          ArticleBlockImage: {
            populate: '*'
          }
        }
      },
      recommended: {
        populate: {
          authorEntity: {
            populate: '*'
          },
          previewPicture: {
            populate: '*'
          },
        },
      },
      seo: {
        populate: '*'
      },
    },
  }, { encodeValuesOnly: true });
}


function useArticle(id: string | null | undefined, preview: string | undefined) {

  const { data, error, mutate } = useSWR(`${articlesURL}/?${queryArticle(id, preview)}`, fetcher);

  return {
    article: data && { data: data.data[0] },
    response: data,
    mutateArticle: mutate,
    isLoading: !error && !data,
    isError: error,
  };
}

const articlesPageUrl = `${getBaseUrl()}/blog-articles`;

const queryPageArticles = qs.stringify(
  {
    populate: {
      seo: {
        populate: '*'
      }
    }
  },
  { encodeValuesOnly: true } // prettify URL
);

export const PageArticlesAPI = `${articlesPageUrl}?${queryPageArticles}`;

export function useArticlesPage() {
  const { data, error } = useSWR(PageArticlesAPI, fetcher);
  return {
    pageData: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export { useArticle, useArticles, useFeatured, useLazyArticles, useRecommended };
