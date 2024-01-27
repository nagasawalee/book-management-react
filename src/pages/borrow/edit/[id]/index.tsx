import React, { useEffect, useState } from 'react';
import BorrowForm from '@/components/BorrowForm';
import { useRouter } from 'next/router';
import { getBorrowDetail } from '@/api/borrow';


export default function BorrowEdit() {

  const router = useRouter()

  const [editData, setEditData] = useState()

  //get edit borrow record data from DB, render webpage
  useEffect(() => {

    if (router.query.id) {
      getBorrowDetail(router.query.id as string).then(res => {
        setEditData(res.data)
      })
    }

  }, [router.query.id])


  return <BorrowForm title='Edit Borrow' editData={editData} />
}
