import React, { useState, useEffect } from 'react';
import {
  Table, message, Spin, Button, Modal, Form, Input, Popconfirm
} from 'antd';
import axios from 'axios';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import '../index.css';

const Dashboard = () => {
  const [usersData, setUsersData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [accessType, setAccessType] = useState('read');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false); // Added missing state
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin status

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // State for MCQs
  const [mcqsData, setMcqsData] = useState([]);
  const [mcqModalVisible, setMcqModalVisible] = useState(false);
  const [currentMcq, setCurrentMcq] = useState(null);

  const checkAdminStatus = () => {
    const isAdmin = localStorage.getItem('role') === 'Admin';
    setIsAdmin(isAdmin);
  };

  // Fetch Users Data
  const fetchUserData = async () => {
    setLoading(true);
    try {

      const response = await axios.get(`${API_BASE}/api/user/users`);

      setUsersData(response.data);
    } catch (error) {
      message.error('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch MCQs Data
  const fetchMcqsData = async () => {
    try {

      const response = await axios.get(`${API_BASE}/api/mcqs`);

      setMcqsData(response.data);
    } catch (error) {
      message.error('Failed to fetch MCQs data');
    }
  };

  // Handle editing an MCQ
  const handleEditMcq = (mcq) => {
    setCurrentMcq(mcq);
    setMcqModalVisible(true);
  };

  // Handle deleting an MCQ
  const handleDeleteMcq = async (mcqId) => {
    try {

      await axios.delete(`${API_BASE}/api/mcqs/${mcqId}`);

      message.success('MCQ deleted successfully');
      fetchMcqsData(); // Refresh MCQ list
    } catch (error) {
      message.error('Failed to delete MCQ');
    }
  };

  // Handle saving MCQ (either create or update)
  const handleSaveMcq = async (values) => {
    console.log(values);  // Log the values to the console to see what you're sending
    
    if (currentMcq) {
      try {

        await axios.put(`${API_BASE}/api/mcqs/${currentMcq._id}`, values);

        message.success('MCQ updated successfully');
      } catch (error) {
        message.error('Failed to update MCQ');
      }
    } else {
      if (isAdmin) {
        try {
          const payload = {
            question: values.question,
            options: [values.optionA, values.optionB, values.optionC, values.optionD],
            correctAnswer: values.correctOption,
          };
          console.log(payload); // Log the payload before making the request

          await axios.post(`${API_BASE}/api/mcqs/create`, payload);  // Corrected POST API URL

          message.success('MCQ created successfully');
        } catch (error) {
          message.error('Failed to create MCQ');
        }
      } else {
        message.error('Only admin can create MCQs');
      }
    }
    setMcqModalVisible(false);
    fetchMcqsData(); // Refresh MCQ list
  };
  useEffect(() => {
    checkAdminStatus();
    fetchUserData();
    fetchMcqsData(); // Fetch MCQs data on load
  }, []);

  const columnsUser = [
    {
      title: 'User ID',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
  ];

  // MCQ Table Columns
  const columnsMcq = [
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
    },
    {
      title: 'Option A',
      dataIndex: 'optionA',
      key: 'optionA',
    },
    {
      title: 'Option B',
      dataIndex: 'optionB',
      key: 'optionB',
    },
    {
      title: 'Option C',
      dataIndex: 'optionC',
      key: 'optionC',
    },
    {
      title: 'Option D',
      dataIndex: 'optionD',
      key: 'optionD',
    },
    {
      title: 'Correct Option',
      dataIndex: 'correctOption',
      key: 'correctOption',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          {isAdmin && (
            <>
              <Button
                icon={<EditOutlined />}
                onClick={() => handleEditMcq(record)}
                style={{ marginRight: 8 }}
              />
              <Popconfirm
                title="Are you sure to delete this MCQ?"
                onConfirm={() => handleDeleteMcq(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button icon={<DeleteOutlined />} />
              </Popconfirm>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>User Dashboard</h2>
      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <Table
          dataSource={usersData}
          columns={columnsUser}
          rowKey={(record) => record._id || record.username}
        />
      )}

      <h2 style={{ marginTop: 40 }}>MCQ Dashboard</h2>
      {loading ? (
        <Spin tip="Loading MCQs..." />
      ) : (
        <>
          {isAdmin && (
            <Button type="primary" onClick={() => setMcqModalVisible(true)} style={{ marginBottom: 16 }}>
              Add New MCQ
            </Button>
          )}
          <Table
            dataSource={mcqsData}
            columns={columnsMcq}
            rowKey={(record) => record._id}
          />
        </>
      )}

      {/* Modal for Add/Edit MCQ */}
      <Modal
        title={currentMcq ? 'Edit MCQ' : 'Add New MCQ'}
        visible={mcqModalVisible}
        onCancel={() => setMcqModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={currentMcq || { question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: '' }}
          onFinish={handleSaveMcq}
        >
          <Form.Item label="Question" name="question" rules={[{ required: true, message: 'Please input the question!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Option A" name="optionA" rules={[{ required: true, message: 'Please input Option A!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Option B" name="optionB" rules={[{ required: true, message: 'Please input Option B!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Option C" name="optionC" rules={[{ required: true, message: 'Please input Option C!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Option D" name="optionD" rules={[{ required: true, message: 'Please input Option D!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Correct Option" name="correctOption" rules={[{ required: true, message: 'Please input the correct option!' }]}>
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              {currentMcq ? 'Save Changes' : 'Add MCQ'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;
