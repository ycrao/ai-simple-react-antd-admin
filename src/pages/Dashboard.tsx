import React from 'react'
import { Row, Col, Card, Statistic, Space } from 'antd'
import { 
  FileTextOutlined, 
  TagsOutlined, 
  UserOutlined,
  EyeOutlined 
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { articlesService } from '../services/articles'
import { categoriesService } from '../services/categories'
import { usersService } from '../services/users'

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  
  const { data: articlesData } = useQuery({
    queryKey: ['articles', { page: 1, per_page: 1 }],
    queryFn: () => articlesService.getList({ page: 1, per_page: 1 }),
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getAll,
  })

  const { data: usersData } = useQuery({
    queryKey: ['users', { page: 1, per_page: 1 }],
    queryFn: () => usersService.getList({ page: 1, per_page: 1 }),
  })

  const stats = [
    {
      title: t('dashboard.totalArticles'),
      value: articlesData?.data.total || 0,
      icon: <FileTextOutlined style={{ color: '#1890ff' }} />,
      color: '#1890ff',
    },
    {
      title: t('dashboard.totalCategories'),
      value: categoriesData?.data.length || 0,
      icon: <TagsOutlined style={{ color: '#52c41a' }} />,
      color: '#52c41a',
    },
    {
      title: t('dashboard.totalUsers'),
      value: usersData?.data.total || 0,
      icon: <UserOutlined style={{ color: '#722ed1' }} />,
      color: '#722ed1',
    },
    {
      title: t('dashboard.todayVisits'),
      value: 1234,
      icon: <EyeOutlined style={{ color: '#fa8c16' }} />,
      color: '#fa8c16',
    },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>{t('dashboard.title')}</h1>
      
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title={t('dashboard.recentArticles')} size="small">
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
              {t('dashboard.noData')}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={t('dashboard.systemInfo')} size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>{t('dashboard.systemVersion')}: v1.0.0</div>
              <div>{t('dashboard.nodeVersion')}: v18.x</div>
              <div>{t('dashboard.database')}: MySQL</div>
              <div>{t('dashboard.uptime')}: 24{t('dashboard.uptime')}</div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard