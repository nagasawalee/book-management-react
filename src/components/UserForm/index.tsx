import React, { useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  Radio,
  message
} from 'antd/lib';
import { UserType } from '@/type';
import { useRouter } from 'next/router';
import Content from '../Content';
import { userAdd, userUpdate } from '@/api/user';
import { USER_ROLE, USER_STATUS } from '@/constants';
import { useCurrentUser } from '@/utils/hooks';


export default function UserForm(
  { title, editData = { role: USER_ROLE.USER } }:
    {
      title: string
      editData?: Partial<UserType>
    }) {

  const [form] = Form.useForm()
  const router = useRouter()
  const { user } = useCurrentUser()

  //render edit user data
  useEffect(() => {
    if (editData._id) {
      console.log(editData);
      form.setFieldsValue({ ...editData })

    }

  }, [editData, form])


  const handleFinish = async (values: UserType) => {

    try {
      if (editData?._id) {
        //update edit user data
        await userUpdate(editData?._id, values)
        message.success("Edit User Success")
      } else {
        //create new user data
        await userAdd(values)
        message.success("Add User Success")

      }
    } catch (error) {
      console.log(error);

    }
    //redirect
    user?.role === USER_ROLE.ADMIN ?
      //admin -> user list
      router.push("/user") :
      //user -> book list
      router.push("/book")
  }

  return (
    <Content title={title}>

      <Form
        form={form}
        initialValues={editData}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        layout="horizontal"
        onFinish={handleFinish}
      >

        <Form.Item
          label="User Account"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please enter user account'
            }
          ]}>
          <Input placeholder='Please enter user account' />
        </Form.Item>

        <Form.Item
          label="User Nickname"
          name="nickName"
          rules={[
            {
              required: true,
              message: 'Please enter user nickname'
            }
          ]}>
          <Input placeholder='Please enter user nickname' />
        </Form.Item>

        <Form.Item
          label="password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please set password'
            }
          ]}>
          <Input.Password placeholder="input password" />
        </Form.Item>

        <Form.Item
          label="gender"
          name="gender"
        >
          <Radio.Group>
            <Radio value="male">male</Radio>
            <Radio value="female">female</Radio>
            <Radio value="other">other</Radio>
          </Radio.Group>
        </Form.Item>


        <Form.Item label="Role" name="role">
          <Radio.Group disabled={user?.role === USER_ROLE.USER}>
            <Radio value={USER_ROLE.USER}>user</Radio>
            <Radio value={USER_ROLE.ADMIN}>admin</Radio>
          </Radio.Group>
        </Form.Item>


        <Form.Item label="User Status" name="status">
          <Radio.Group disabled={user?.role === USER_ROLE.USER}>
            <Radio value={USER_STATUS.ON}>Enable</Radio>
            <Radio value={USER_STATUS.OFF}>Disable</Radio>
          </Radio.Group>
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
    </Content >
  )
}