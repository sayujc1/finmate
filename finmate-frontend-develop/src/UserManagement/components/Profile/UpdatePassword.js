import React, { useState } from "react";
import { Input, Button, notification, Drawer, Row, Col } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";

import { updateUserPassword } from "../../apis/AuthManagementAPI";
import ProfileCss from "../../css/Profile.module.css";

const UpdatePassword = ({ setOpen, open }) => {
  const userDetails = useSelector((state) => state.UserReducer.userDetails);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const onClose = () => {
    setOpen(false);
  };

  let initialState = {
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  };

  const [password, setPassword] = useState(initialState);

  const [isError, setIsError] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const resetState = async () => {
    await setPassword(initialState);
  };

  const handleChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    let newError = { ...isError };

    if (!password.old_password) {
      newError = { ...newError, old_password: "error" };
      notification.error({
        message: "Old Password is required",
        description: "Please enter the old Password",
      });
    }
    if (!password.new_password) {
      newError = { ...newError, new_password: "error" };
      notification.error({
        message: "New Password is required",
        description: "Please enter the new password",
      });
    }
    if (!password.confirm_new_password) {
      newError = { ...newError, confirm_new_password: "error" };
      notification.error({
        message: "Confirm New Password is required",
        description: "Please enter the confirm new password",
      });
    }
    if (password.confirm_new_password !== password.new_password) {
      newError = { ...newError, confirm_new_password: "error" };
      notification.error({
        message: "Password does not match",
        description: "Please re-enter password",
      });
    }

    setIsError({ ...newError });

    if (
      password.old_password &&
      password.new_password &&
      password.confirm_new_password &&
      password.confirm_new_password === password.new_password
    ) {
      let updateuser = {
        username: userDetails.username,
        email: userDetails.email,
        old_password: password.old_password,
        new_password: password.new_password,
      };
      await updateUserPassword(updateuser, dispatch)
        .then((response) => {
          if (response.status === "SUCCESS") {
            setOpen(false);
            resetState();
            notification.success({
              message: "Password Updated Successfully",
              description: "Password Updated Successfully",
            });
          }
        })
        .catch((error) => {
          setOpen(true);
          localStorage.setItem("isAuth", false);
          if (error === "Invalid Password") {
            newError = { ...newError, email: "error" };
          }
          setIsError({ ...newError });
          notification.error({
            message: error,
            description: "Failed to Update Password",
          });
        });
    }
    setIsLoading(false);
  };

  return (
    <>
      <Drawer
        getContainer={false}
        visible={open}
        placement="bottom"
        closable={false}
        onClose={onClose}
        open={open}
        title={
          <>
            <span>Update Password</span>
            <CloseOutlined onClick={onClose} style={{ float: "right" }} />
          </>
        }
      >
        <div>
          <Row className={ProfileCss.drawercenter}>
            <Col
              span={6}
              offset={4}
              style={{
                textAlign: "right",
              }}
            >
              <span className={ProfileCss.passwordLabel}>Password</span>
            </Col>
            <Col
              span={6}
              style={{
                textAlign: "left",
                marginLeft: "20px",
              }}
            >
              <Input.Password
                id="old password"
                status={isError.old_password}
                placeholder="Password"
                onChange={handleChange}
                name="old_password"
                value={password.old_password}
                style={{
                  width: 300,
                }}
              />
            </Col>
          </Row>
          <br />
          <Row className={ProfileCss.drawercenter}>
            <Col
              span={6}
              offset={4}
              style={{
                textAlign: "right",
              }}
            >
              <span className={ProfileCss.passwordLabel}>New Password</span>
            </Col>
            <Col
              span={6}
              style={{
                textAlign: "left",
                marginLeft: "20px",
              }}
            >
              <Input.Password
                id="new password"
                status={isError.new_password}
                placeholder="New password"
                onChange={handleChange}
                name="new_password"
                value={password.new_password}
                style={{
                  width: 300,
                }}
              />
            </Col>
          </Row>
          <br />
          <Row className={ProfileCss.drawercenter}>
            <Col
              span={6}
              offset={4}
              style={{
                textAlign: "right",
              }}
            >
              <span className={ProfileCss.passwordLabel}>
                Confirm New Password
              </span>
            </Col>
            <Col
              span={6}
              style={{
                textAlign: "left",
              }}
            >
              <Input.Password
                id="confirm new password"
                status={isError.confirm_new_password}
                placeholder="Confirm New password"
                onChange={handleChange}
                name="confirm_new_password"
                value={password.confirm_new_password}
                style={{
                  width: 300,
                  marginLeft: "20px",
                }}
              />
            </Col>
          </Row>
          <br />
        </div>
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <Button type="primary" loading={isLoading} onClick={handleSubmit}>
            {isLoading ? <>Updating ...</> : <>Update</>}
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default UpdatePassword;
