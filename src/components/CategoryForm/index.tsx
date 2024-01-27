import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  message,
} from 'antd/lib';
import { categoryAdd, categoryUpdate } from '@/api/category';
import { CategoryType } from '@/type';
import { useRouter } from 'next/router';
import Content from '../Content';
import { LEVEL_OPTIONS } from '@/pages/category';
import { getCategoryList } from '@/api/category';


export default function CategoryForm(
  { title, editData }:
    {
      title: string
      editData?: CategoryType
      // editData?: Partial<CategoryType>
    }) {

  const [form] = Form.useForm()
  const [level, setLevel] = useState(1)
  const [levelOneList, setLevelOneList] = useState<CategoryType[]>([])
  const router = useRouter()

  //render edit category data
  useEffect(() => {
    if (editData) {
      setLevel(editData.level)
      form.setFieldsValue({ ...editData })
    }

  }, [editData, form])

  const handleFinish = async (values: CategoryType) => {

    try {
      if (editData?._id) {
        //update edit category data
        //if change level2 to level1, delete its parent category
        const levelOneValues = { ...values, parent: null as unknown as CategoryType }
        await categoryUpdate(editData._id, level === 1 ? levelOneValues : values)
        message.success("Edit Category Success")
      } else {
        //create new bcategoryook data
        await categoryAdd(values)
        message.success("Add Category Success")
      }
    } catch (error) {
      console.log(error);
    }
    //redirect to category list page
    router.push("/category")
  }

  //get level1 category list
  useEffect(() => {
    async function fetchData() {
      const res = await getCategoryList({ all: true, level: 1 })
      setLevelOneList(res.data)
    }
    fetchData()
  }, [])

  //update levelOneList
  const levelOneOptions = useMemo(() => {
    return levelOneList.map((item) => (
      {
        label: item.name,
        value: item._id
      }
    )
    )
  }, [levelOneList])

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
          label="Category"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please enter category'
            }
          ]}>
          <Input placeholder='Please enter category' />
        </Form.Item>

        <Form.Item
          label="Level"
          name="level"
          rules={[
            {
              required: true,
              message: 'Please enter level'
            }
          ]}>
          <Select
            options={LEVEL_OPTIONS}
            placeholder='Select level'
            onChange={(value) => {
              setLevel(value)
            }}
          > </Select>
        </Form.Item>

        {/* when level2, select its parent category */}
        {level === 2 &&
          <Form.Item
            label="Parent Category"
            name="parent"
            rules={[
              {
                required: true,
                message: 'Please enter parent category'
              }
            ]}>
            <Select options={levelOneOptions} placeholder='Select parent category'>

            </Select>
          </Form.Item>
        }

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