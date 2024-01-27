import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Form, Input, Select, Space, Row, Col, Table, Image, TablePaginationConfig, Modal, Tag, message } from 'antd/lib';
import dayjs from "dayjs"

import styles from './index.module.css';
import { getCategoryList, categoryDelete } from '@/api/category';
import { CategoryQueryType } from '@/type';
import Content from '@/components/Content';


//Category List table column header
const COLUMNS = [
  {
    title: 'Category Name',
    dataIndex: 'name',
    key: 'name',
    width: 150
  },
  {
    title: 'Level',
    dataIndex: 'level',
    key: 'level',
    render: (text: number) => {
      return <Tag color={text === 1 ? "green" : "blue"} >{`Level${text}`}</Tag>
    }
  },
  {
    title: 'Parent Category',
    dataIndex: 'parent',
    key: 'parent',
    render: (text: { name: string }) => {
      return text?.name ?? "-"
    }
  },
  {
    title: "Created Date",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 130,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
  }
];

//category level - constant
const LEVEL = {
  ONE: 1,
  TWO: 2
}
export const LEVEL_OPTIONS = [
  { label: "level 1", value: LEVEL.ONE },
  { label: "level 2", value: LEVEL.TWO }

]

export default function Category() {
  const router = useRouter()
  const [data, setData] = useState([])

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    total: 0
  })

  //fetch data
  async function fetchData(searchValues?: any) {
    const res = await getCategoryList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...searchValues
    })
    setData(res.data)
    setPagination({ ...pagination, total: res.total })
  }
  useEffect(() => {

    try {
      fetchData()
    } catch (error) {
      console.log(error);
    }
  }, [])


  const [form] = Form.useForm()
  const handleSearchFinish = async (values?: CategoryQueryType) => {

    const res = await getCategoryList({ ...values, current: 1, pageSize: pagination.pageSize })
    setData(res.data)
    setPagination({ ...pagination, current: 1, total: res.total })
  }

  //reset search form
  const handleSearchReset = () => {
    form.resetFields()
  }

  //goto category edit page according to book_id
  const handleCategoryEdit = (id: string) => {
    router.push(`/category/edit/${id}`)
  }

  //delete book according to book_id
  const handleCategoryDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure to delete this category？",
      okText: "Confirm",
      cancelText: "Cancel",
      async onOk() {
        await categoryDelete(id)
        message.success("Delete Category Success")

        fetchData(form.getFieldsValue())
      },
    })
  }

  //change pagination
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination)

    const query = form.getFieldsValue()
    getCategoryList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    })

  }

  //admin - edit/delete category action
  const columns = [...COLUMNS,
  {
    title: "",
    key: "action",
    render: (_: any, row: any) => {
      return <Space>
        <Button type='link' onClick={() => { handleCategoryEdit(row._id) }}>Edit</Button>
        <Button type='link' onClick={() => { handleCategoryDelete(row._id) }} danger>Delete</Button>
      </ Space>
    }
  }]

  return (
    <Content
      title="Category List"
      operation={
        // admin - add category
        <Button onClick={() => {
          router.push("/category/add")
        }}>
          Add Category
        </Button>
      }>

      {/* search form */}
      <Form
        name="search"
        form={form}
        // layout="inline"
        onFinish={handleSearchFinish}
        initialValues={{
          name: '',
          author: '',
          category: ''
        }}
      >
        {/* search form stay in the same line  */}
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item name="name" label="Category">
              <Input placeholder='enter category name' allowClear />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item name="level" label="Level">
              <Select
                showSearch
                allowClear
                placeholder='Select'
                options={LEVEL_OPTIONS}
              />
            </Form.Item>
          </Col>
          <Col span={6}>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
                <Button htmlType="submit" onClick={handleSearchReset}>
                  clean all
                </Button>
              </Space>
            </Form.Item>

          </Col>
        </Row>
      </Form>
      {/* Category List Form */}
      <div className={styles.tableWrap}>
        <Table
          dataSource={data}
          columns={columns}
          scroll={{ x: 1000 }}
          onChange={handleTableChange}
          pagination={{
            ...pagination,
            showTotal: () => `共${pagination.total}条`
          }
          } />
      </div>

    </Content>
  )
}
