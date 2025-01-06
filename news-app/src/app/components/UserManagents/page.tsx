"use client"
import React, { useEffect, useState } from "react";
import { Button, Table, notification } from "antd";
import type { ColumnsType } from "antd/es/table";
import { apiFetch } from "../../../../utils/api";

interface User {
  id: number;
  email: string;
  username: string;
  phone: string | null;
  birthday: string | null;
  address: string | null;
  description: string | null;
  is_active: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiFetch("/api/users/", "GET", null, null);
      setUsers(response);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch users. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };
  

  const toggleActiveStatus = async (id: number, isActive: boolean) => {
    try {
      await apiFetch(`/api/users/${id}/update_status/`, "PATCH", { is_active: !isActive });
      notification.success({
        message: "Success",
        description: `User ${!isActive ? "activated" : "deactivated"} successfully.`,
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, is_active: !isActive } : user
        )
      );
    } catch (error) {
      notification.error({
        message: "Error",
        description: `Failed to ${!isActive ? "activate" : "deactivate"} user. Please try again later.`,
      });
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: "Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
      key: "birthday",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Active Status",
      key: "is_active",
      render: (_, record) => (
        <Button
          style={{
            backgroundColor: record.is_active ? "yellow" : "red",
            color: record.is_active ? "black" : "white",
            borderColor: record.is_active ? "yellow" : "red",
          }}
          onClick={() => toggleActiveStatus(record.id, record.is_active)}
        >
          {record.is_active ? "Active" : "Inactive"}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default UserManagement;
