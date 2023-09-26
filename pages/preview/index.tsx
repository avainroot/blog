import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";

const Preview = ({params}:any) => {
  
  let router = useRouter();

  useEffect(
    ()=>{
      params.secret === process.env.NEXT_PUBLIC_PREVIEW_SECRET ?
      router.push(`/preview/${params.slug}`) : false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ,[router])

  return <></>
}

export async function getServerSideProps(context: any) {
  return {
    props: {
      params: context.query
    }
  }
}

export default Preview