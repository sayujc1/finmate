import React, { useState } from "react";
import AuthCss from "../../css/Auth.module.css";
import Login from "./Login";
import Register from "./Register";
import { Row, Col, Card } from "antd";
import "../../css/AuthOverride.css";

const AuthRoot = () => {
  const [activePage, setActivePage] = useState("login");
  return (
    <div className={AuthCss.container}>
      <Row className={AuthCss.authRowContainer}>
        {/* Log in or Register */}
        <Col
          className={AuthCss.authColContainer}
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 8 }}
          lg={{ span: 8 }}
        >
          <Row>
            <Col xs={{ span: 24 }} lg={{ span: 24 }}>
              <img
                src={process.env.PUBLIC_URL + "/images/logo_transparent.png"}
                alt="logo"
                className="logo"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={{ span: 24 }} lg={{ span: 24 }}>
              <div className={AuthCss.requestForm}>
                <Card
                  className={AuthCss.authFormContainer}
                  bordered={false}
                  title={
                    activePage === "login" ? (
                      <div style={{ textAlign: "center" }}>Sign In</div>
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        Create An Account
                      </div>
                    )
                  }
                >
                  {activePage === "login" ? (
                    <Login setActivePage={setActivePage} />
                  ) : (
                    <Register setActivePage={setActivePage} />
                  )}
                </Card>
              </div>
            </Col>
          </Row>
        </Col>
        {/* img */}
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 15 }}
          lg={{ span: 15 }}
          style={{ padding: "10px", height: "100vh" }}
        >
          <img
            className={AuthCss.loginScreenImage}
            src={process.env.PUBLIC_URL + "/images/loginScreenImage.png"}
            alt="loginScreenImage"
          />
        </Col>
      </Row>
    </div>
  );
};

export default AuthRoot;
