import React, { useEffect, useState } from "react";
import {
  Menu,
  Dropdown,
  Modal,
  Form,
  Input,
  Button,
  Upload,
  message,
  Progress,
} from "antd";
import {
  AppstoreOutlined,
  FileTextOutlined,
  UploadOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { LogoL } from "../assets";
import "./theme.less";

const Sidebar = () => {
  const [submenuItems, setSubmenuItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  const path = window.location.pathname;

  useEffect(() => {
  
    checkAdminStatus();
  }, []);

  const checkAdminStatus = () => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "Admin");
  };

  const selectedKey = () => {
    switch (path) {
      case "/dashboard":
        return "1";
      case "/register":
        return "2";
      case "/mcqs":
        return "3";
      default:
        return "1";
    }
  };


  return (
    <>
      <div className="flex flex-col w-full justify-center items-center py-4 bg-black">
        <img src={LogoL} alt="logo" className="w-16" />
      </div>
      <hr />

      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[selectedKey()]}
        items={[
          {
            key: "1",
            icon: <AppstoreOutlined />,
            label: <Link to="/dashboard">Home</Link>,
          },
          {
            key: "2",
            icon: <FileTextOutlined />,
            label: <Link to="/register">Register Student</Link>,
            hidden: !isAdmin,
          },
          {
            key: "3",
            icon: <ReadOutlined />,
            label: <Link to="/mcqs">MCQS</Link>,
            hidden: !isAdmin,
          },
        ].filter(item => !item.hidden)}
      />
      {uploading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-center mb-2">Uploading...</p>
            <progress max="100" value={progress}></progress>
            <p className="text-center mt-2">{progress}%</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
