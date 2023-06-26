import React, { useEffect, useState } from "react";
import "./App.css";
import { Suspense, lazy } from "react";
import {
  Route,
  Switch,
  useHistory,
  Redirect,
  useLocation,
} from "react-router-dom";
import Navbar from "./common/components/Navbar";
import { Layout } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import ProtectRoute from "./UserManagement/components/auth/ProtectRoute";
import { setIsAuth } from "./UserManagement/actions/AuthManagementAction";
import { getUserDetails } from "./UserManagement/apis/UserManagementAPI";

const { Sider, Header, Content } = Layout;
const ProfileRoot = lazy(() =>
  import("./UserManagement/components/Profile/ProfileRoot")
);
const AuthRoot = lazy(() =>
  import("./UserManagement/components/auth/AuthRoot")
);
// const PageNotFound = lazy(() => import("./common/components/PageNotFound"));

const App = () => {
  const location = useLocation();
  const history = useHistory();
  const isAuth = useSelector(state => state.AuthReducer.isAuth);

  const dispatch = useDispatch();
  useEffect(() => {
    // check if user is logged in on refresh
    const checkAuth = async () => {
      await getUserDetails(dispatch)
        .then(response => {
          if (response.status === "SUCCESS") {
            localStorage.setItem("isAuth", true);
            dispatch(setIsAuth(true));
          }
        })
        .catch(error => {
          localStorage.setItem("isAuth", false);
          dispatch(setIsAuth(false));
          history.push("/auth");
        });
    };

    if (isAuth || localStorage.getItem("isAuth") === "true") {
      checkAuth();
    }
    if (!isAuth || localStorage.getItem("isAuth") === "false") {
      checkAuth();
    }
    // eslint-disable-next-line
  }, [isAuth, localStorage.getItem("token"), localStorage.getItem("isAuth")]);

  const [collapsed, setCollapsed] = useState(false);

  const DashboardManagementRoot = lazy(() =>
    import("./DashboardManagement/components/DashboardManagementRoot")
  );
  const IncomeManagementRoot = lazy(() =>
    import("./Incomes/components/IncomeManagementRoot")
  );
  const ExpenseManagementRoot = lazy(() =>
    import("./Expenses/components/ExpenseManagementRoot")
  );
  const SavingsManagementRoot = lazy(() =>
    import("./Savings/components/SavingsManagementRoot")
  );
  const TransactionsManagementRoot = lazy(() =>
    import("./Transactions/components/TransactionsManagementRoot")
  );
  const BudgetManagementRoot = lazy(() =>
    import("./BudgetManagement/components/BudgetManagementRoot")
  );
  const BillManagementRoot = lazy(() =>
    import("./BillManagement/components/BillManagementRoot")
  );
  return (
    <div className="App">
      <Layout>
        {isAuth && (
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            theme="light"
            style={{
              borderRadius: "20px",
              margin: "10px",
              boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            }}
          >
            <Navbar />
          </Sider>
        )}
        <Suspense fallback={"Loading..."}>
          <Switch>
            <>
              <Layout>
                {isAuth && (
                  <Header className="skr-header">
                    <>
                      {collapsed ? (
                        <MenuUnfoldOutlined
                          className="menu-icon"
                          onClick={() => setCollapsed(prev => !prev)}
                        />
                      ) : (
                        <MenuFoldOutlined
                          className="menu-icon"
                          onClick={() => setCollapsed(prev => !prev)}
                        />
                      )}
                      <ProfileRoot />
                    </>
                  </Header>
                )}
                {isAuth ? (
                  <Redirect to={location.pathname} />
                ) : (
                  <Route exact path="/auth" component={AuthRoot} />
                )}
                {isAuth && (
                  <Content className="skr-content">
                    <ProtectRoute
                      exact
                      path="/"
                      component={DashboardManagementRoot}
                    />
                    <ProtectRoute
                      exact
                      path="/incomes"
                      component={IncomeManagementRoot}
                    />
                    <ProtectRoute
                      exact
                      path="/expenses"
                      component={ExpenseManagementRoot}
                    />
                    <ProtectRoute
                      exact
                      path="/savings"
                      component={SavingsManagementRoot}
                    />
                    <ProtectRoute
                      exact
                      path="/transactions"
                      component={TransactionsManagementRoot}
                    />
                    <ProtectRoute
                      exact
                      path="/budget"
                      component={BudgetManagementRoot}
                    />
                    <ProtectRoute
                      exact
                      path="/bill"
                      component={BillManagementRoot}
                    />
                    {/* <Route path="*">
                      <Redirect to="/" />
                    </Route> */}
                  </Content>
                )}
              </Layout>
            </>
          </Switch>
        </Suspense>
      </Layout>
    </div>
  );
};

export default App;
