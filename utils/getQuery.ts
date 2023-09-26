import qs from "qs";
import getStrapiURL from "./getStrapiUrl";

// const qs = require('qs')

// Function that fetch the content from Strapi:
/**
 * url: String, ex: nav-link
 * keys: string[], ex: ["Links", "Logos"]
 * */
export default async function getQuery(
  url: string,
  keys: string | string[],
  locale: string | undefined
) {
  // Object for the query string
  let obj: any = {};
  switch (keys) {
    case "*":
      obj = "*";
      break;
    default:
      if (typeof keys !== "string") {
        // eslint-disable-next-line array-callback-return
        keys?.map((key: string) => {
          obj[key] = { populate: "*" };
        });
      }
      break;
  }

  const populate = qs.stringify({ populate: obj }, { encodeValuesOnly: true });

  const res = await fetch(
    `${getStrapiURL()}/api/${url}?${populate}&locale=${locale}`
  );
  const data = await res.json();
  // eslint-disable-next-line no-return-await
  return await data;
}
