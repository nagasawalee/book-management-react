import React, { useEffect, useState } from 'react';
import CategoryForm from '@/components/CategoryForm';
import { useRouter } from 'next/router';
import { getCategoryDetail } from '@/api/category';
import { CategoryType } from '@/type';


export default function CategoryEdit() {

  const router = useRouter()
  const [data, setData] = useState({})

  //get edit category data from DB, render webpage
  useEffect(() => {

    const fetchData = async () => {
      const { query = {} } = router
      const { id } = query

      if (id) {
        const res = await getCategoryDetail(id as string)

        setData(res.data)
      }

    }
    fetchData()
  }, [router])

  return <CategoryForm title="Edit Category" editData={data as CategoryType} />
}
