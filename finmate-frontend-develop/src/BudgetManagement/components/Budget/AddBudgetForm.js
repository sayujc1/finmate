import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  notification,
  Popconfirm,
  Alert,
  Input,
  DatePicker,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import AddBudgetFormCss from "../../css/AddBudgetForm.module.css";
import "../../css/AddBudgetFormOverride.css";
import TextArea from "antd/lib/input/TextArea";
import { CloseSquareFilled, CheckSquareFilled } from "@ant-design/icons";
import {
  AddBudgetFormDetails,
  UpdateForm,
} from "../../apis/BudgetManagementAPI";
import moment from "moment";
import { AddBudgetFormValidate } from "../../utils/Validation";
import { resetEditState } from "../../actions/BudgetManagementAction";
const { RangePicker } = DatePicker;

const AddBudgetForm = ({
  addBudgetForm,
  setAddBudgetForm,
  AddBudgetFormErrors,
  setAddBudgetFormErrors,
  reducer,
  setModal,
}) => {
  const budgetReducer = useSelector(state => state.BudgetReducer);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const isEdit = budgetReducer.isEdit;
  const handleAddBudgetFormChange = e => {
    const { name, value } = e.target;
    setAddBudgetForm({ ...addBudgetForm, [name]: value });
    setAddBudgetFormErrors({ ...AddBudgetFormErrors, [name]: "" });
  };

  const handleReset = () => {
    setAddBudgetForm({
      start_date: "",
      end_date: "",
      budget: "",
      spent: "",
      status: "",
      remarks: "",
      is_recurring: 0,
    });
    setValue([moment().format("DD/MM/YYYY"), moment().format("DD/MM/YYYY")]);
    setAddBudgetFormErrors({});
  };

  const handleSave = async () => {
    setLoading(true);

    await AddBudgetFormValidate(addBudgetForm, AddBudgetFormErrors)
      .then(async () => {
        setAddBudgetFormErrors({});
        isEdit
          ? await UpdateForm(
              reducer,
              budgetReducer.editData,
              addBudgetForm,
              dispatch
            )
              .then(response => {
                notification.success({
                  message: "Budget Successfully Updated",
                });
                handleReset();
                dispatch(resetEditState());
                setModal(false);
              })
              .catch(err => {
                notification.error({
                  message: "Failed to Update Budget",
                  description: err,
                  duration: 8,
                });
              })
          : await AddBudgetFormDetails(reducer, addBudgetForm, dispatch)
              .then(response => {
                notification.success({
                  message: "Budget Successfully Created",
                });
                handleReset();
              })
              .catch(err => {
                notification.error({
                  message: "Failed to Create Budget",
                  description: err,
                  duration: 8,
                });
              });
      })
      .catch(err => {
        setAddBudgetFormErrors({ ...err });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const [value, setValue] = useState([
    moment().format("DD/MM/YYYY"),
    moment().format("DD/MM/YYYY"),
  ]);

  const onChange = (value, dateString) => {
    setValue(dateString);
    setAddBudgetForm({
      ...addBudgetForm,
      start_date: dateString[0],
      end_date: dateString[1],
    });
  };
  useEffect(() => {
    isEdit && setAddBudgetForm(budgetReducer.editData);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div className={AddBudgetFormCss.addBudgetForm}>
        <Card
          title={
            !isEdit && <div style={{ textAlign: "center" }}>Add Budget</div>
          }
          bordered={false}
          className={AddBudgetFormCss.addBudgetFormCard}
        >
          <>
            <div className={AddBudgetFormCss.formLabel}>
              Budget: <span className={AddBudgetFormCss.mandatory}>*</span>
            </div>
            <Input
              className={AddBudgetFormCss.addBudgetFormInput}
              placeholder="Enter Budget(in Rs.)"
              name="budget"
              type="number"
              onChange={handleAddBudgetFormChange}
              value={addBudgetForm?.budget}
            />
            {AddBudgetFormErrors?.budget && (
              <Alert
                className={`${AddBudgetFormCss.errorAlert}`}
                message={AddBudgetFormErrors.budget}
                type="error"
                showIcon
              />
            )}

            <div className={AddBudgetFormCss.formLabel}>
              Date: <span className={AddBudgetFormCss.mandatory}>*</span>
            </div>
            <RangePicker
              name="date"
              defaultValue={[
                moment().format("DD/MM/YYYY"),
                moment().format("DD/MM/YYYY"),
              ]}
              value={
                isEdit
                  ? [
                      moment(addBudgetForm?.start_date, "DD/MM/YYYY"),
                      moment(addBudgetForm?.end_date, "DD/MM/YYYY"),
                    ]
                  : [
                      moment(value[0], "DD/MM/YYYY"),
                      moment(value[1], "DD/MM/YYYY"),
                    ]
              }
              format="DD/MM/YYYY"
              onChange={onChange}
              allowClear={false}
            />
            <div className={AddBudgetFormCss.formLabel}>Remarks: </div>
            <TextArea
              bordered={true}
              style={{ marginBottom: "25px", marginTop: "10px" }}
              placeholder="Enter Remarks"
              onChange={handleAddBudgetFormChange}
              value={addBudgetForm?.remarks}
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
                } Budget?`}
                onConfirm={handleSave}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  className={AddBudgetFormCss.saveButton}
                  type="primary"
                  icon={<CheckSquareFilled />}
                  loading={loading}
                >
                  {loading ? (
                    <>Saving ...</>
                  ) : (
                    <>{`${isEdit ? "Edit" : "Add"}`} Budget</>
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
                  className={AddBudgetFormCss.resetButton}
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
export default AddBudgetForm;
