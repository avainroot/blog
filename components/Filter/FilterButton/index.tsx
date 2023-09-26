import { ButtonHTMLAttributes } from 'react'
import styles from './FilterButton.module.scss'

interface IFilterButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string,
  choosed: string,
  icon?: React.ReactNode
}

export const FilterButton = (props: IFilterButton) => {
  return (
    <button 
      className={`${styles.button} text-caption-small`}
      data-selected={props.choosed}
      {...props}
    >
      {props.text}
      {props.icon && (
        <div className={styles.icon}>{props.icon}</div>
      )}
    </button>
  )
}