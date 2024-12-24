import { TableProps, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export const columns: TableProps<any>['columns'] = [
  {
    title: 'Category Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Subcategories',
    dataIndex: 'subcategories',
    key: 'subcategories',
    render: (_, { subcategories }) => (
      <ul>
        {
          subcategories.map((sub: any, index: any) => (
            <li key={index} > {sub.sub} </li>
          ))
        }
      </ul>
    )
  },
  {
    title: 'Action',
    key: 'action',
    render: (_) => (
      <Space size="middle" >
        <a><EditOutlined /></a>
        < a ><DeleteOutlined /></a>
      </Space>
    ),
  },
]