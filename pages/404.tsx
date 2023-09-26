import Image from "next/image";
import { paths } from "utils/links";
import ConfirmationIcon from 'images/confirmation.png';
import styles from './404.module.scss';
import { useRouter } from "next/router";

export default function Page404() {
  
  let router = useRouter();

  const handleClick = () => {
    router.push(paths.home)
  }

  return (
      <main className={styles.Page404}>
          <Image loading="lazy" src={ConfirmationIcon} alt="Error"/>
          <h1 className="text-h1">Page not found</h1>
          <p className="text-medium">This page does not exist.</p>
          <button onClick={handleClick} className="btn-white-with-border">Go to home page</button>
      </main>
  )
}