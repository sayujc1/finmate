import React from "react";
import { Avatar, Menu, Dropdown } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { logout } from "../../apis/AuthManagementAPI";
import { useDispatch, useSelector } from "react-redux";

const ProfileRoot = () => {
  const userDetails = useSelector(state => state.UserReducer.userDetails);
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await logout(dispatch);
  };

  const menuItems = [
    // {
    //   label: <Link to={"/profile"}>My Profile</Link>,
    //   key: "1",
    //   icon: <UserOutlined />,
    // },
    {
      label: (
        <button
          style={{
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
      ),
      key: "2",
      icon: <LogoutOutlined />,
    },
  ];

  const menu = <Menu items={menuItems} />;

  return (
    <>
      <Dropdown overlay={menu} trigger={["click"]}>
        <Avatar
          style={{
            color: "#f56a00",
            backgroundColor: "#fde3cf",
            position: "absolute",
            right: "30px",
            top: "25px",
            cursor: "pointer",
          }}
        >
          {userDetails?.name?.charAt(0)}
        </Avatar>
      </Dropdown>
    </>
  );
};

export default ProfileRoot;
