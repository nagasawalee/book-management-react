import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Form, Select, Space, Row, Col, Table, Tag, TablePaginationConfig, Modal, message } from 'antd/lib';
import dayjs from "dayjs"

import styles from './index.module.css';
import { getBorrowList, borrowDelete, borrowBack } from '@/api/borrow';
import { BookType, BorrowQueryType, BorrowType, UserType } from '@/type';
import Content from '@/components/Content';
import { getBookList } from '@/api/book';
import { getUserList } from '@/api/user';
import { BORROW_STATUS, USER_ROLE } from '@/constants';
import { useCurrentUser } from '@/utils/hooks';

//admin - all users borrow records
//user - can only access to themselves

//Borrow Records List table column header
const COLUMNS = [
  {
    title: 'Book Name',
    dataIndex: 'borrowBook',
    key: 'borrowBook',
    width: 150
  },

  {
    title: 'Borrow Status',
    dataIndex: 'status',
    key: 'status',
    width: 80,
    render: (text: string) =>
      text === BORROW_STATUS.ON ? (
        <Tag color="red">Borrowed</Tag>
      ) : (
        <Tag color="green">Returned</Tag>
      )
  },
  {
    title: 'User',
    dataIndex: 'borrowUser',
    key: 'borrowUser',
    width: 80
  },
  {
    title: "Borrow Date",
    dataIndex: "borrowAt",
    key: "borrowAt",
    width: 130,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
  },
  {
    title: "Return Date",
    dataIndex: "backAt",
    key: "backwAt",
    width: 130,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
  }
];

//borrow status - constant
const STATUS_OPTION = [
  { label: "Borrowed", value: BORROW_STATUS.ON },
  { label: "Returned", value: BORROW_STATUS.OFF }
]


export default function Borrow() {
  const router = useRouter()
  const { user } = useCurrentUser()
  const [form] = Form.useForm()
  const [bookList, setBookList] = useState<BookType[]>([]);
  const [userList, setUserList] = useState<UserType[]>([]);

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    total: 0
  })
  const [data, setData] = useState([])


  // fetch data
  //admin - all users borrow records
  //user - can only access to themselves
  async function fetchData(searchValues?: any) {

    let query = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...searchValues,
    }

    const res = await getBorrowList(
      (user?.role === USER_ROLE.USER) ?
        {
          ...query,
          borrowUser: user?._id
        } : query
    )

    //reformat original data
    const borrowData = res.data.map((item: BorrowType) => ({
      ...item,
      borrowBook: item.borrowBook.name,
      borrowUser: item.borrowUser.nickName,
    }))

    setData(borrowData)
    setPagination({ ...pagination, total: res.total })
  }

  useEffect(() => {
    fetchData()
  }, [])



  //get booklist & userlist
  useEffect(() => {
    getBookList({ all: true }).then((res) => {
      setBookList(res.data)
    })
    getUserList({ all: true }).then((res) => {
      setUserList(res.data)
    })

  }, [])

  const handleSearchFinish = async (values?: BorrowQueryType) => {
    fetchData(values)
  }

  //清空输入框
  const handleSearchReset = () => {
    form.resetFields()
  }

  //return book according to borrow_id
  const handleBorrowBack = (id: string) => {
    Modal.confirm({
      title: "Are you sure to return this book?",
      okText: "Confirm",
      cancelText: "Cancel",
      async onOk() {
        await borrowBack(id)
        message.success("Return Book Success")

        fetchData(form.getFieldsValue())
      }
    })
  }

  //delete borrow record according to borrow_id
  const handleBorrowDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure to delete this borrow record？",
      okText: "Confirm",
      cancelText: "Cancel",
      async onOk() {
        await borrowDelete(id)
        message.success("Delete Borrow Record Success")
        //update data
        fetchData(form.getFieldsValue())
      },
    })
  }

  //change pagination
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination)
    const query = form.getFieldsValue()
    getBorrowList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    })
  }

  //admin - return book/delete borrow record action
  const columns = user?.role === USER_ROLE.ADMIN ?
    [...COLUMNS, {
      title: "",
      key: "action",
      render: (_: any, row: any) => {
        return <Space align='baseline'>

          <Button
            type='link'
            disabled={row.status === BORROW_STATUS.OFF}
            onClick={() => { handleBorrowBack(row._id) }}>
            {row.status === BORROW_STATUS.OFF ? "Returned" : "Return"}
          </Button>

          <Button type='link' onClick={() => { handleBorrowDelete(row._id) }} danger>Delete</Button>
        </ Space>
      }
    }] : COLUMNS

  return (
    <Content
      title="Borrow Record"
      operation={
        // admin - add borrow record
        user?.role === USER_ROLE.ADMIN &&
        <Button onClick={() => {
          router.push("/borrow/add")
        }}>
          Add Borrow
        </Button>
      }>

      {/* search form  */}
      <Form
        name="search"
        form={form}
        // layout="inline"
        onFinish={handleSearchFinish}
        initialValues={{
          borrowBook: '',
          borrowUser: '',
          status: ''
        }}
      >
        {/* search form stay in the same line */}
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item name="borrowBook" label="Book Name">
              <Select
                allowClear
                placeholder='Select Book'
                options={bookList.map((item) => ({
                  label: item.name,
                  value: item._id
                }))}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item name="status" label="Status">
              <Select
                allowClear
                placeholder='Select'
                options={STATUS_OPTION}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="borrowUser" label="User"  >
              {
                user?.role === USER_ROLE.ADMIN ? (
                  <Select
                    allowClear
                    placeholder='Select User'
                    options={userList.map((item) => ({
                      label: item.nickName,
                      value: item._id
                    }))}
                  />
                ) : (
                  user?.nickName
                )}

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
      {/* Borrow Records List Form */}
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
