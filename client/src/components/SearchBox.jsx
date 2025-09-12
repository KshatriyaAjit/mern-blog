import React, { useState } from 'react'
import { Input } from './ui/input'
import { useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'

const SearchBox = () => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-md mx-auto"
    >
      {/* Search Icon inside input */}
      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm" />

      <Input
        placeholder="Search..."
        className="h-10 w-full pl-10 pr-4 rounded-full 
                   bg-gray-50 dark:bg-gray-800 
                   border border-gray-300 dark:border-gray-600 
                   text-gray-700 dark:text-gray-200 
                   placeholder-gray-400 dark:placeholder-gray-500 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   transition-all"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  )
}

export default SearchBox
