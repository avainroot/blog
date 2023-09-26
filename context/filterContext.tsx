import React, { Dispatch, SetStateAction, useState } from "react";
import { useContext } from "react";

interface IFilter {
  search: string | null
  category: string[]
  searchMode: boolean
  setSearch: Dispatch<SetStateAction<string | null>>
  setCategory: Dispatch<SetStateAction<string[]>>
  setSearchMode: Dispatch<SetStateAction<boolean>>
}

const FilterContext = React.createContext<IFilter>({
  search: null,
  category: [],
  searchMode: false,
  setSearch: () => {},
  setCategory: () => {},
  setSearchMode: () => {}
});

export const FilterContextProvider = ({ children }: any) => {

  const [search, setSearch] = useState<string | null>('');
  const [category, setCategory] = useState<string[]>([]);
  const [searchMode, setSearchMode] = useState<boolean>(false);

  return (
    <FilterContext.Provider value={{
      search: search,
      category: category,
      searchMode: searchMode,
      setSearch: setSearch,
      setCategory: setCategory,
      setSearchMode: setSearchMode
    }}>
      {children}
    </FilterContext.Provider>
  )
}

export const useFilterContext = () => useContext(FilterContext)