import React, { useEffect, useState } from 'react';
import UserForm from '@/components/UserForm';
import { useRouter } from 'next/router';
import { getUserDetail } from '@/api/user';


export default function UserEdit() {

  const router = useRouter()
  const [data, setData] = useState({})

  //get edit user data from DB, render webpage
  useEffect(() => {

    const fetchData = async () => {
      const { query = {} } = router
      const { id } = query

      if (id) {
        const res = await getUserDetail(id as string)

        setData(res.data)
      }

    }
    fetchData()
  }, [router])


  return <UserForm title='Edit User' editData={data} />
}
