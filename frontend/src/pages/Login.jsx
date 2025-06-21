import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { LogoL } from "../assets";
import { useContentContext } from "../providers/ContentContext";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Login = () => {
  const { openSuccessNotification } = useContentContext();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {

      const response = await axios.post(`${API_BASE}/api/user/login`, {

        username: values.username,
        password: values.password,
      });

      // Assuming your backend sends back a token upon successful login
      const token = response.data.id;
      const email = response.data.email;
      const role = response.data.role;

      localStorage.setItem('email', email);
      localStorage.setItem('role', role);
      localStorage.setItem('token', token);
      openSuccessNotification("Login Success!", "Successfully Logged In");

      // Redirect to dashboard
      window.location.replace("/dashboard");

    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      message.error("Invalid username or password. Please try again.");
    }
  };

  useEffect(() => {
    // Check if token exists in localStorage and redirect to dashboard if it does
    if (localStorage.getItem("token") !== null) {
      window.location.replace("/dashboard");
    }
  }, []);

  const handleForgotPassword = () => {
    // Implement your forgot password logic here
    message.info("Feature coming soon!");
  };

  const handleRegister = () => {
    // Redirect to register page or implement your register logic here
    window.location.replace("/register");
  };

  return (
    <div className="flex flex-col w-full h-screen justify-center items-center bg-[#ececec]">
      <div className="flex flex-col justify-center items-center">
        <img src={LogoL} alt="Logo" className="w-16" />
        <div className="text-2xl font-semibold mt-2">Quiz-Portal</div>
      </div>
      <div className="flex flex-col justify-center items-center mt-4 bg-white p-6 sm:px-8 px-4 max-sm:mx-2 rounded-2xl shadow-xl">
        <div className="text-lg font-medium">Log In</div>
        <Form
          name="normal_login"
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
                type: "email",
                message: "Please enter your Email!",
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
                message: "Please enter your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-500 mt-4"
              loading={loading}
            >
              Log in
            </Button>
          </Form.Item>
          {/* <Form.Item>
            <div className="flex justify-between items-center">
              <span
                className="cursor-pointer text-blue-400"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </span>
              <span
                className="cursor-pointer text-blue-400"
                onClick={handleRegister}
              >
                Register
              </span>
            </div>
          </Form.Item> */}
        </Form>
      </div>
    </div>
  );
};

export default Login;
