模拟数据接口说明文档
------------------

## 基地址

http://localhost:8000

## 登录

### 请求参数

请求路径: /admin-api/ms-user/auth/login
请求body:

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### 响应

正常响应结果：

HTTP 200 ，示例响应内容：

```json
{
  "code": 200,
  "message": "ok",
  "data": {
    "access_token": "f55e9f5d-3b6e-4552-a558-b3564ad94359",
    "user_id": 1,
    "name": "Admin",
    "email": "a***n@example.com",
    "role": "administrator",
    "avatar": "https://avatars.githubusercontent.com/u/3280204?v=4&size=80"
  }
}
```

异常：
如果 email 或者 password 错误，则返回以下异常。

```json
{
    "code": 422,
    "message": "incorrect email or password!",
    "data": null
}
```

后续文章，分类等接口需要携带 `access_token` 到 `headers` 中，也就是

`Authorization: Bearer f55e9f5d-3b6e-4552-a558-b3564ad94359`

## 文章

请求路径如下：

列表： GET /admin-api/ms-content/article?

获取特定id文章： GET /admin-api/ms-content/article/{id}  # 其中 `{id}` 为数字，后同

创建： POST /admin-api/ms-content/article

更新特定id文章： POST/PUT /admin-api/ms-content/article/{id}

删除特定id文章： DELETE /admin-api/ms-content/article/{id} 



### 文章列表

可接受的查询串：`page=1&per_page=15&keyword={keyword}&category_id={category}&status={status}`

- page int 当前第几页
- per_page int 每页分页大小
- keyword string 关键词搜索
- category_id int 分类id
- status string 状态 one of ('draft' | 'published' | 'archived')


```json
{
  "code":200,
  "message": "ok",
  "data": {
    "items": [
      {
        "id": 18,
        "title": "stunt",
        "content": "Fugit caecus conscendo vivo debeo. Amoveo desparatus summa caelestis somnus amiculum tactus derelinquo abundans. Ater desparatus ait valetudo ver pecus viscus.F",
        "excerpt": "Volo averto annus barba vulnero cohibeo caveo solutio.",
        "category_id": 1,
        "category": {
          "id": 1,
          "name": "default"
        },
        "status": "draft",
        "created_at": "2024-06-28 20:21:13",
        "updated_at": "2025-08-03 09:27:02",
        "published_at": null
      },
      {
        "id": 13,
        "title": "how",
        "content": "Cursim ademptio curso videlicet crur aureus tres vix id stella. Aufero creator arbitro unus avarus decor. Vigor provident suasoria assentator amitto.",
        "excerpt": "Casso canis summisse tracto celer.",
        "category_id": 1,
        "category": {
          "id": 1,
          "name": "default"
        },
        "status": "draft",
        "created_at": "2024-02-13 13:01:32",
        "updated_at": "2024-06-28 20:21:13",
        "published_at": "2024-07-03 09:36:22"
      }
    ],
    "total": 20,
    "per_page": 15,
    "current_page": 1
  }
}
```

### 创建文章

请求 body 

```json
{
    "title": "adjourn",
    "content": "Arbor vinitor bibo. Benevolentia contabesco minus delibero uberrime umquam vitae. Alias decretum nulla capio curto certe cresco cuius patior celebrer.",
    "excerpt": "Temeritas vinco sumo enim.",
    "category_id": 1, 
}
```

正常返回响应

HTTP 状态码 201

```json
{
    "code":200,
    "message": "ok",
    "data": {
        "id": 13,
        "title": "adjourn",
        "content": "Arbor vinitor bibo. Benevolentia contabesco minus delibero uberrime umquam vitae. Alias decretum nulla capio curto certe cresco cuius patior celebrer.",
        "excerpt": "Temeritas vinco sumo enim.",
        "category_id": 1,
        "category": {
          "id": 1,
          "name": "default"
        },
        "status": "draft",
        "created_at": "2024-02-13 13:01:32",
        "updated_at": "2025-01-23 12:16:28"
    }
}
```

