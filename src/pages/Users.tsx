import React, { useState } from 'react'
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select,
  Popconfirm,
  Card,
  Tag,
  Avatar,
  App
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { usersService, User, CreateUserRequest } from '../services/users'

const Users: React.FC = () => {
  const [searchParams, setSearchParams] = useState({
    page: 1,
    per_page: 10,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  const { t } = useTranslation()

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users', searchParams],
    queryFn: () => usersService.getList(searchParams),
  })

  const createMutation = useMutation({
    mutationFn: usersService.create,
    onSuccess: () => {
      message.success(t('users.createSuccess'))
      setIsModalOpen(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      message.error(error.response?.data?.message || t('users.createFailed'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateUserRequest> }) =>
      usersService.update(id, data),
    onSuccess: () => {
      message.success(t('users.updateSuccess'))
      setIsModalOpen(false)
      form.resetFields()
      setEditingUser(null)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      message.error(error.response?.data?.message || t('users.updateFailed'))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: usersService.delete,
    onSuccess: () => {
      message.success(t('users.deleteSuccess'))
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      message.error(error.response?.data?.message || t('users.deleteFailed'))
    },
  })

  const handleCreate = () => {
    setEditingUser(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    form.setFieldsValue({
      ...user,
      password: '', // 不显示密码
    })
    setIsModalOpen(true)
  }

  const handleSubmit = (values: CreateUserRequest) => {
    if (editingUser) {
      // 如果密码为空，则不更新密码
      let updateData: Partial<CreateUserRequest> = { ...values }
      if (!updateData.password) {
        updateData = {
          name: updateData.name,
          email: updateData.email,
          role: updateData.role,
        }
      }
      updateMutation.mutate({ id: editingUser.id, data: updateData })
    } else {
      createMutation.mutate(values)
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: t('users.name'),
      key: 'user',
      render: (_: unknown, record: User) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div>{record.name}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: t('users.role'),
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role: string) => {
        const colors = {
          administrator: 'red',
          editor: 'blue',
          author: 'green',
          demo: 'orange',
        }
        const labels = {
          administrator: t('users.administrator'),
          editor: t('users.editor'),
          author: t('users.author'),
          demo: t('users.demo'),
        }
        return (
          <Tag color={colors[role as keyof typeof colors]}>
            {labels[role as keyof typeof labels] || role}
          </Tag>
        )
      },
    },
    {
      title: t('common.actions'),
      key: 'action',
      width: 80,
      fixed: 'right' as const,
      render: (_: unknown, record: User) => (
        <Space size={2}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title={t('common.edit')}
            size="small"
          />
          <Popconfirm
            title={t('users.deleteConfirm')}
            onConfirm={() => deleteMutation.mutate(record.id)}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title={t('common.delete')}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>{t('users.title')}</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            {t('users.createUser')}
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={usersData?.data.items}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 600 }}
          size="middle"
          pagination={{
            current: searchParams.page,
            pageSize: searchParams.per_page,
            total: usersData?.data.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => t('pagination.total', { 
              start: range[0], 
              end: range[1], 
              total 
            }),
            onChange: (page, pageSize) => {
              setSearchParams({ ...searchParams, page, per_page: pageSize || 10 })
            },
          }}
        />
      </Card>

      <Modal
        title={editingUser ? t('users.editUser') : t('users.createUser')}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
          setEditingUser(null)
        }}
        footer={null}
        width="90%"
        style={{ maxWidth: '600px' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label={t('users.name')}
            rules={[{ required: true, message: t('users.nameRequired') }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="email"
            label={t('users.email')}
            rules={[
              { required: true, message: t('users.emailRequired') },
              { type: 'email', message: t('users.emailInvalid') }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label={t('users.password')}
            rules={editingUser ? [] : [{ required: true, message: t('users.passwordRequired') }]}
          >
            <Input.Password placeholder={editingUser ? t('users.passwordPlaceholder') : t('users.password')} />
          </Form.Item>

          <Form.Item
            name="role"
            label={t('users.role')}
            rules={[{ required: true, message: t('users.roleRequired') }]}
          >
            <Select>
              <Select.Option value="administrator">{t('users.administrator')}</Select.Option>
              <Select.Option value="editor">{t('users.editor')}</Select.Option>
              <Select.Option value="author">{t('users.author')}</Select.Option>
              <Select.Option value="demo">{t('users.demo')}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {editingUser ? t('common.update') : t('common.create')}
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>
                {t('common.cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Users