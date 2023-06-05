import React, {useState} from "react";
import AuthCss from "../../css/Auth.module.css";
import Login from "./Login";
import Register from "./Register";
import { Row, Tabs, Col, Card } from "antd";
import "../../css/AuthOverride.css";
// const { TabPane } = Tabs;

const AuthRoot = () => {
  const [activePage, setActivePage] = useState("login");
  return (
    <div className={AuthCss.container}>
        <Row
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {/* Sign In or Log in */}
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 8 }}
          lg={{ span: 8 }}
          style={{
           display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
                      }}
        >
          <Row>
              <Col
                xs={{ span: 24 }}
                lg={{ span: 24 }}
              >
                <img
                  src={process.env.PUBLIC_URL + "/images/logo_transparent.png"}
                  alt="logo"
                  className="logo"
                />
              </Col>
            </Row>
          <Row>
            <Col
              xs={{ span: 24 }}
              lg={{ span: 24 }}
              >
                <div className={AuthCss.requestForm}>
            <Card bordered={false} style={{borderRadius: "20px", backgroundColor: "rgba(255, 255, 255, 0.8)",backdropFilter: "blur(10px)",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)", width: "100%"}} title={activePage === "login"?<div style={{textAlign:"center"}}>Sign In</div>: <div style={{textAlign:"center"}}>Create An Account</div>}>
             {activePage==="login"? <Login setActivePage={setActivePage}/>: <Register setActivePage={setActivePage}/>} 
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
          style={{padding: "10px"}}
        >
            <img
                  src={process.env.PUBLIC_URL + "/images/logo_transparent.png"}
                  alt="logo"
                  style={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "20px",
                      width: "100%",
                      height: "97vh",
                      boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                    }}
                />
        </Col>
      </Row>
    </div>
  );
};

export default AuthRoot;
