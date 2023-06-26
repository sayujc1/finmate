import React, { useState } from "react";
import {
  Space,
  Table,
  Popconfirm,
  notification,
  Modal,
  Button,
  Segmented,
} from "antd";
import { EditFilled, CloseSquareFilled, EyeTwoTone } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  setEditDetails,
  resetEditState,
} from "../../../common/actions/CommonAction";
import {
  cancelBillTransaction,
  UpdateBillStatus,
} from "../../apis/BillManagementAPI";

import "../../css/EditModalOverride.css";
import AddBillFormCss from "../../css/AddBillForm.module.css";

import AddBillForm from "./AddBillForm";
import ViewTimeline from "./ViewTimeline";
const BillTable = ({ loading, setLoading, selected, handleSelected }) => {
  const billDetails = useSelector(state => state.BillReducer);
  const [modal1Open, setModalOpen] = useState(false);

  const [addBillForm, setAddBillForm] = useState({});
  const [AddBillFormErrors, setAddBillFormErrors] = useState({});
  const [viewModal, setViewModal] = useState(false);
  const [viewBill, setViewBill] = useState({});
  const dispatch = useDispatch();

  let columns =
    selected === "Active Bills"
      ? [
          {
            title: "Edit Bill",
            key: "bill_id",
            width: 70,
            fixed: "left",
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
            title: "View",
            key: "view",
            width: 70,
            fixed: "left",
            render: record => (
              <Space
                size="middle"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <EyeTwoTone onClick={() => handleView(record)} />
              </Space>
            ),
          },
          {
            title: "Description",
            dataIndex: "description",
            key: "description",
          },
          {
            title: "Category",
            key: "category",
            render: record => (
              <>
                {record.category === "Other"
                  ? record.category_others
                  : record.category}
              </>
            ),
          },
          {
            title: "Due Date",
            dataIndex: "due_date",
            key: "due_date",
          },
          {
            title: "Amount",
            key: "amount",
            dataIndex: "amount",
          },
          {
            title: "Remarks",
            key: "remarks",
            dataIndex: "remarks",
          },
          {
            title: "Status",
            key: "pay",
            width: 80,
            fixed: "right",
            render: record => (
              <Space
                size="middle"
                style={{ display: "flex", justifyContent: "center" }}
              >
                {record.status === "Not Paid" ? (
                  <Popconfirm
                    title="Are you sure the bill is Paid?"
                    onConfirm={() => {
                      handlePay(record);
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      className={AddBillFormCss.payButton}
                      loading={loading}
                    >
                      {loading ? <>Paying ...</> : <>Pay</>}
                    </Button>
                  </Popconfirm>
                ) : (
                  <>
                    <Button
                      className={AddBillFormCss.paidButton}
                      loading={loading}
                    >
                      {record.status}
                    </Button>
                  </>
                )}
              </Space>
            ),
          },
          {
            title: "Cancel Bill",
            key: "id",
            width: 80,
            fixed: "right",
            render: record => (
              <Space
                size="middle"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Popconfirm
                  title="Are you sure you want to Cancel?"
                  onConfirm={() => {
                    handleDelete(record);
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <CloseSquareFilled
                    style={{ color: "#ff4d4f", cursor: "pointer" }}
                  ></CloseSquareFilled>
                </Popconfirm>
              </Space>
            ),
          },
        ]
      : [
          {
            title: "View",
            key: "view",
            width: 70,
            fixed: "left",
            render: record => (
              <Space
                size="middle"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <EyeTwoTone onClick={() => handleView(record)} />
              </Space>
            ),
          },
          {
            title: "Description",
            dataIndex: "description",
            key: "description",
          },
          {
            title: "Category",
            key: "category",
            render: record => (
              <>
                {record.category === "Other"
                  ? record.category_others
                  : record.category}
              </>
            ),
          },
          {
            title: "Due Date",
            dataIndex: "due_date",
            key: "due_date",
          },
          {
            title: "Amount",
            key: "amount",
            dataIndex: "amount",
          },
          {
            title: "Remarks",
            key: "remarks",
            dataIndex: "remarks",
          },
          {
            title: "Status",
            key: "pay",
            width: 120,
            fixed: "right",
            render: record => (
              <Space
                size="middle"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <>
                  <Button
                    className={AddBillFormCss.paidButton}
                    loading={loading}
                  >
                    {record.status}
                  </Button>
                </>
              </Space>
            ),
          },
        ];

  const handleEdit = record => {
    // populate add form reducer state - editing
    setAddBillForm(record);
    dispatch(setEditDetails(record));
    setModalOpen(true);
  };
  const handleView = record => {
    setViewBill(record);
    setViewModal(true);
  };
  const handleDelete = async record => {
    setLoading(true);
    try {
      await cancelBillTransaction(billDetails, record, dispatch);
    } catch (error) {
      notification.error({
        message: "Error",
        description: error ? error.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }

    notification.success({
      message: "Canceled Successfully",
    });
  };
  const handlePay = async record => {
    record.status = "Paid";
    setLoading(true);
    try {
      await UpdateBillStatus(billDetails, record, dispatch);
    } catch (error) {
      notification.error({
        message: "Error",
        description: error ? error.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }

    notification.success({
      message: "Paid Successfully",
    });
  };

  return (
    <>
      <Segmented
        style={{ margin: "10px" }}
        block
        options={["Active Bills", "InActive Bills"]}
        selected={selected}
        onChange={handleSelected}
      />
      <Modal
        title="Edit Bill"
        style={{
          top: 20,
        }}
        open={modal1Open}
        onCancel={() => setModalOpen(false)}
        footer={null}
        maskClosable={false}
        afterClose={() => {
          dispatch(resetEditState());
          setAddBillForm({});
        }}
      >
        <AddBillForm
          reducer={billDetails}
          setModal={setModalOpen}
          addBillForm={addBillForm}
          setAddBillForm={setAddBillForm}
          AddBillFormErrors={AddBillFormErrors}
          setAddBillFormErrors={setAddBillFormErrors}
        />
      </Modal>
      <Modal
        title="Bill Timeline"
        style={{
          top: 20,
        }}
        open={viewModal}
        onCancel={() => setViewModal(false)}
        footer={null}
        maskClosable={false}
        afterClose={() => {
          setViewBill([]);
        }}
      >
        <ViewTimeline bill={viewBill} />
      </Modal>
      <Table
        bordered={true}
        columns={columns}
        dataSource={billDetails?.billTransactions}
        style={{ margin: "20px" }}
        loading={loading}
        rowKey={record => record.bill_id}
        scroll={{
          x: 1300,
        }}
      />
    </>
  );
};
export default BillTable;
