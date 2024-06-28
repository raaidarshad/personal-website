import { useState, useEffect } from 'react'

interface Bookmark {
    dateAdded: number;
    dateLastUsed: number;
    id: string;
    index: number;
    parentId: string;
    title: string;
    url: string;
}

export default function Gifts() {
  const [bookmarks, setBookmarks] = useState<Array<Bookmark>>([])
  const [isLoading, setLoading] = useState<boolean>(true)
 
  useEffect(() => {
    fetch('/api/gifts')
      .then((res) => res.json())
      .then((data) => {
        setBookmarks(data.message.data.children)
        setLoading(false)
      })
  }, [])
 
  if (isLoading) return <p>Loading...</p>
  if (bookmarks.length === 0) return <p>No data</p>
  return (
    <div>
        <ul>
      {bookmarks.map((bm) => {
        return <li key={bm.url}><a href={bm.url}>{bm.title}</a></li>
      })}
        </ul>
    </div>
  )
}