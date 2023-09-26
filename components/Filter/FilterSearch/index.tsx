import styles from './FilterSearch.module.scss';
import SearchIcon from 'images/SearchOutlined.svg';
import CloseIcon from 'images/iconClose.svg';
import { useEffect, useRef, useState } from 'react';
import { useFilterContext } from 'context/filterContext';
import { useRouter } from 'next/router';
import { paths } from 'utils/links';

export const FilterSearch = () => {

  const { search, setSearch, searchMode, setSearchMode, setCategory } = useFilterContext();
  const ref = useRef<any>();

  const handleSubmit = (e: any) => {
    e.preventDefault();
  }

  return (
    <form 
      className={styles.search} data-show={searchMode}
      onSubmit={handleSubmit}
    >
      <div className={styles.wrapper}>
        <div 
          onClick={()=>{
            setSearchMode(!searchMode) 
            setTimeout(()=>{
              ref.current.focus();
            },300)
          }}
          className={styles['search-button']}
        >
          <SearchIcon />
        </div>
        <input 
          ref={ref}
          type={'text'}
          value={search || ''}
          placeholder={'Search'}
          onChange={(e)=>{
            setSearch(e.target.value)
            setCategory([]);
          }}
        />
        <div 
          onClick={()=>{
            setSearchMode(!searchMode);
            setSearch(null);
          }}
          className={styles['search-close']}
        >
          <CloseIcon />
        </div>
      </div>
      <div 
        className={styles['search-close_text']}
        onClick={()=>{
          setSearchMode(!searchMode);
          setCategory([]);
          setSearch(null);
        }}
      >Cancel</div>
    </form>
  )
}

export const FilterSearchMobile = ({onClose}:any) => {

  const { setSearch, setCategory, searchMode, setSearchMode } = useFilterContext();
  const router = useRouter();
  const [value, setValue] = useState<string>('');
  const ref = useRef<any>();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSearchMode(true);
    setSearch(ref.current.value);
    setCategory([]);
    setValue('');
    onClose();
    router.push(paths.articles);
  }

  return (
    <form
      className={styles['search-mobile']}
      onSubmit={handleSubmit}
    >
      <div className={styles.wrapper}>
        <div 
          onClick={handleSubmit}
          className={styles['search-button']}
        >
          <SearchIcon />
        </div>
        <input
          ref={ref} 
          type={'text'}
          value={value}
          placeholder={'Search'}
          onChange={(e)=>{
            setValue(e.target.value)
            setCategory([]);
          }}
        />
      </div>
    </form>
  )
}