### 更新文章

类似于创建文章，只不过端点不同 POST `/admin-api/ms-content/article/13`

响应示例：

```json
{
    "code":200,
    "message": "ok",
    "data": {
        "id": 13,
        "title": "adjourn2",
        "content": "Arbor vinitor bibo. Benevolentia contabesco minus delibero uberrime umquam vitae. Alias decretum nulla capio curto certe cresco cuius patior celebrer.",
        "excerpt": "Temeritas vinco sumo enim.",
        "category_id": 1,
        "category": {
          "id": 1,
          "name": "default"
        },
        "status": "published",
        "created_at": "2024-02-13 13:01:32",
        "updated_at": "2025-01-23 12:16:28"
    }
}
```

### 删除文章

略去不表。


## 分类

请求路径如下：


获取所有分类： GET /admin-api/ms-content/category/all

获取特定id分类： GET /admin-api/ms-content/category/{id}  # 其中 `{id}` 为数字，后同

创建： POST /admin-api/ms-content/category

更新特定id分类： POST/PUT /admin-api/ms-content/category/{id}

删除特定id分类： DELETE /admin-api/ms-content/category/{id} 

分类的实体结构如下：

```json
{
  "id": 1,
  "name": "default",
  "description": "Default category",
  "slug": "default",
  "created_at": "2023-08-21 12:31:45",
  "updated_at": "2023-08-21 12:31:45",
  "articles_count": 0
}
```

由于分类数量有限，没有提供分类列表接口，只提供了所有分类接口，响应报文如下：

```json
{
  "code": 200,
  "message": "ok",
  "data": [
    {
      "id": 1,
      "name": "default",
      "description": "Default category",
      "slug": "default",
      "created_at": "2023-08-21 12:31:45",
      "updated_at": "2023-08-21 12:31:45",
      "articles_count": 11
    },
    {
      "id": 2,
      "name": "life",
      "description": "Some memory in life",
      "slug": "life",
      "created_at": "2024-09-01 09:25:13",
      "updated_at": "2024-09-16 13:23:17",
      "articles_count": 3
    },
    {
      "id": 3,
      "name": "work",
      "description": "Something related to work",
      "slug": "work",
      "created_at": "2025-12-24 17:30:09",
      "updated_at": "2025-12-24 17:30:09",
      "articles_count": 43
    }
  ]
}
```

其他接口与文章说明类似，不再赘述。

## 用户

请求路径如下：

当前登录用户： GET /admin-api/ms-user/user/me

用户列表： GET /admin-api/ms-user/user

获取特定id用户： GET /admin-api/ms-user/user/{id}  # 其中 `{id}` 为数字，后同

创建： POST /admin-api/ms-user/user

更新特定id分类： POST/PUT /admin-api/ms-user/user/{id}

删除特定id分类： DELETE /admin-api/ms-user/user/{id} 

### 当前用户接口

GET /admin-api/ms-user/user/me

响应示例：

```json
{
  "code": 200,
  "message": "ok",
  "data": {
    "name": "Admin",
    "email": "a***n@example.com",
    "avatar": "https://avatars.githubusercontent.com/u/3280204?v=4&size=80",
    "role": "administrator",
    "user_id": 1
  }
}
```

### 用户列表接口

GET /admin-api/ms-user/user/me

```json
{
  "code": 200,
  "message": "ok",
  "data": {
    "total": 2,
    "per_page": 10,
    "current_page": 1,
    "items": [
      {
        "id": 1,
        "name": "Admin",
        "email": "a***n@example.com",
        "role": "administrator"
      },
      {
        "id": 2,
        "name": "Demo",
        "email": "d**o@foxmail.com",
        "role": "demo"
      }
    ]
  }
}
```

### 其它

其它增改删类似，不再赘述。
