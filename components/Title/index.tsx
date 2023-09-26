import styles from './Title.module.scss'
interface ITitle {
  text: string
}
export const Title = ({text}: ITitle) => {
  return <h1 className={`${styles.title} text-h1`}>{text}</h1>
}