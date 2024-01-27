import React, { useEffect, useState } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Image,
  message,
  Space
} from 'antd/lib';
import { bookAdd, bookUpdate } from '@/api/book';
import { BookType, CategoryType } from '@/type';
import { useRouter } from 'next/router';
import dayjs from 'dayjs'
import Content from '../Content';
import { getCategoryList } from '@/api/category';

const { TextArea } = Input;

export default function BookForm(
  { title, editData }:
    {
      title: string
      editData?: Partial<BookType>
    }) {

  const [form] = Form.useForm()
  //book cover preview
  const [cover, setCover] = useState("")
  const [preview, setPreview] = useState("")
  const router = useRouter()
  const [categoryList, setCategoryList] = useState<CategoryType[]>([])

  //render edit book data
  useEffect(() => {
    if (editData) {

      const data = {
        ...editData,
        category: editData.category ? (editData.category as unknown as CategoryType)._id : undefined,
        publishAt: editData.publishAt ? dayjs(editData.publishAt) : undefined
      }
      setCover(editData.cover as string)

      form.setFieldsValue(data)
      console.log(cover);
      form.setFieldValue("cover", cover)

    }

  }, [editData, form])

  //get categoryList
  useEffect(() => {
    getCategoryList({ all: true }).then((res) => {
      setCategoryList(res.data)
    })
  }, [])

  const handleFinish = async (values: BookType) => {

    try {
      //if has "publishAt" change it type to number
      if (values.publishAt) {
        values.publishAt = dayjs(values.publishAt).valueOf()
      }

      if (editData?._id) {
        //update edit book data
        await bookUpdate(editData._id, values)
        message.success("edit book success")
      } else {
        //create new book data
        await bookAdd(values)
        message.success("add book success")
      }
    } catch (error) {
      console.log(error)
    }

    //redirect to book list page
    router.push("/book")
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
          label="Book Name"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please enter Book Name'
            }
          ]}>
          <Input placeholder='Please enter book name' />
        </Form.Item>
        <Form.Item
          label="Author"
          name="author"
          rules={[
            {
              required: true,
              message: 'Please enter Author Name'
            }
          ]}>
          <Input placeholder='Please enter author name' />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[
            {
              required: true,
              message: 'Please enter Category'
            }
          ]}>
          <Select
            placeholder='Select category'
            options={categoryList.map(item => ({
              label: item.name,
              value: item._id
            }))}
          >
          </Select>
        </Form.Item>

        <Form.Item label="Book Cover" name="cover">
          <Space.Compact block>
            <Input
              placeholder='Please enter a image link'
              onChange={(e) => {
                setCover(e.target.value)
              }}
              style={{ width: "calc(100% - 64px)" }}
              value={cover}
            />

            <Button
              onClick={() => {
                setPreview(cover)
              }}>Preview</Button>
          </Space.Compact>
        </Form.Item>

        {
          preview && (
            <Form.Item>
              <Image src={preview} width={100} height={100} />
            </Form.Item>
          )
        }

        <Form.Item label="Publish Date" name="publishAt">
          <DatePicker />
        </Form.Item>

        <Form.Item label="Stock" name="stock">
          <InputNumber placeholder='Please enter stock' />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <TextArea rows={4} placeholder='Please enter book description' />
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            size='large'
            htmlType='submit'
            style={{ margin: "auto", display: "block" }}
          >
            {editData?._id ? "edit" : "create"}
          </Button>
        </Form.Item>
      </Form>
    </Content>
  )
}
