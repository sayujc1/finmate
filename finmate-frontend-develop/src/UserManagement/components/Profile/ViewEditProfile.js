import React, { useEffect, useState } from "react";
import {
  Avatar,
  Col,
  Row,
  Card,
  Tag,
  Input,
  Button,
  notification,
  DatePicker,
  Alert,
} from "antd";
import {
  UserOutlined,
  EditFilled,
  CloseSquareFilled,
  CheckSquareFilled,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserDetails,
  getDepartments,
  getDesignations,
  updateUserDetails,
} from "../../apis/UserManagementAPI";
import UpdatePassword from "./UpdatePassword";
import moment from "moment";
import { ERROR_PROFILE } from "../../utils/ObjectConstants";
import { profileValidation } from "../../utils/Validation";
import ProfileCss from "../../css/Profile.module.css";
import "../../css/ProfileOverride.css";

const ViewEditProfile = () => {
  const [isEdit, setIsEdit] = useState(false);

  const [loading, setLoading] = useState(false);
  const userDetails = useSelector((state) => state.UserReducer.userDetails);
  const designationList = useSelector(
    (state) => state.UserReducer.designations
  );
  const departmentList = useSelector((state) => state.UserReducer.departments);
  const genderList = useSelector((state) => state.UserReducer.genderList);
  const categoryList = useSelector((state) => state.UserReducer.categoryList);
  const [editUserDetails, setEditUserDetails] = useState({});
  const [profileErrors, setProfileErrors] = useState(
    JSON.parse(JSON.stringify(ERROR_PROFILE))
  );
  const dispatch = useDispatch();

  const loadDepartments = async () => {
    await getDepartments(dispatch).catch((err) => {
      notification.error({
        message: err,
        description: "Failed to load Departments",
      });
    });
  };

  const loadDesignations = async () => {
    await getDesignations(dispatch).catch((err) => {
      notification.error({
        message: err,
        description: "Failed to load Designations",
      });
    });
  };

  const fetchUserProfile = async () => {
    await getUserDetails(dispatch).catch((err) => {
      notification.error({
        message: err,
        description: "Failed to load user profile",
      });
    });
  };

  useEffect(() => {
    loadDepartments();
    loadDesignations();
    fetchUserProfile();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setEditUserDetails({ ...editUserDetails, [e.target.name]: e.target.value });
  };

  const handleDobChange = (date, dateString) => {
    setEditUserDetails({ ...editUserDetails, dob: dateString });
  };

  const handleEditDetails = () => {
    setEditUserDetails({ ...userDetails });
    setIsEdit(true);
  };

  const handleCancel = () => {
    setProfileErrors(JSON.parse(JSON.stringify(ERROR_PROFILE)));
    setIsEdit(false);
    setEditUserDetails({});
  };

  const handleSave = async () => {
    setLoading(true);
    await profileValidation(editUserDetails, profileErrors)
      .then(async () => {
        setProfileErrors(JSON.parse(JSON.stringify(ERROR_PROFILE)));
        await updateUserDetails(editUserDetails)
          .then(async (response) => {
            notification.success({
              message: "Profile Updated Successfully",
            });
            fetchUserProfile();
            setIsEdit(false);
          })
          .catch((err) => {
            notification.error({
              message: err,
              description: "Failed to update user profile",
            });
          });
      })
      .catch((profileErr) => {
        setProfileErrors({ ...profileErr });
      });
    setLoading(false);
  };

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  return (
    <div>
      <Row>
        <Col
          span={24}
          style={{
            textAlign: "left",
            paddingLeft: "10px",
            paddingRight: "10px",
          }}
        >
          {/* Profile Header */}
          <Card hoverable className={ProfileCss.ProfileCard}>
            <Row>
              <Col span={3}>
                <Avatar
                  size={{ xs: 38, sm: 44, md: 60, lg: 80, xl: 140, xxl: 180 }}
                  icon={<UserOutlined />}
                  style={{
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
                  }}
                ></Avatar>
              </Col>
              <Col
                span={20}
                offset={1}
                style={{
                  textAlign: "left",
                }}
              >
                {isEdit ? (
                  <>
                    <Input
                      bordered={false}
                      value={editUserDetails?.name}
                      name="name"
                      onChange={handleChange}
                      style={{
                        width: "fit-content",
                        color: "#000",
                        borderBottom: "1px solid #e8e8e8",
                      }}
                      showCount={isEdit}
                      maxLength={25}
                      allowClear
                    />
                  </>
                ) : (
                  <span className={ProfileCss.name}>{userDetails?.name} </span>
                )}
                {userDetails?.role?.map((item) => {
                  return (
                    <Tag
                      key={item.role_id}
                      color="blue"
                      style={{
                        marginLeft: "10px",
                        padding: "5px",
                      }}
                    >
                      {item.role}
                    </Tag>
                  );
                })}
                {isEdit ? (
                  <>
                    <Button
                      type="primary"
                      onClick={handleSave}
                      icon={<CheckSquareFilled />}
                      loading={loading}
                    >
                      {loading ? <>Saving ...</> : <>Save Changes</>}
                    </Button>
                    <Button
                      style={{ margin: "5px" }}
                      type="danger"
                      onClick={handleCancel}
                      icon={<CloseSquareFilled />}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    size="large"
                    type="default"
                    icon={<EditFilled />}
                    style={{ border: "none" }}
                    onClick={handleEditDetails}
                  />
                )}
                {isEdit && profileErrors?.name && (
                  <Alert
                    message={profileErrors.name}
                    type="error"
                    showIcon
                    style={{
                      width: "fit-content",
                      color: "#000",
                      marginTop: "5px",
                      marginBottom: "5px",
                    }}
                  />
                )}
                <h3 className={ProfileCss.username}>
                  @{userDetails?.username}
                </h3>
                <Button
                  type="primary"
                  className={ProfileCss.center}
                  onClick={showDrawer}
                >
                  Update Password
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
        <UpdatePassword setOpen={setOpen} open={open} />

        {/* Profile Section */}
        {userDetails.t_id && (
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 11 }}
            xl={{ span: 11 }}
            xxl={{ span: 11 }}
            style={{
              marginTop: "15px",
              color: "#000000d9",
              paddingLeft: "10px",
              paddingRight: "10px",
              minHeight: "100%",
            }}
          >
            <Card
              hoverable
              title="Profile"
              className={ProfileCss.detailsSection}
              style={{ height: "100%" }}
            >
              {(isEdit || userDetails?.designation) && (
                <Row>
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 6 }}
                    xl={{ span: 6 }}
                    xxl={{ span: 6 }}
                  >
                    <h3 className={ProfileCss.username}>Designation:</h3>
                  </Col>
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 17, push: 1 }}
                    xl={{ span: 17, push: 1 }}
                    xxl={{ span: 17, push: 1 }}
                  >
                    {isEdit && userDetails.role === "ADMIN" ? (
                      <>
                        <select
                          id="designation"
                          value={editUserDetails?.designation}
                          onChange={(e) => handleChange(e)}
                          name="designation"
                        >
                          {designationList?.map((depl, index) => {
                            return (
                              <option key={index} value={depl.designation}>
                                {depl.designation}
                              </option>
                            );
                          })}
                        </select>
                      </>
                    ) : (
                      <Input
                        className={ProfileCss.displayInputs}
                        bordered={false}
                        value={userDetails?.designation}
                        disabled
                      />
                    )}
                  </Col>
                </Row>
              )}

              {(isEdit || userDetails?.department) && (
                <Row>
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 6 }}
                    xl={{ span: 6 }}
                    xxl={{ span: 6 }}
                  >
                    <h3 className={ProfileCss.username}>Department:</h3>
                  </Col>
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 17, push: 1 }}
                    xl={{ span: 17, push: 1 }}
                    xxl={{ span: 17, push: 1 }}
                  >
                    {isEdit && userDetails.role === "ADMIN" ? (
                      <select
                        id="department"
                        value={editUserDetails?.department}
                        onChange={(e) => handleChange(e)}
                        name="department"
                      >
                        {departmentList?.map((depl, index) => {
                          return (
                            <option key={index} value={depl.department}>
                              {depl.department}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      <Input
                        className={ProfileCss.displayInputs}
                        bordered={false}
                        value={userDetails?.department}
                        disabled
                      />
                    )}
                  </Col>
                </Row>
              )}
            </Card>
          </Col>
        )}
        {/* Contact Information  */}
        <Col
          xs={{ span: 24, push: 0 }}
          sm={{ span: 24, push: 0 }}
          md={{ span: 24, push: 0 }}
          lg={{ span: 13, push: 0 }}
          xl={{ span: 13, push: 0 }}
          xxl={{ span: 13, push: 0 }}
          style={{
            marginTop: "15px",
            color: "#000000d9",
            paddingLeft: "10px",
            paddingRight: "10px",
          }}
        >
          <Card
            hoverable
            title="Contact Information"
            className={ProfileCss.detailsSection}
          >
            <Row>
              {userDetails.t_id && (isEdit || userDetails?.phone) && (
                <>
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 3 }}
                    xl={{ span: 3 }}
                    xxl={{ span: 3 }}
                  >
                    <h3 className={ProfileCss.username}>Phone:</h3>
                  </Col>
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 20, push: 1 }}
                    xl={{ span: 20, push: 1 }}
                    xxl={{ span: 20, push: 1 }}
                  >
                    <Input
                      bordered={false}
                      className={ProfileCss.displayInputs}
                      value={
                        !isEdit ? userDetails?.phone : editUserDetails?.phone
                      }
                      disabled={!isEdit}
                      name="phone"
                      onChange={handleChange}
                      showCount={isEdit}
                      maxLength={10}
                      allowClear
                    />
                    {profileErrors?.phone && (
                      <Alert
                        message={profileErrors.phone}
                        type="error"
                        showIcon
                        className={ProfileCss.displayErrors}
                      />
                    )}
                  </Col>
                </>
              )}
              {(isEdit || userDetails?.email) && (
                <>
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 3 }}
                    xl={{ span: 3 }}
                    xxl={{ span: 3 }}
                  >
                    <h3 className={ProfileCss.username}>Email:</h3>
                  </Col>
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 20, push: 1 }}
                    xl={{ span: 20, push: 1 }}
                    xxl={{ span: 20, push: 1 }}
                  >
                    <Input
                      disabled={!isEdit}
                      bordered={false}
                      className={ProfileCss.displayInputs}
                      value={
                        !isEdit ? userDetails?.email : editUserDetails?.email
                      }
                      name="email"
                      onChange={handleChange}
                      showCount={isEdit}
                      maxLength={50}
                      allowClear
                    />
                    {profileErrors?.email && (
                      <Alert
                        message={profileErrors.email}
                        type="error"
                        showIcon
                        className={ProfileCss.displayErrors}
                      />
                    )}
                  </Col>
                </>
              )}
              {userDetails.t_id && (isEdit || userDetails?.address) && (
                <>
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 3 }}
                    xl={{ span: 3 }}
                    xxl={{ span: 3 }}
                  >
                    <h3 className={ProfileCss.username}>Address:</h3>
                  </Col>
                  <Col
                    xs={{ span: 24 }}
                    sm={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 20, push: 1 }}
                    xl={{ span: 20, push: 1 }}
                    xxl={{ span: 20, push: 1 }}
                  >
                    <Input.TextArea
                      className={ProfileCss.displayInputs}
                      value={
                        !isEdit
                          ? userDetails?.address
                          : editUserDetails?.address
                      }
                      bordered={false}
                      placeholder=""
                      name="address"
                      autoSize={{ minRows: 1, maxRows: 4 }}
                      disabled={!isEdit}
                      onChange={handleChange}
                      showCount={isEdit}
                      maxLength={75}
                      allowClear
                    />
                    {profileErrors?.address && (
                      <Alert
                        message={profileErrors.address}
                        type="error"
                        showIcon
                        className={ProfileCss.displayErrors}
                      />
                    )}
                  </Col>
                </>
              )}
            </Row>
          </Card>
        </Col>
        {/* Basic Information */}
        {userDetails.t_id && (
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 24 }}
            xl={{ span: 24 }}
            xxl={{ span: 24 }}
            style={{
              marginTop: "15px",
              color: "#000000d9",
              paddingLeft: "10px",
              paddingRight: "10px",
              paddingBottom: "10px",
            }}
          >
            <Card
              hoverable
              title="Basic Information"
              className={ProfileCss.detailsSection}
            >
              <Row>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 11 }}
                  xl={{ span: 11 }}
                  xxl={{ span: 11 }}
                >
                  {(isEdit || userDetails?.dob) && (
                    <Row>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 24 }}
                        lg={{ span: 5 }}
                        xl={{ span: 5 }}
                        xxl={{ span: 5 }}
                      >
                        <h3 className={ProfileCss.username}>Date of Birth:</h3>
                      </Col>
                      <Col
                        xs={{ span: 24, push: 0 }}
                        sm={{ span: 24, push: 0 }}
                        md={{ span: 24, push: 0 }}
                        lg={{ span: 17, push: 1 }}
                        xl={{ span: 17, push: 1 }}
                        xxl={{ span: 17, push: 1 }}
                      >
                        {isEdit ? (
                          <DatePicker
                            style={{ width: 150 }}
                            value={
                              editUserDetails.dob && moment(editUserDetails.dob)
                            }
                            onChange={(date, dateString) =>
                              handleDobChange(date, dateString)
                            }
                          />
                        ) : (
                          <Input
                            bordered={false}
                            className={ProfileCss.displayInputs}
                            value={userDetails?.dob}
                            disabled={!isEdit}
                          />
                        )}
                      </Col>
                    </Row>
                  )}
                  {(isEdit || userDetails?.gender) && (
                    <Row>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 24 }}
                        lg={{ span: 5 }}
                        xl={{ span: 5 }}
                        xxl={{ span: 5 }}
                      >
                        <h3 className={ProfileCss.username}>Gender:</h3>
                      </Col>
                      <Col
                        xs={{ span: 24, push: 0 }}
                        sm={{ span: 24, push: 0 }}
                        md={{ span: 24, push: 0 }}
                        lg={{ span: 17, push: 1 }}
                        xl={{ span: 17, push: 1 }}
                        xxl={{ span: 17, push: 1 }}
                      >
                        {isEdit ? (
                          <>
                            <select
                              id="gender"
                              value={editUserDetails?.gender}
                              onChange={handleChange}
                              name="gender"
                            >
                              {genderList.map((gl, index) => {
                                return (
                                  <option key={index} value={gl.value}>
                                    {gl.label}
                                  </option>
                                );
                              })}
                            </select>
                          </>
                        ) : (
                          <Input
                            bordered={false}
                            className={ProfileCss.displayInputs}
                            value={userDetails?.gender}
                            disabled
                          />
                        )}
                      </Col>
                    </Row>
                  )}
                  {(isEdit || userDetails?.category) && (
                    <Row>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 24 }}
                        lg={{ span: 5 }}
                        xl={{ span: 5 }}
                        xxl={{ span: 5 }}
                      >
                        <h3 className={ProfileCss.username}>Category:</h3>
                      </Col>
                      <Col
                        xs={{ span: 24, push: 0 }}
                        sm={{ span: 24, push: 0 }}
                        md={{ span: 24, push: 0 }}
                        lg={{ span: 17, push: 1 }}
                        xl={{ span: 17, push: 1 }}
                        xxl={{ span: 17, push: 1 }}
                      >
                        {isEdit ? (
                          <select
                            id="category"
                            value={editUserDetails?.category}
                            onChange={handleChange}
                            name="category"
                          >
                            {categoryList.map((cl, index) => {
                              return (
                                <option key={index} value={cl.value}>
                                  {cl.label}
                                </option>
                              );
                            })}
                          </select>
                        ) : (
                          <Input
                            bordered={false}
                            className={ProfileCss.displayInputs}
                            value={userDetails?.category}
                            disabled
                          />
                        )}
                      </Col>
                    </Row>
                  )}
                </Col>
                <Col
                  xs={{ span: 24, push: 0 }}
                  sm={{ span: 24, push: 0 }}
                  md={{ span: 24, push: 0 }}
                  lg={{ span: 11, push: 1 }}
                  xl={{ span: 11, push: 1 }}
                  xxl={{ span: 11, push: 1 }}
                >
                  {(isEdit || userDetails?.aadhaar_no) && (
                    <Row>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 24 }}
                        lg={{ span: 5 }}
                        xl={{ span: 5 }}
                        xxl={{ span: 5 }}
                      >
                        <h3 className={ProfileCss.username}>Aadhaar No. :</h3>
                      </Col>
                      <Col
                        xs={{ span: 24, push: 0 }}
                        sm={{ span: 24, push: 0 }}
                        md={{ span: 24, push: 0 }}
                        lg={{ span: 17, push: 1 }}
                        xl={{ span: 17, push: 1 }}
                        xxl={{ span: 17, push: 1 }}
                      >
                        <Input
                          bordered={false}
                          className={ProfileCss.displayInputs}
                          value={
                            !isEdit
                              ? userDetails?.aadhaar_no
                              : editUserDetails?.aadhaar_no
                          }
                          disabled={!isEdit}
                          name="aadhaar_no"
                          onChange={handleChange}
                          showCount={isEdit}
                          maxLength={12}
                          allowClear
                        />
                        {profileErrors?.aadhaar_no && (
                          <Alert
                            message={profileErrors.aadhaar_no}
                            type="error"
                            showIcon
                            className={ProfileCss.displayErrors}
                          />
                        )}
                      </Col>
                    </Row>
                  )}
                  {(isEdit || userDetails?.pan_no) && (
                    <Row>
                      <Col
                        xs={{ span: 24 }}
                        sm={{ span: 24 }}
                        md={{ span: 24 }}
                        lg={{ span: 5 }}
                        xl={{ span: 5 }}
                        xxl={{ span: 5 }}
                      >
                        <h3 className={ProfileCss.username}>PAN No. :</h3>
                      </Col>
                      <Col
                        xs={{ span: 24, push: 0 }}
                        sm={{ span: 24, push: 0 }}
                        md={{ span: 24, push: 0 }}
                        lg={{ span: 17, push: 1 }}
                        xl={{ span: 17, push: 1 }}
                        xxl={{ span: 17, push: 1 }}
                      >
                        <Input
                          bordered={false}
                          className={ProfileCss.displayInputs}
                          value={
                            !isEdit
                              ? userDetails?.pan_no
                              : editUserDetails?.pan_no
                          }
                          disabled={!isEdit}
                          name="pan_no"
                          onChange={handleChange}
                          showCount={isEdit}
                          maxLength={10}
                          allowClear
                        />
                        {profileErrors?.pan_no && (
                          <Alert
                            message={profileErrors.pan_no}
                            type="error"
                            showIcon
                            className={ProfileCss.displayErrors}
                          />
                        )}
                      </Col>
                    </Row>
                  )}
                </Col>
              </Row>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default ViewEditProfile;
