import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Select,
  message
} from 'antd/lib';
import { BookType, BorrowBookOptionType, BorrowType, UserType } from '@/type';
import { useRouter } from 'next/router';
import dayjs from 'dayjs'
import Content from '../Content';
import { getBookList } from '@/api/book';
import { getUserList } from '@/api/user';
import { borrowAdd } from '@/api/borrow';


export default function BorrowForm(
  { title, editData }:
    {
      title: string
      editData?: Partial<BorrowType>
    }) {

  const [form] = Form.useForm()
  const [bookList, setBookList] = useState([])
  const [userList, setUserList] = useState([])
  const [stock, setStock] = useState(0)


  //get BookList UserList
  useEffect(() => {
    getBookList().then((res) => {
      setBookList(res.data)
    })
    getUserList().then((res) => {
      setUserList(res.data)
    })
  }, [])

  const router = useRouter()

  const handleFinish = async (values: BorrowType) => {
    try {
      //create new borrow data
      await borrowAdd({ ...values, borrowAt: dayjs().valueOf() })
      message.success("Add Borrow Success")
    } catch (error) {
      console.log(error);
    }
    //redirect to borrow list page
    router.push("/borrow")
  }

  //book stock change according to book
  const handleBookChange = (value: string, option: BorrowBookOptionType | BorrowBookOptionType[]) => {
    console.log(option);
    setStock((option as BorrowBookOptionType).stock)
  }


  return (
    <Content title={title}>

      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        layout="horizontal"
        onFinish={handleFinish}
      >

        <Form.Item
          label="Borrow Book Name"
          name="borrowBook"
          rules={[
            {
              required: true,
              message: 'Please enter book name'
            }
          ]}>
          <Select
            showSearch
            optionFilterProp="label"
            placeholder='Select book'
            onChange={handleBookChange}
            options={bookList.map((item: BookType) => ({
              label: item.name,
              value: item._id as string,
              stock: item.stock
            }))}

          > </Select>
        </Form.Item>

        <Form.Item
          label="Borrow User Name"
          name="borrowUser"
          rules={[
            {
              required: true,
              message: 'Please enter user'
            }
          ]}>
          <Select
            options={userList.map((item: UserType) => ({
              label: item.nickName,
              value: item._id
            }))}
            placeholder='Select user'

          > </Select>
        </Form.Item>

        <Form.Item
          label="Stock"
          name="stock"
        >
          {stock}
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            size='large'
            htmlType='submit'
            disabled={stock <= 0} //can not borrow book when out of stock
            style={{ margin: "auto", display: "block" }}
          >
            submit
          </Button>
        </Form.Item>
      </Form>
    </Content>
  )
}