import qs from "qs";
import { fetcher, getBaseUrl } from "utils/utils";
import useSWRInfinite from "swr/infinite";
import useSWR from "swr";

const podcastsPageUrl = `${getBaseUrl()}/blog-podcasts`;

const queryPagePodcasts = qs.stringify(
  {
    populate: {
      seo: {
        populate: '*'
      }
    }
  },
  { encodeValuesOnly: true } // prettify URL
);

export const PagePodcastsAPI = `${podcastsPageUrl}?${queryPagePodcasts}`;

export function usePodcastsPage() {
  const { data, error } = useSWR(PagePodcastsAPI, fetcher);
  return {
    pageData: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export const podcastsURL = `${getBaseUrl()}/podcasts`;

const queryLazyPodcasts = () => {
  return qs.stringify(
    {
      sort: ['publishAt:desc'],
      populate: {
        audio: {
          populate: '*'
        },
        cover: {
          populate: '*'
        },
        thumbnail: {
          populate: '*'
        }
      }
    },
    { encodeValuesOnly: true }
  );
} 

const limitLazyPodcasts = 10;

export const PodcastsAPI = `${podcastsURL}?pagination[pageSize]=${limitLazyPodcasts}&pagination[page]=0&${queryLazyPodcasts()}`;

export function useLazyPodcasts() {

  const getKey = (pageIndex: number) => {
    if (pageIndex === 0) return `${podcastsURL}?pagination[pageSize]=${limitLazyPodcasts}&pagination[page]=0&${queryLazyPodcasts()}`

    return `${podcastsURL}?pagination[pageSize]=${limitLazyPodcasts}&pagination[page]=${pageIndex + 1}&${queryLazyPodcasts()}`
  }

  const { data, error, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher);


  let podcasts: any = {
    data: [],
    meta: {}
  };

  data?.map(({data, meta}: any, index: number) => {
    podcasts = { 
      data: [...podcasts.data, ...data],
      meta: meta
    };
    return false;
  })

  return {
    podcasts: podcasts,
    isLoading: isValidating,
    size: size,
    setSize: setSize,
    isError: error
  };
}

export const PodcastsTopAPI = `${podcastsURL}?pagination[limit]=1&${queryLazyPodcasts()}`;

export function usePodcast() {

  const { data, error, mutate } = useSWR(PodcastsTopAPI, fetcher);

  return {
    podcast: data && data.data[0].attributes,
    response: data,
    mutateArticle: mutate,
    isLoading: !error && !data,
    isError: error,
  };
}