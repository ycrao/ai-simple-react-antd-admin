import React, { useState } from 'react'
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  Select, 
  Tag, 
  Modal, 
  Form, 
  Popconfirm,
  Card,
  App
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined 
} from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { articlesService, Article, CreateArticleRequest } from '../services/articles'
import { categoriesService } from '../services/categories'
import { useThemeStore } from '../stores/theme'
import dayjs from 'dayjs'
import MDEditor from '@uiw/react-md-editor'

const { TextArea } = Input

const Articles: React.FC = () => {
  const [searchParams, setSearchParams] = useState({
    page: 1,
    per_page: 10,
    keyword: '',
    category_id: undefined as number | undefined,
    status: undefined as string | undefined,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [markdownContent, setMarkdownContent] = useState('')
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { message } = App.useApp()
  const { isDark } = useThemeStore()
  const { t } = useTranslation()

  const { data: articlesData, isLoading } = useQuery({
    queryKey: ['articles', searchParams],
    queryFn: () => articlesService.getList(searchParams),
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getAll,
  })

  const createMutation = useMutation({
    mutationFn: articlesService.create,
    onSuccess: () => {
      message.success(t('articles.createSuccess'))
      setIsModalOpen(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      message.error(error.response?.data?.message || t('articles.createFailed'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateArticleRequest> }) =>
      articlesService.update(id, data),
    onSuccess: () => {
      message.success(t('articles.updateSuccess'))
      setIsModalOpen(false)
      form.resetFields()
      setEditingArticle(null)
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      message.error(error.response?.data?.message || t('articles.updateFailed'))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: articlesService.delete,
    onSuccess: () => {
      message.success(t('articles.deleteSuccess'))
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      message.error(error.response?.data?.message || t('articles.deleteFailed'))
    },
  })

  const handleSearch = (values: { keyword?: string; category_id?: number; status?: string }) => {
    setSearchParams({ ...searchParams, ...values, page: 1 })
  }

  const handleCreate = () => {
    setEditingArticle(null)
    setMarkdownContent('')
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (article: Article) => {
    setEditingArticle(article)
    setMarkdownContent(article.content)
    form.setFieldsValue(article)
    setIsModalOpen(true)
  }

  const handleSubmit = (values: CreateArticleRequest) => {
    const submitData = {
      ...values,
      content: markdownContent
    }
    
    if (editingArticle) {
      updateMutation.mutate({ id: editingArticle.id, data: submitData })
    } else {
      createMutation.mutate(submitData)
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
      title: t('articles.articleTitle'),
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: t('articles.category'),
      dataIndex: ['category', 'name'],
      key: 'category',
      width: 120,
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const colors = {
          draft: 'orange',
          published: 'green',
          archived: 'red',
        }
        const labels = {
          draft: t('articles.draft'),
          published: t('articles.published'),
          archived: t('articles.archived'),
        }
        return <Tag color={colors[status as keyof typeof colors]}>{labels[status as keyof typeof labels]}</Tag>
      },
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
      render: (_: unknown, record: Article) => (
        <Space size={2}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title={t('common.edit')}
            size="small"
          />
          <Popconfirm
            title={t('articles.deleteConfirm')}
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
          <h1 style={{ margin: 0 }}>{t('articles.title')}</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            {t('articles.createArticle')}
          </Button>
        </div>

        <Form layout="inline" onFinish={handleSearch} style={{ marginBottom: 16, flexWrap: 'wrap', gap: '8px' }}>
          <Form.Item name="keyword" style={{ minWidth: '200px' }}>
            <Input placeholder={t('articles.searchTitle')} prefix={<SearchOutlined />} />
          </Form.Item>
          <Form.Item name="category_id" style={{ minWidth: '120px' }}>
            <Select placeholder={t('articles.selectCategory')} allowClear>
              {categoriesData?.data.map(cat => (
                <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" style={{ minWidth: '120px' }}>
            <Select placeholder={t('articles.selectStatus')} allowClear>
              <Select.Option value="draft">{t('articles.draft')}</Select.Option>
              <Select.Option value="published">{t('articles.published')}</Select.Option>
              <Select.Option value="archived">{t('articles.archived')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">{t('common.search')}</Button>
          </Form.Item>
        </Form>

        <Table
          columns={columns}
          dataSource={articlesData?.data.items}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 1000 }}
          size="middle"
          pagination={{
            current: searchParams.page,
            pageSize: searchParams.per_page,
            total: articlesData?.data.total,
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
        title={editingArticle ? t('articles.editArticle') : t('articles.createArticle')}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          setMarkdownContent('')
          form.resetFields()
          setEditingArticle(null)
        }}
        footer={null}
        width="90%"
        style={{ maxWidth: '1200px', top: 20 }}
        styles={{ body: { maxHeight: 'calc(100vh - 200px)', overflow: 'auto' } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label={t('articles.articleTitle')}
            rules={[{ required: true, message: t('articles.titleRequired') }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="category_id"
            label={t('articles.category')}
            rules={[{ required: true, message: t('articles.categoryRequired') }]}
          >
            <Select>
              {categoriesData?.data.map(cat => (
                <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="excerpt"
            label={t('articles.excerpt')}
            rules={[{ required: true, message: t('articles.excerptRequired') }]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label={t('articles.content')}
            required
          >
            <div 
              style={{ 
                border: `1px solid ${isDark ? '#434343' : '#d9d9d9'}`, 
                borderRadius: '6px' 
              }} 
              data-color-mode={isDark ? 'dark' : 'light'}
            >
              <MDEditor
                value={markdownContent}
                onChange={(val) => setMarkdownContent(val || '')}
                height={400}
                preview="edit"
                hideToolbar={false}
                data-color-mode={isDark ? 'dark' : 'light'}
              />
            </div>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={createMutation.isPending || updateMutation.isPending}
              >
                {editingArticle ? t('common.update') : t('common.create')}
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

export default Articles