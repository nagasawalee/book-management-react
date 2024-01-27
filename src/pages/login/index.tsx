import React from 'react';
import { Button, Form, Input, message } from 'antd/lib';
import styles from "./index.module.css"
import { login } from '@/api/user';

import { useRouter } from 'next/router';
import Image from 'next/image'


export default function Login() {
  const router = useRouter()

  const handleFinish = async (values: { name: string; password: string }) => {
    try {
      const res = await login(values)

      //console.log(res);

      //Login success
      if (res.success) {
        message.success("login success")

        //store current login user data at Localstorege
        localStorage.setItem("user", JSON.stringify(res.data))
        router.push("/book")
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Image
          src="open-book-icon.svg"
          width={130}
          height={140}
          alt="" />
      </div>
      <h3 className={styles.title}>Book Management System</h3>
      <Form onFinish={handleFinish}>
        <Form.Item
          label="Username"
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
          label="Password "
          name="password"
          rules={[
            {
              required: true,
              message: 'Please enter password'
            }
          ]}>
          <Input.Password placeholder="Please enter password" />
        </Form.Item>

        <Form.Item>
          <Button
            htmlType='submit'
            type='primary'
            className={styles.loginBtn}>
            Log in
          </Button>
        </Form.Item>

      </Form>

    </div>
  )
}
