import React, { useState } from "react";
import { Form, Input, Button, message, Select, DatePicker } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { LogoL } from "../assets";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const { Option } = Select;

const Register = () => {
  const [form] = Form.useForm(); // Form hook to get form instance
  const [selectedRole, setSelectedRole] = useState(null); // State to track selected role

  const onFinish = async (values) => {
    try {

      const response = await axios.post(`${API_BASE}/api/user/register`, values);


      // Handle successful registration
      message.success("Registration successful! Please login.");

      // Redirect to login page
      window.location.replace("/login");

    } catch (error) {
      console.error("Registration error:", error);
      // Handle registration failure (show error message to user)
      message.error("Registration failed. Please try again.");
    }
  };

  const handleRoleChange = (value) => {
    setSelectedRole(value); // Update selected role in state
    form.resetFields(["studentRegisterNo"]); // Reset fields on role change
  };

  return (
    <div className="flex flex-col w-full h-screen justify-center items-center bg-[#ececec]">
      {/* <div className="flex flex-col justify-center items-center">
        <img src={LogoL} alt="Logo" className="w-16" />
        <div className="text-2xl font-semibold mt-2">EDS</div>
      </div> */}
      <div className="flex flex-col justify-center items-center mt-4 bg-white p-6 sm:px-8 px-4 max-sm:mx-2 rounded-2xl shadow-xl">
        <div className="text-lg font-medium">Register</div>
        <Form
          form={form} // Pass form instance to Form component
          name="normal_register"
          className="flex flex-col sm:w-[300px] w-[250px] mt-4"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please enter a username!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
         
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter a password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email address!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="role"
            rules={[
              {
                required: true,
                message: "Please select a role!",
              },
            ]}
          >
            <Select
              placeholder="Select Role"
              onChange={handleRoleChange} // Handle role change
            >
             
              <Option value="Student">Student</Option>
              <Option value="Admin">Admin</Option>
             
            </Select>
          </Form.Item>
          {selectedRole === 'Student' && (
            <>

              <Form.Item
                name="studentRegisterNo"
                rules={[
                  {
                    required: true,
                    message: "Please enter student register number!",
                  },
                ]}
              >
                <Input placeholder="Student Register No" />
              </Form.Item>
                </>
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-500 mt-4"
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
