import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router'
import { SnippetsOutlined, SolutionOutlined, ProfileOutlined, UserOutlined, DownOutlined } from '@ant-design/icons/lib';
import { Layout as AntdLayout, Menu, theme, Dropdown, Space, MenuProps, message } from 'antd/lib';

import styles from "./index.module.css"
import Link from 'next/link';
import { logout } from '@/api/user';
import { USER_ROLE } from '@/constants';
import { useCurrentUser } from '@/utils/hooks';

const { Header, Content, Sider } = AntdLayout;

export function Layout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user } = useCurrentUser()

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    router.push(key)

  }

  const activeMenu = router.pathname

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  //Top-Right Dropdown Menu
  const userItems = [
    {
      label: <Link href={`/user/edit/${user?._id}`}>My Profile</Link>,
      key: '1',
    },
    {
      label:
        <span onClick={async () => {
          await logout()
          message.success("Logout success")
          //clear localStorage when logout
          localStorage.removeItem("user")
          router.push("/login")
        }}>Log out</span>,
      key: '2',
    }
  ]

  //admin - all menu
  //user - can only access BookList & own BorrowRecord
  const MENUITEMS = [
    {
      label: "Book",
      key: "book",
      role: USER_ROLE.USER,
      icon: <SnippetsOutlined />,
      children: [
        {
          label: "Book List",
          key: "/book",
          role: USER_ROLE.USER,
        },
        {
          label: "Add Book",
          key: "/book/add",
          role: USER_ROLE.ADMIN,
        },
      ],
    },
    {
      label: "Borrow",
      key: "borrow",
      role: USER_ROLE.USER,
      icon: <SolutionOutlined />,
      children: [
        {
          label: "Borrow Record",
          key: "/borrow",
          role: USER_ROLE.USER,
        },
        {
          label: "Add Borrow",
          key: "/borrow/add",
          role: USER_ROLE.ADMIN,
        },
      ],
    },
    {
      label: "Category",
      key: "category",
      icon: <ProfileOutlined />,
      role: USER_ROLE.ADMIN,
      children: [
        {
          label: "Category List",
          key: "/category",
          role: USER_ROLE.USER,
        },
        {
          label: "Add Category",
          key: "/category/add",
          role: USER_ROLE.ADMIN,
        },
      ],
    },
    {
      label: "User",
      key: "user",
      icon: <UserOutlined />,
      role: USER_ROLE.ADMIN,
      children: [
        {
          label: "User List",
          key: "/user",
          role: USER_ROLE.ADMIN,
        },
        {
          label: "Add User",
          key: "/user/add",
          role: USER_ROLE.ADMIN,
        },
      ],
    }
  ];
  //filter menu according to user role
  const menuItems = useMemo(() => {
    if (user?.role === USER_ROLE.USER) {
      return MENUITEMS.filter((item) => {
        if (item.children) {
          item.children = item.children.filter((k) => {
            return k.role === USER_ROLE.USER
          })
          return item.role === USER_ROLE.USER
        }
      })
    } else {
      return MENUITEMS
    }
  }, [user])


  return (
    <AntdLayout>
      <Header style={{ backgroundColor: "white", display: 'flex', alignItems: 'center' }}>

        <div className={styles.logoText} >Book Management</div >

        {/* Dropdown Menu */}
        <Dropdown menu={{ items: userItems }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              {user?.nickName ? user?.nickName : 'User'}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>

      </Header>
      <AntdLayout className={styles.mainSection} >

        {/* main menu */}
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['/book']}
            defaultOpenKeys={['book']}
            selectedKeys={[activeMenu]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>
        <AntdLayout style={{ padding: '24px 24px' }} >

          {/* Content */}
          <Content>
            {children}
          </Content>

        </AntdLayout>
      </AntdLayout>
    </AntdLayout>

  )
}
