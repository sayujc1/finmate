import React, { useState } from "react";
import { Input, Space, Button, notification } from "antd";
import { LoginOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import "../../css/LoginOverride.css";
import { login } from "../../apis/AuthManagementAPI";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthCss from "../../css/Auth.module.css";

const Login = ({setActivePage}) => {
  const onPageChange = () => {
    setActivePage("register");
  };
  const history = useHistory();
  const dispatch = useDispatch();
  const [isError, setIsError] = useState({
    user: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    user: "",
    password: "",
  });
  const handleChange = e => {
    setIsError({
      user: "",
      password: "",
    });
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    let newError = { ...isError };
    if (!user.user) {
      newError = { ...newError, user: "error" };
      notification.error({
        message: "Username/Email is required",
        description: "Please enter username/email",
      });
    }

    if (!user.password) {
      newError = { ...newError, password: "error" };
      notification.error({
        message: "Password is required",
        description: "Please enter password",
      });
    }

    setIsError({ ...newError });

    if (user.user && user.password) {
      await login(user, dispatch)
        .then(response => {
          if (response.status === "SUCCESS") {
            localStorage.setItem("isAuth", true);
            history.push("/");
          }
        })
        .catch(error => {
          localStorage.setItem("isAuth", false);
          if (error === "Invalid Username or Email ID") {
            newError = { ...isError, user: "error" };
          } else if (error === "Invalid password") {
            newError = { ...isError, password: "error" };
          }
          setIsError({ ...newError });
          notification.error({
            message: error,
            description: "Failed to Login",
          });
        });
    }
    setIsLoading(false);
  };
  return (
    <div>
      <Space direction="vertical">
        <span className="label">Username or Email</span>
        <Input
          id="login-user"
          status={isError.user}
          placeholder="Type username/email..."
          name="user"
          onChange={handleChange}
          prefix={
            <UserOutlined
              className="site-form-item-icon"
              style={{ paddingRight: "5px" }}
            />
          }
          onPressEnter={handleSubmit}
        />
        <span className="label">Password</span>
        <Input.Password
          id="login-password"
          status={isError.password}
          placeholder="Type password..."
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
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <Button
            type="default"
            icon={<LoginOutlined />}
            block
            className={AuthCss.loginButton}
            onClick={handleSubmit}
            loading={isLoading}
          >
            {isLoading ? <>Logging In ...</> : <>Login</>}
          </Button>
        </div>
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <span>
            Don't have an account?{" "}
            <Button type="link" onClick={onPageChange}>
              Register
            </Button>
          </span>
        </div>
      </Space>
    </div>
  );
};

export default Login;
