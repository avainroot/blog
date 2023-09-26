import Image, { ImageProps } from 'next/image';
export const BlogImg = (props: ImageProps) => {

  const src = !props.width ? props.src : `${process.env.NEXT_PUBLIC_URL}${props.src}`;

  return(
    <Image 
      {...{
        ...props,
        ...{
          quality: 100,
          sizes: '100vw',
          src: src
        }
      }} 
      alt={props.alt} 
    />
  )
}