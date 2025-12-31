import React, { useState, useEffect } from 'react'
import { Layout as AntLayout, Menu, Avatar, Dropdown, Switch, Space, Drawer, Select } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  FileTextOutlined,
  TagsOutlined,
  UserOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { useLanguageStore } from '../stores/language'

const { Header, Sider, Content } = AntLayout

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { isDark, toggleTheme } = useThemeStore()
  const { language, setLanguage } = useLanguageStore()
  const { t } = useTranslation()

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setCollapsed(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: t('nav.dashboard'),
    },
    {
      key: '/articles',
      icon: <FileTextOutlined />,
      label: t('nav.articles'),
    },
    {
      key: '/categories',
      icon: <TagsOutlined />,
      label: t('nav.categories'),
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: t('nav.users'),
    },
  ]

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('auth.logout'),
      onClick: logout,
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
    if (isMobile) {
      setDrawerVisible(false)
    }
  }

  const toggleSider = () => {
    if (isMobile) {
      setDrawerVisible(!drawerVisible)
    } else {
      setCollapsed(!collapsed)
    }
  }

  const siderContent = (
    <>
      <div style={{ 
        height: 32, 
        margin: 16, 
        background: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold'
      }}>
        {collapsed && !isMobile ? 'A' : 'Admin'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </>
  )

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {!isMobile && (
        <Sider trigger={null} collapsible collapsed={collapsed}>
          {siderContent}
        </Sider>
      )}
      
      {isMobile && (
        <Drawer
          title={t('nav.dashboard')}
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          bodyStyle={{ padding: 0, background: '#001529' }}
          width={250}
        >
          {siderContent}
        </Drawer>
      )}
      
      <AntLayout>
        <Header style={{ 
          padding: '0 16px', 
          background: isDark ? '#141414' : '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: toggleSider,
              style: { fontSize: 18, cursor: 'pointer' }
            })}
          </div>
          <Space size={isMobile ? 'small' : 'middle'}>
            <Select
              value={language}
              onChange={setLanguage}
              size={isMobile ? 'small' : 'middle'}
              style={{ width: isMobile ? 60 : 80 }}
              suffixIcon={<GlobalOutlined />}
              options={[
                { value: 'zh-CN', label: '中' },
                { value: 'en-US', label: 'EN' },
              ]}
            />
            <Switch
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
              checked={isDark}
              onChange={toggleTheme}
              size={isMobile ? 'small' : 'default'}
            />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar src={user?.avatar} icon={<UserOutlined />} size={isMobile ? 'small' : 'default'} />
                {!isMobile && <span>{user?.name}</span>}
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ 
          margin: isMobile ? '16px 8px' : '24px 16px',
          padding: isMobile ? 16 : 24,
          minHeight: 280,
          background: isDark ? '#1f1f1f' : '#fff',
          borderRadius: 8
        }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

export default Layout