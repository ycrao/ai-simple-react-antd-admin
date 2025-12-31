import React, { useState } from 'react'
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Popconfirm,
  Card,
  Tag,
  App
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { categoriesService, Category, CreateCategoryRequest } from '../services/categories'
import dayjs from 'dayjs'

const { TextArea } = Input

const Categories: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  const { t } = useTranslation()

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getAll,
  })

  const createMutation = useMutation({
    mutationFn: categoriesService.create,
    onSuccess: () => {
      message.success(t('categories.createSuccess'))
      setIsModalOpen(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      message.error(error.response?.data?.message || t('categories.createFailed'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateCategoryRequest> }) =>
      categoriesService.update(id, data),
    onSuccess: () => {
      message.success(t('categories.updateSuccess'))
      setIsModalOpen(false)
      form.resetFields()
      setEditingCategory(null)
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      message.error(error.response?.data?.message || t('categories.updateFailed'))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: categoriesService.delete,
    onSuccess: () => {
      message.success(t('categories.deleteSuccess'))
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      message.error(error.response?.data?.message || t('categories.deleteFailed'))
    },
  })

  const handleCreate = () => {
    setEditingCategory(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    form.setFieldsValue(category)
    setIsModalOpen(true)
  }

  const handleSubmit = (values: CreateCategoryRequest) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: values })
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
      title: t('categories.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('categories.slug'),
      dataIndex: 'slug',
      key: 'slug',
      render: (slug: string) => <Tag>{slug}</Tag>,
    },
    {
      title: t('categories.description'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: t('categories.articlesCount'),
      dataIndex: 'articles_count',
      key: 'articles_count',
      width: 100,
      render: (count: number) => <Tag color="blue">{count}</Tag>,
    },
    {
      title: t('articles.createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: t('common.actions'),
      key: 'action',
      width: 80,
      fixed: 'right' as const,
      render: (_: unknown, record: Category) => (
        <Space size={2}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title={t('common.edit')}
            size="small"
          />
          <Popconfirm
            title={t('categories.deleteConfirm')}
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
          <h1 style={{ margin: 0 }}>{t('categories.title')}</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            {t('categories.createCategory')}
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={categoriesData?.data}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 800 }}
          size="middle"
          pagination={false}
        />
      </Card>

      <Modal
        title={editingCategory ? t('categories.editCategory') : t('categories.createCategory')}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
          setEditingCategory(null)
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
            label={t('categories.name')}
            rules={[{ required: true, message: t('categories.nameRequired') }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="slug"
            label={t('categories.slug')}
            rules={[{ required: true, message: t('categories.slugRequired') }]}
          >
            <Input placeholder={t('categories.slugPlaceholder')} />
          </Form.Item>

          <Form.Item
            name="description"
            label={t('categories.description')}
            rules={[{ required: true, message: t('categories.descriptionRequired') }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {editingCategory ? t('common.update') : t('common.create')}
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

export default Categories