import { fetcher, getBaseUrl } from "utils/utils";
import useSWR from "swr";
import qs from "qs";

export const homeURL = `${getBaseUrl()}/blog-home`;

const queryHome = qs.stringify(
  {
    populate: {
      author: {
        populate: '*',
      },
      blocks: {
        populate: {
          backgroundImage: {
            populate: '*',
          },
          videoGalleryItem: {
            populate: '*'
          }
        },
      },
      seo: {
        populate: '*'
      }
    }
  },
  { encodeValuesOnly: true } // prettify URL
);

export const HomeAPI = `${homeURL}?${queryHome}`

function useHome() {
  const { data, error } = useSWR(HomeAPI, fetcher);
  return {
    homeData: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export { useHome };
