import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Form, Input, Select, Space, Row, Col, Table, Image, TablePaginationConfig, Tooltip, Modal, message } from 'antd/lib';
import dayjs from "dayjs"

import styles from './index.module.css';
import { getBookList, bookDelete } from '@/api/book';
import { BookQueryType, CategoryType } from '@/type';
import Content from '@/components/Content';
import { getCategoryList } from '@/api/category';
import { useCurrentUser } from '@/utils/hooks';
import { USER_ROLE } from '@/constants';

//Book List table column header
const COLUMNS = [
  {
    title: 'Book Name',
    dataIndex: 'name',
    key: 'name',
    width: 150
  },
  {
    title: 'Cover',
    dataIndex: 'cover',
    key: 'cover',
    width: 100,
    render: (text: string) => {
      return <Image
        width={40}
        src={text}
        alt='' />
    }
  },
  {
    title: 'Author',
    dataIndex: 'author',
    key: 'author',
    width: 90
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    width: 90,
    render: (text: { name: "" }) => {
      return text?.name
    }
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: 180,
    //use tooltips show full description
    ellipsis: true,
    render: (text: string) => {
      return <Tooltip title={text} placement='topLeft'>
        {text}
      </Tooltip>
    }
  },
  {
    title: 'Stock',
    dataIndex: 'stock',
    key: 'stock',
    width: 80
  },
  {
    title: "Publish Date",
    dataIndex: "publishAt",
    key: "publishAt",
    width: 110,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
  },
  {
    title: "Create Date",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 110,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
  }
];


export default function Book() {
  const router = useRouter()
  const [form] = Form.useForm()
  //分页
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    total: 0
  })
  const [data, setData] = useState([])
  const [categoryList, setCategoryList] = useState<CategoryType[]>([])
  const { user } = useCurrentUser()


  //fetch data 
  async function fetchData(searchValues?: any) {
    const res = await getBookList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...searchValues
    })
    setData(res.data)

    setPagination({ ...pagination, total: res.total })
  }
  useEffect(() => {
    fetchData()
    //get categoryList

    getCategoryList({ all: true }).then((res) => {
      setCategoryList(res.data)
    })
    console.log(categoryList);
  }, [])

  const handleSearchFinish = async (values?: BookQueryType) => {

    //update data pagination
    const res = await getBookList({ ...values, current: 1, pageSize: pagination.pageSize })
    setData(res.data)
    setPagination({ ...pagination, current: 1, total: res.total })
  }
  //reset search form
  const handleSearchReset = () => {
    form.resetFields()
  }

  //goto book edit page according to book_id
  const handleBookEdit = (id: string) => {
    router.push(`/book/edit/${id}`)
  }

  //delete book according to book_id
  const handleBookDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure to delete this book?",
      okText: "Confirm",
      cancelText: "Cancel",
      async onOk() {
        await bookDelete(id)
        message.success("Delete Book Success")

        //update data
        fetchData(form.getFieldsValue())
      },
    })
  }

  //change pagination
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination)
    const query = form.getFieldsValue()
    getBookList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    })

  }

  //admin - edit/delete book action
  const columns = user?.role === USER_ROLE.ADMIN ?
    [...COLUMNS, {
      title: "",
      key: "action",
      render: (_: any, row: any) => {
        return <Space>
          <Button type='link' onClick={() => { handleBookEdit(row._id) }}>Edit</Button>
          <Button type='link' onClick={() => { handleBookDelete(row._id) }} danger>Delete</Button>
        </ Space>
      }
    }] : COLUMNS

  return (
    <Content
      title="Book List"
      operation={
        // admin - add book
        user?.role === USER_ROLE.ADMIN &&
        <Button
          onClick={() => {
            router.push("/book/add")
          }}>
          Add Book
        </Button>
      }
    >

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
        {/* search form stay in the same line */}
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item name="name" label="Book Name">
              <Input placeholder='enter book name' allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="author" label="Author">
              <Input placeholder='enter author' allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="category" label="Category">
              <Select
                showSearch
                allowClear
                placeholder='Select'
                options={categoryList.map(item => ({
                  label: item.name,
                  value: item._id
                }))}
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
      {/* Book List Form */}
      <div className={styles.tableWrap}>
        <Table
          dataSource={data}
          columns={columns}
          scroll={{ x: 1000 }}
          onChange={handleTableChange}
          pagination={{
            ...pagination,
            showTotal: () => `${pagination.total} result`
          }
          } />
      </div>

    </Content>
  )
}
