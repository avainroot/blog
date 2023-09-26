import { Swiper, SwiperSlide } from 'swiper/react'
import styles from './Filter.module.scss'
import 'swiper/css';
import { FilterButton } from 'components/Filter/FilterButton';
import { FilterSearch } from 'components/Filter/FilterSearch';
import { useFilterContext } from 'context/filterContext';
import { FilterSelect } from './FilterSelect';
import { FilterItems, FilterSelectItems, IFilterItem } from './data';

export const Filter = () => {

  const { searchMode, category, setCategory } = useFilterContext();

  return (
    <Swiper
      className={styles.slider}
      spaceBetween={16}
      freeMode={true}
      slidesPerView={'auto'}
      observer={true}
      observeSlideChildren={true}
      observeParents={true}
      breakpoints={{
        1024: {
          spaceBetween: 16
        },
        768: {
          spaceBetween: 11
        }
      }}
      data-search={searchMode}
      noSwipingClass={'swiper-no-swiping'}
      onClick={(e)=>{
        e.clickedIndex === 5 && e.slideTo(e.clickedIndex)
      }}
    >
      <>
        <SwiperSlide
          className={`swiper-no-swiping ${styles.searchSlide}`}
        >
          <FilterSearch />
        </SwiperSlide>
        <SwiperSlide
          className={styles.slide}
        >
          <FilterButton 
            text={'All Categories'}
            choosed={`${!category.length}`}
            onClick={()=>{
              setCategory([])
              return
            }}
          />
        </SwiperSlide>
        {FilterItems.map(({text, value}: IFilterItem, i:number)=>{
          return (
            <SwiperSlide 
              key={i}
              className={styles.slide}
            >
              <FilterButton 
                text={text}
                choosed={`${category.includes(value)}`}
                onClick={()=>{
                  !category.includes(value) ? 
                  setCategory([value])
                  : setCategory(category.filter((i) => i !== value))
                }}
              />
            </SwiperSlide>
          )
        })}
        <SwiperSlide
          className={styles.slide}
        >
          <FilterSelect 
            items={FilterSelectItems}
          />
        </SwiperSlide>
      </>
    </Swiper>
  )
}