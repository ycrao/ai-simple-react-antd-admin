import React from 'react'
import { Form, Input, Button, Card, Switch, App } from 'antd'
import { UserOutlined, LockOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { authService, LoginRequest } from '../services/auth'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'

const Login: React.FC = () => {
  const { login } = useAuthStore()
  const { isDark, toggleTheme } = useThemeStore()
  const { message } = App.useApp()
  const { t } = useTranslation()

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      const { access_token, ...user } = response.data
      login(access_token, user)
      message.success(t('auth.loginSuccess'))
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      message.error(error.response?.data?.message || t('auth.loginFailed'))
    },
  })

  const onFinish = (values: LoginRequest) => {
    loginMutation.mutate(values)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isDark ? '#141414' : '#f0f2f5',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: 400,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
        title={
          <div style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>
            {t('auth.loginTitle')}
          </div>
        }
        extra={
          <Switch
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            checked={isDark}
            onChange={toggleTheme}
            size="small"
          />
        }
      >
        <Form
          name="login"
          initialValues={{ 
            email: 'admin@example.com',
            password: 'admin123'
          }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: t('auth.emailRequired') },
              { type: 'email', message: t('auth.emailInvalid') }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder={t('auth.email')} 
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: t('auth.passwordRequired') }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t('auth.password')}
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loginMutation.isPending}
              style={{ width: '100%' }}
            >
              {t('auth.login')}
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ 
          textAlign: 'center', 
          color: '#666', 
          fontSize: 12,
          marginTop: 16
        }}>
          {t('auth.defaultAccount')}
        </div>
      </Card>
    </div>
  )
}

export default Login