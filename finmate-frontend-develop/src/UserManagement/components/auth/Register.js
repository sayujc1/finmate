import React, { useState } from "react";
import { Input, Space, Button, notification } from "antd";
import {
  IdcardOutlined,
  LoginOutlined,
  UserOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import "../../css/LoginOverride.css";
import { register } from "../../apis/AuthManagementAPI";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthCss from "../../css/Auth.module.css";

const Register = ({setActivePage}) => {
  const onPageChange = () => {
    setActivePage("login");
  };

  const history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const handleChange = e => {
    setIsError({
      name: "",
      username: "",
      email: "",
      password: "",
      confirmpassword: "",
    });
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    let newError = { ...isError };
    if (!user.name) {
      newError = { ...newError, name: "error" };
      notification.error({
        message: "Name is required",
        description: "Please enter name",
      });
    } else if (user.name.match(/^[a-zA-Z ]+$/) === null) {
      newError = { ...newError, name: "error" };
      notification.error({
        message:
          "Name is invalid - should not contain numbers or special characters",
        description: "Please enter a valid name",
      });
    }
    if (!user.username) {
      newError = { ...newError, username: "error" };
      notification.error({
        message: "Username is required",
        description: "Please enter username",
      });
    }
    if (!user.email) {
      newError = { ...newError, email: "error" };
      notification.error({
        message: "Email is required",
        description: "Please enter email",
      });
    }
    if (!user.password) {
      newError = { ...newError, password: "error" };
      notification.error({
        message: "Password is required",
        description: "Please enter password",
      });
    }
    if (!user.confirmpassword) {
      newError = { ...newError, confirmpassword: "error" };
      notification.error({
        message: "Confirm Password is required",
        description: "Please enter confirm password",
      });
    }
    if (user.confirmpassword !== user.password) {
      newError = { ...newError, confirmpassword: "error" };
      notification.error({
        message: "Password does not match",
        description: "Please re-enter password",
      });
    }
    setIsError({ ...newError });

    if (
      user.name &&
      user.name.match(/^[a-zA-Z ]+$/) !== null &&
      user.username &&
      user.email &&
      user.password &&
      user.confirmpassword &&
      user.confirmpassword === user.password
    ) {
      await register(user, dispatch)
        .then(response => {
          if (response.status === "SUCCESS") {
            localStorage.setItem("isAuth", true);
            history.push("/");
          }
        })
        .catch(error => {
          localStorage.setItem("isAuth", false);
          if (error === "User already exists") {
            newError = { ...newError, username: "error", email: "error" };
          }
          setIsError({ ...newError });

          notification.error({
            message: error,
            description: "Failed to Register",
          });
        });
    }
    setIsLoading(false);
  };
  return (
    <div>
      <Space direction="vertical">
        <span className="label">Name</span>
        <Input
          id="register-name"
          status={isError.name}
          placeholder="Type Name"
          name="name"
          onChange={handleChange}
          prefix={
            <IdcardOutlined
              className="site-form-item-icon"
              style={{ paddingRight: "5px" }}
            />
          }
          onPressEnter={handleSubmit}
        />
        <span className="label">Username</span>
        <Input
          id="register-username"
          status={isError.username}
          placeholder="Type Username"
          name="username"
          onChange={handleChange}
          prefix={
            <UserOutlined
              className="site-form-item-icon"
              style={{ paddingRight: "5px" }}
            />
          }
          onPressEnter={handleSubmit}
        />
        <span className="label">Email</span>
        <Input
          id="register-email"
          status={isError.email}
          placeholder="Type Email"
          name="email"
          type="email"
          onChange={handleChange}
          prefix={
            <MailOutlined
              className="site-form-item-icon"
              style={{ paddingRight: "5px" }}
            />
          }
          onPressEnter={handleSubmit}
        />
        <span className="label">Password</span>
        <Input.Password
          id="register-password"
          status={isError.password}
          placeholder="Password"
          name="password"
          onChange={handleChange}
          prefix={
            <LockOutlined
              className="site-form-item-icon"
              style={{ paddingRight: "5px" }}
            />
          }
          onPressEnter={handleSubmit}
        />
        <span className="label">Confirm Password</span>
        <Input.Password
          id="register-confirmpassword"
          status={isError.confirmpassword}
          placeholder="Confirm password"
          name="confirmpassword"
          onChange={handleChange}
          prefix={
            <LockOutlined
              className="site-form-item-icon"
              style={{ paddingRight: "5px" }}
            />
          }
          onPressEnter={handleSubmit}
        />
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <Button
            type="default"
            icon={<LoginOutlined />}
            block
            className={AuthCss.loginButton}
            onClick={handleSubmit}
            loading={isLoading}
          >
            {isLoading ? <>Registering ...</> : <>Register</>}
          </Button>
        </div>
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          Already have an account? <Button type="link" onClick={onPageChange}>
              Login
            </Button> 
        </div>
      </Space>
    </div>
  );
};

export default Register;
