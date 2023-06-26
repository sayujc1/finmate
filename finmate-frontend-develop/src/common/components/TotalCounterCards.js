import React from "react";
import { Row, Col } from "antd";
import {
  DollarCircleOutlined,
  RiseOutlined,
  FallOutlined,
  BankOutlined,
} from "@ant-design/icons";
import TransactionDetailsCss from "../css/TotalCounterCards.module.css";

const TotalCounterCards = ({ counterDetails }) => {
  return (
    <Row className={TransactionDetailsCss.totalCountersContainer}>
      {/* My Balance Container */}
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 11 }}
        lg={{ span: 5 }}
        className={TransactionDetailsCss.totalCounterCol}
      >
        <Row className={TransactionDetailsCss.totalCounterColRow}>
          <Col span={10}>
            <DollarCircleOutlined
              id={TransactionDetailsCss.dollarIcon}
              className={TransactionDetailsCss.totalCounterIconStyle}
            />
          </Col>
          <Col span={12}>
            <span className={TransactionDetailsCss.totalCounterTitle}>
              My Balance
            </span>{" "}
            <br />{" "}
            <span className={TransactionDetailsCss.totalCounterValue}>
              Rs. {counterDetails?.totalBalance?.toFixed(2)}
            </span>
          </Col>
        </Row>
      </Col>
      {/* Income Container */}
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 11 }}
        lg={{ span: 5 }}
        className={TransactionDetailsCss.totalCounterCol}
      >
        <Row className={TransactionDetailsCss.totalCounterColRow}>
          <Col span={10}>
            <RiseOutlined
              id={TransactionDetailsCss.incomeIcon}
              className={TransactionDetailsCss.totalCounterIconStyle}
            />
          </Col>
          <Col span={12}>
            <span className={TransactionDetailsCss.totalCounterTitle}>
              Income
            </span>{" "}
            <br />{" "}
            <span className={TransactionDetailsCss.totalCounterValue}>
              Rs. {counterDetails?.totalIncome?.toFixed(2)}
            </span>
          </Col>
        </Row>
      </Col>
      {/* Expenses Container */}
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 11 }}
        lg={{ span: 5 }}
        className={TransactionDetailsCss.totalCounterCol}
      >
        <Row className={TransactionDetailsCss.totalCounterColRow}>
          <Col span={10}>
            <FallOutlined
              className={TransactionDetailsCss.totalCounterIconStyle}
              id={TransactionDetailsCss.expenseIcon}
            />
          </Col>
          <Col span={12}>
            <span className={TransactionDetailsCss.totalCounterTitle}>
              Expenses
            </span>{" "}
            <br />{" "}
            <span className={TransactionDetailsCss.totalCounterValue}>
              Rs. {counterDetails?.totalExpense?.toFixed(2)}
            </span>
          </Col>
        </Row>
      </Col>
      {/* Savings Container */}
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 11 }}
        lg={{ span: 5 }}
        className={TransactionDetailsCss.totalCounterCol}
      >
        <Row className={TransactionDetailsCss.totalCounterColRow}>
          <Col span={10}>
            <BankOutlined
              className={TransactionDetailsCss.totalCounterIconStyle}
              id={TransactionDetailsCss.savingsIcon}
            />
          </Col>
          <Col span={12}>
            <span className={TransactionDetailsCss.totalCounterTitle}>
              Savings
            </span>{" "}
            <br />{" "}
            <span className={TransactionDetailsCss.totalCounterValue}>
              Rs. {counterDetails?.totalSavings?.toFixed(2)}
            </span>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default TotalCounterCards;
