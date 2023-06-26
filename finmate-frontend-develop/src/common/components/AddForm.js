import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  notification,
  Popconfirm,
  Select,
  Alert,
  Input,
  DatePicker,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import AddFormCss from "../css/AddForm.module.css";
import "../css/AddFormOverride.css";
import TextArea from "antd/lib/input/TextArea";
import { CloseSquareFilled, CheckSquareFilled } from "@ant-design/icons";
import { AddFormDetails, UpdateForm } from "../apis/CommonAPI";
import moment from "moment";
import { AddFormValidate } from "../utils/Validation";
import {
  INCOME_CATEGORY,
  EXPENSE_CATEGORY,
  SAVINGS_CATEGORY,
} from "../utils/Constants";
import { resetEditState } from "../actions/CommonAction";

const AddForm = ({
  addForm,
  setAddForm,
  AddFormErrors,
  setAddFormErrors,
  reducer,
  formType,
  setModal,
}) => {
  const commonReducer = useSelector(state => state.CommonReducer);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const categoryList =
    formType === "Income"
      ? INCOME_CATEGORY
      : formType === "Expense"
      ? EXPENSE_CATEGORY
      : SAVINGS_CATEGORY;

  const isEdit = commonReducer.isEdit;
  const handleAddFormChange = e => {
    const { name, value } = e.target;
    setAddForm({ ...addForm, [name]: value });
    setAddFormErrors({ ...AddFormErrors, [name]: "" });
  };

  const handleReset = () => {
    isEdit
      ? setAddForm({
          ...commonReducer.editData,
        })
      : setAddForm({
          type: formType,
          description: "",
          amount: "",
          date: "",
          category: "",
          category_others: "",
          remarks: "",
        });
    setAddFormErrors({});
  };

  const handleSave = async () => {
    setLoading(true);

    await AddFormValidate(addForm, AddFormErrors)
      .then(async () => {
        setAddFormErrors({});
        isEdit
          ? await UpdateForm(
              reducer,
              commonReducer.editData,
              addForm,
              formType,
              dispatch
            )
              .then(response => {
                notification.success({
                  message: "Successfully Updated " + formType,
                });
                handleReset();
                dispatch(resetEditState());
                setModal(false);
              })
              .catch(err => {
                notification.error({
                  message: "Failed to Update " + formType,
                  description: err,
                  duration: 8,
                });
              })
          : await AddFormDetails(reducer, addForm, formType, dispatch)
              .then(response => {
                notification.success({
                  message: "Successfully Created " + formType,
                });
                handleReset();
              })
              .catch(err => {
                notification.error({
                  message: "Failed to Create " + formType,
                  description: err,
                  duration: 8,
                });
              });
      })
      .catch(err => {
        setAddFormErrors({ ...err });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleCategoryChange = value => {
    setAddForm({ ...addForm, category: value });
    setAddFormErrors({ ...AddFormErrors, category: "" });
  };
  const handleDateChange = (date, dateString) => {
    setAddForm({ ...addForm, date: dateString });
    setAddFormErrors({ ...AddFormErrors, date: "" });
  };
  useEffect(() => {
    isEdit && setAddForm(commonReducer.editData);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div className={AddFormCss.addForm}>
        <Card
          title={
            !isEdit && (
              <div style={{ textAlign: "center" }}>Add {`${formType}`}</div>
            )
          }
          bordered={false}
          className={AddFormCss.addFormCard}
        >
          <>
            <div className={AddFormCss.formLabel}>
              Description: <span className={AddFormCss.mandatory}>*</span>
            </div>
            <Input
              className={AddFormCss.addFormInput}
              placeholder="Enter Description"
              name="description"
              onChange={handleAddFormChange}
              value={addForm?.description}
            />
            {AddFormErrors?.description && (
              <Alert
                className={`${AddFormCss.errorAlert}`}
                message={AddFormErrors.description}
                type="error"
                showIcon
              />
            )}
            <div className={AddFormCss.formLabel}>
              Amount: <span className={AddFormCss.mandatory}>*</span>
            </div>
            <Input
              className={AddFormCss.addFormInput}
              placeholder="Enter Amount(in Rs.)"
              name="amount"
              type="number"
              onChange={handleAddFormChange}
              value={addForm?.amount}
            />
            {AddFormErrors?.amount && (
              <Alert
                className={`${AddFormCss.errorAlert}`}
                message={AddFormErrors.amount}
                type="error"
                showIcon
              />
            )}
            <div className={AddFormCss.formLabel}>
              Date: <span className={AddFormCss.mandatory}>*</span>
            </div>
            <DatePicker
              className={AddFormCss.addFormInput}
              placeholder="Enter Date"
              onChange={handleDateChange}
              value={addForm?.date && moment(addForm?.date, "DD/MM/YYYY")}
              name="date"
              picker="date"
              format="DD/MM/YYYY"
              disabledDate={current => {
                return current && current > moment().endOf("day");
              }}
            />
            {AddFormErrors?.date && (
              <Alert
                className={`${AddFormCss.errorAlert}`}
                message={AddFormErrors.date}
                type="error"
                showIcon
              />
            )}
            <div className={AddFormCss.formLabel}>
              Category: <span className={AddFormCss.mandatory}>*</span>
            </div>
            <Select
              showSearch
              onChange={handleCategoryChange}
              value={addForm?.category}
              name="category"
              style={{
                width: "100%",
                marginTop: "10px",
              }}
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.name.includes(input.toLowerCase())
              }
              options={categoryList}
            ></Select>
            {AddFormErrors?.category && (
              <Alert
                className={`${AddFormCss.errorAlert}`}
                message={AddFormErrors.category}
                type="error"
                showIcon
              />
            )}
            {addForm?.category === "Other" && (
              <>
                <Input
                  className={AddFormCss.addFormInput}
                  placeholder="Enter Category"
                  name="category_others"
                  onChange={handleAddFormChange}
                  value={addForm?.category_others}
                />
                {AddFormErrors?.category_others && (
                  <Alert
                    className={`${AddFormCss.errorAlert}`}
                    message={AddFormErrors.category_others}
                    type="error"
                    showIcon
                  />
                )}
              </>
            )}
            <div className={AddFormCss.formLabel}>Remarks: </div>
            <TextArea
              bordered={true}
              style={{ marginBottom: "25px", marginTop: "10px" }}
              placeholder="Enter Remarks"
              onChange={handleAddFormChange}
              value={addForm?.remarks}
              name="remarks"
              showCount
              maxLength={75}
              autoSize={{ minRows: 2, maxRows: 4 }}
              allowClear
            />
            <>
              <Popconfirm
                title={`Are you sure you want to ${
                  isEdit ? "Edit" : "Add"
                } ${formType}?`}
                onConfirm={handleSave}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  className={AddFormCss.saveButton}
                  type="primary"
                  icon={<CheckSquareFilled />}
                  loading={loading}
                >
                  {loading ? (
                    <>Saving ...</>
                  ) : (
                    <>
                      {`${isEdit ? "Edit" : "Add"}`} {`${formType}`}
                    </>
                  )}
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Are you sure you want to Reset?"
                onConfirm={handleReset}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  className={AddFormCss.resetButton}
                  type="danger"
                  icon={<CloseSquareFilled />}
                >
                  Reset
                </Button>
              </Popconfirm>
            </>
          </>
        </Card>
      </div>
    </>
  );
};
export default AddForm;
