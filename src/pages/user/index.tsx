import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Form, Input, Select, Space, Row, Col, Table, Tag, TablePaginationConfig, Tooltip, Modal, message } from 'antd/lib';
import dayjs from "dayjs"

import styles from './index.module.css';
import { getUserList, userDelete, userUpdate } from '@/api/user';
import { UserQueryType, CategoryType, UserType } from '@/type';
import Content from '@/components/Content';
import { getCategoryList } from '@/api/category';
import { USER_STATUS } from '@/constants';

//User List table column header
const COLUMNS = [

  {
    title: 'User Account',
    dataIndex: 'name',
    key: 'name',
    width: 150
  },
  {
    title: 'User Nickname',
    dataIndex: 'nickName',
    key: 'nickName',
    width: 150
  },

  {
    title: 'User Status',
    dataIndex: 'status',
    key: 'status',
    width: 80,
    render: (text: string) =>
      text === USER_STATUS.ON ? (
        <Tag color="green">Enable</Tag>
      ) : (
        <Tag color="red">Disable</Tag>
      )
  },
  {
    title: "Create Date",
    dataIndex: "createAt",
    key: "createAt",
    width: 130,
    render: (text: string) => dayjs(text).format("YYYY-MM-DD"),
  },
];

//user status - constant
const STATUS_OPTION = [
  { label: "Enable", value: USER_STATUS.ON },
  { label: "Disable", value: USER_STATUS.OFF }
]


export default function Home() {
  const router = useRouter()
  const [form] = Form.useForm()

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    total: 0
  })
  const [data, setData] = useState([])

  //fetch data 
  async function fetchData(searchValues?: any) {
    const res = await getUserList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...searchValues
    })

    console.log(res.data);

    setData(res.data)
    setPagination({ ...pagination, total: res.total })
  }
  useEffect(() => {
    fetchData()
  }, [])


  const handleSearchFinish = async (values?: UserQueryType) => {

    const res = await getUserList({ ...values, current: 1, pageSize: pagination.pageSize })
    setData(res.data)
    setPagination({ ...pagination, current: 1, total: res.total })
  }

  //reset search form
  const handleSearchReset = () => {
    form.resetFields()
  }

  //goto user edit page according to user_id
  const handleUserEdit = (id: string) => {
    router.push(`/user/edit/${id}`)
  }

  //delete user according to user_id
  const handleUserDelete = (id: string) => {
    Modal.confirm({
      title: "Are you sure to delete this user",
      okText: "Confirm",
      cancelText: "Cancel",
      async onOk() {
        await userDelete(id)
        message.success("Delete User Success")

        fetchData(form.getFieldsValue())
      },
    })
  }

  //change user status
  const handleUserStatus = async (row: UserType) => {
    const status = row.status === USER_STATUS.ON ? USER_STATUS.OFF : USER_STATUS.ON
    await userUpdate(row._id!, {
      ...row,
      status
    })
    fetchData(form.getFieldsValue())
  }

  //change pagination
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination)

    const query = form.getFieldsValue()
    getUserList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    })

  }

  //admin - edit/delete user action
  const columns = [...COLUMNS,
  {
    title: "",
    key: "action",
    render: (_: any, row: any) => {
      return <Space>
        <Button type='link' onClick={() => { handleUserEdit(row._id) }}>Edit</Button>
        {/* change button according to user_status */}
        <Button
          type='link'
          danger={row.status === USER_STATUS.ON ? true : false}
          onClick={() => { handleUserStatus(row) }}
        >
          {row.status === USER_STATUS.ON ? "Disable" : "Enable"}
        </Button>
        <Button type='link' onClick={() => { handleUserDelete(row._id) }} danger>Delete</Button>
      </ Space>
    }
  }]

  return (
    <Content
      title="User List"
      operation={
        // admin - add user
        <Button onClick={() => {
          router.push("/user/add")
        }}>
          Add User
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
        {/* search form stay in the same line */}
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item name="name" label="User Account">
              <Input placeholder='enter user account' allowClear />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item name="nickName" label="User Nickname">
              <Input placeholder='enter user nickname' allowClear />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item name="status" label="User Status">
              <Select
                allowClear
                placeholder='Select'
                options={STATUS_OPTION}
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
      {/* User List Form */}
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
