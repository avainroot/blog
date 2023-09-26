import { useFilterContext } from 'context/filterContext';
import { useEffect, useRef, useState } from 'react';
import { IFilterItem } from '../data';
import { FilterButton } from '../FilterButton';
import styles from './FilterSelect.module.scss';
import Drop from 'images/arrowDown.svg';
import Cancel from 'images/cancel.svg';
import { useSwiper } from 'swiper/react';

interface IFilterSelect {
  items: IFilterItem[]
}

export const FilterSelect = ({items}: IFilterSelect) => {

  const { category, setCategory, setSearch, searchMode } = useFilterContext();
  const [visible, setVisible] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  const swiper = useSwiper();

  useEffect(()=>{
    swiper.update()
  },[category, swiper])

  useEffect(()=>{
    searchMode && swiper.slideTo(0)
  },[searchMode, swiper])

  const itemsArr = items.map(({value})=>value);

  function containsSelect(){
    for(var i=0; i<items.length; i++){
      if(category.includes(items[i].value)) {
        return true;
      }
    }
    return false;
  }

  function cleanSelect(){
    return category.filter((item)=>{
      return !itemsArr.includes(item)
    })
  }

  useEffect(()=>{
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setVisible(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  },[ref])

  return (
    <div ref={ref} className={styles.select} data-show={visible}>
      <FilterButton
        text={
          category.filter((item)=>itemsArr.includes(item))[0] || `By Programme`
        }
        choosed={`${containsSelect()}`}
        icon={containsSelect()? <Cancel onClick={()=>setCategory(cleanSelect())} /> : <Drop />}
        onClick={()=>{
          setVisible(!visible)
        }}
      />
      <div className={styles.list}>
        {items.map(({text, value}:IFilterItem, i:number)=>{
          return (
            <div
              key={i}
              className={styles.item}
              data-choosed={category.includes(value)}
              onClick={()=>{
                !category.includes(value) ? setCategory([value]) : setCategory(category.filter((i) => i !== value));
                setVisible(!visible)
              }}
            >
              {text}
            </div>
          )
        })}
      </div>
    </div>
  )
}