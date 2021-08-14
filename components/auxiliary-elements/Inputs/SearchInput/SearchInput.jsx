import Image from 'next/image'
import s from './SearchInput.module.css'
import { useIntl } from '../../../../hooks-utils/useIntl'
import { useRouter } from 'next/router'
import { useState, useRef } from 'react'
import { LoadInputCompleteRec } from '../../../../api/api'
import SearchInputRecDropdown from './SearchInputRecDropdown'

export default function SearchInput({ inputRef }) {
  const { f } = useIntl()
  const router = useRouter()
  const { query } = router.query
  const [searchInputVal, setSearchInputVal] = useState('')
  const [searchInputRec, setSearchInputRec] = useState([])
  const [isSearchInputRecOpened, setIsSearchInputRecOpened] = useState(false)
  const searchInputWrapper = useRef()

  const loadRecomendation = async (value) => {
    if (value.replace(/\s/g, '').length && query !== value) {
      const { result } = await LoadInputCompleteRec({ call: 1, query: value })
      setSearchInputRec(result)
      if (result?.length) {
        setIsSearchInputRecOpened(true)
      } else {
        setIsSearchInputRecOpened(false)
      }
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchInputVal.replace(/\s/g, '')?.length && query !== searchInputVal) {
      router.push(`/${encodeURI(searchInputVal)}?p=1`)
      setIsSearchInputRecOpened(false)
    }
  }

  const handleSearchonChange = (e) => {
    e.target.value === '' && setIsSearchInputRecOpened(false)
    setSearchInputVal(e.target.value)
    loadRecomendation(e.target.value)
  }
  const search_input_rec_classes = isSearchInputRecOpened
    ? `${s.search_wrapper} ${s.search_wrapper__opened_rec}`
    : s.search_wrapper

  return (
    <div className={s.search_input_rec} ref={searchInputWrapper}>
      <form
        autoComplete="off"
        onSubmit={handleSearchSubmit}
        className={search_input_rec_classes}
      >
        <label className={s.searchIcon__wrapper} htmlFor="searchInputVal">
          <Image
            src="/images/searchIcon.svg"
            width={30}
            height={30}
            alt="cxcvb search"
          />
        </label>
        <input
          ref={inputRef}
          id="searchInputVal"
          className={s.search_wrapper__input}
          type="text"
          placeholder={f('search') + '(0)'}
          value={searchInputVal}
          onChange={handleSearchonChange}
          maxLength="50"
        />
      </form>
      {searchInputRec.length && isSearchInputRecOpened ? (
        <SearchInputRecDropdown
          searchInputRec={searchInputRec}
          isSearchInputRecOpened={isSearchInputRecOpened}
          setIsSearchInputRecOpened={setIsSearchInputRecOpened}
          setSearchInputVal={setSearchInputVal}
          searchInputWrapper={searchInputWrapper}
        />
      ) : null}
    </div>
  )
}
