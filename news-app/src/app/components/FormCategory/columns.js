import { DeleteOutlined, EditOutlined, MenuOutlined } from "@ant-design/icons";

const columnsCategory = (handleEdit, handleDelete, handleViewSubcategories) => [
  {
    title: "Category Name",
    dataIndex: "name",
    className: "text-lg",
    align: "center",
  },
  {
    title: "Description",
    dataIndex: "description",
    className: "text-lg",
    align: "center",
  },
  {
    title: "Subcategories",
    dataIndex: "children",
    className: "text-lg",
    align: "center",
    render: (_, record) => (
      <div
        style={{
          padding: "8px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "4px",
        }}
      >
        <MenuOutlined
          style={{
            color: "black",
            cursor: "pointer",
            fontSize: "18px",
          }}
          onClick={() => handleViewSubcategories(record.id)}
        />
      </div>
    ),
  },

  {
    title: "Actions",
    className: "text-lg",
    align: "center",
    render: (_, record) => (
      <span>
        <EditOutlined
          style={{ color: "#1890ff", cursor: "pointer", marginRight: 8 }}
          onClick={() => handleEdit(record)}
        />
        <DeleteOutlined
          style={{ color: "#ff4d4f", cursor: "pointer" }}
          onClick={() => handleDelete(record.id)}
        />
      </span>
    ),
  },
];

export default columnsCategory;
