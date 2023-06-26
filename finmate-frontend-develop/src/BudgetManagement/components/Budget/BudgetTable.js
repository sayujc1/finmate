import React, { useState } from "react";
import { Space, Table, Popconfirm, notification, Modal, Tag } from "antd";
import { EditFilled, DeleteFilled } from "@ant-design/icons";
import AddBudgetForm from "./AddBudgetForm";
import "../../css/EditModalOverride.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteBudgetTransaction } from "../../apis/BudgetManagementAPI";

import {
  setEditDetails,
  resetEditState,
} from "../../actions/BudgetManagementAction";

const BudgetTable = ({ loading, setLoading }) => {
  const [modal1Open, setModalOpen] = useState(false);
  const [addBudgetForm, setAddBudgetForm] = useState({});
  const [AddBudgetFormErrors, setAddBudgetFormErrors] = useState({});
  const dispatch = useDispatch();

  const columns = [
    {
      title: "",
      key: "b_id",
      render: record => (
        <Space
          size="middle"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <EditFilled
            style={{ color: "#1890ff", cursor: "pointer" }}
            onClick={() => handleEdit(record)}
          />
        </Space>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
    },

    {
      title: "Budget",
      key: "budget",
      dataIndex: "budget",
    },
    {
      title: "Spent",
      key: "spent",
      dataIndex: "spent",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: status => (
        <>
          {status === "Under Limit" ? (
            <Tag color="green" key={status}>
              {status}
            </Tag>
          ) : status === "Over Limit" ? (
            <Tag color="red" key={status}>
              {status}
            </Tag>
          ) : null}
        </>
      ),
    },
    {
      title: "Remarks",
      key: "remarks",
      dataIndex: "remarks",
    },
    {
      title: "",
      key: "b_id",
      render: record => (
        <Space
          size="middle"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Popconfirm
            title="Are you sure you want to Delete?"
            onConfirm={() => {
              handleDelete(record);
            }}
            okText="Yes"
            cancelText="No"
          >
            <DeleteFilled
              style={{ color: "#ff4d4f", cursor: "pointer" }}
            ></DeleteFilled>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const handleEdit = record => {
    // populate add form reducer state - editing
    setAddBudgetForm(record);
    dispatch(setEditDetails(record));
    setModalOpen(true);
  };
  const handleDelete = async record => {
    setLoading(true);
    try {
      await deleteBudgetTransaction(budgetDetails, record, dispatch);
    } catch (error) {
      notification.error({
        message: "Error",
        description: error ? error.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
    notification.success({
      message: "Deleted Successfully",
    });
  };
  const budgetDetails = useSelector(state => state.BudgetReducer);

  return (
    <>
      <Modal
        title="Edit Budget"
        style={{
          top: 20,
        }}
        open={modal1Open}
        onCancel={() => setModalOpen(false)}
        footer={null}
        maskClosable={false}
        afterClose={() => {
          dispatch(resetEditState());
          setAddBudgetForm({});
        }}
      >
        <AddBudgetForm
          reducer={budgetDetails}
          setModal={setModalOpen}
          addBudgetForm={addBudgetForm}
          setAddBudgetForm={setAddBudgetForm}
          AddBudgetFormErrors={AddBudgetFormErrors}
          setAddBudgetFormErrors={setAddBudgetFormErrors}
        />
      </Modal>
      <Table
        loading={loading}
        bordered={true}
        columns={columns}
        dataSource={budgetDetails?.budgetTransactions}
        style={{ margin: "20px" }}
        rowKey={record => record.b_id}
      />
    </>
  );
};
export default BudgetTable;
