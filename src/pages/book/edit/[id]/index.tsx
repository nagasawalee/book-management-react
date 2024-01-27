import React, { useEffect, useState } from 'react';
import BookForm from '@/components/BookForm';
import { useRouter } from 'next/router';
import { getBookDetail } from '@/api/book';


export default function BookEdit() {
  const router = useRouter()
  const [data, setData] = useState({})

  //get edit book data from DB, render webpage
  useEffect(() => {

    const fetchData = async () => {
      const { query = {} } = router
      const { id } = query

      if (id) {
        const res = await getBookDetail(id as string)

        setData(res.data)
      }

    }
    fetchData()
  }, [router])
  return <BookForm title='Edit Book' editData={data} />
}
