"use client";

import {
  acceptOrder,
  startDeliveryOrder,
  endDeliveryOrder,
  cancelOrder,
} from "@/actions/order.action";
import { CustomerOrderVendor } from "@/prisma-types";
import { CUSTOMER_ORDER_VENDOR_STATUS } from "@/utils/constants";
import { Button, ConfigProvider, App, Modal, Alert } from "antd";
import { createStyles } from "antd-style";
import { useState, useTransition } from "react";

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(
        .${prefixCls}-btn-dangerous
      ) {
      border-width: 0;

      > span {
        position: relative;
      }

      &::before {
        content: "";
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: 0;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

type Props = {
  order: CustomerOrderVendor;
};

export default function OrderDetailsAction({ order }: Props) {
  const { styles } = useStyle();
  const { notification } = App.useApp();
  const [open, setOpen] = useState(false);
  const [isPending, startSubmission] = useTransition();
  const [modalContent, setModalContent] = useState<{
    title: string;
    text: string;
    onOk: () => void;
  }>({ title: "", text: "", onOk: () => {} });

  const reject = () => {
    setModalContent({
      title: "Rejecting Order!!",
      text: "Are you sure to reject this order?",
      onOk: () => {
        startSubmission(async () => {
          const res = await cancelOrder(order.customerOrderVendorId);
          if (res.isSuccess) {
            notification.success({ message: res.message });
          } else {
            console.log(res.message);
            notification.error({ message: res.message });
          }
          setOpen(false);
        });
      },
    });
    setOpen(true);
  };

  const accept = () => {
    setModalContent({
      title: "Accepting Order!!",
      text: "Are you sure to accept this order?",
      onOk: () => {
        startSubmission(async () => {
          const res = await acceptOrder({
            customerOrderId: order.customerOrderId,
            customerOrderVendorId: order.customerOrderVendorId,
            type: "SELF",
            deliveryName: order.customerOrder.orderCode + "_Self",
          });
          if (res.isSuccess) {
            notification.success({ message: res.message });
          } else {
            console.log(res.message);
            notification.error({ message: res.message });
          }
          setOpen(false);
        });
      },
    });
    setOpen(true);
  };

  const acceptWithSnackWorld = () => {
    setModalContent({
      title: "Accepting Order!!",
      text: "Are you sure to accept this order?",
      onOk: () => {
        startSubmission(async () => {
          const res = await acceptOrder({
            customerOrderId: order.customerOrderId,
            customerOrderVendorId: order.customerOrderVendorId,
            type: "REQUEST",
            deliveryName: order.customerOrder.orderCode + "_Snack World",
          });
          if (res.isSuccess) {
            notification.success({ message: res.message });
          } else {
            console.log(res.message);
            notification.error({ message: res.message });
          }
          setOpen(false);
        });
      },
    });
    setOpen(true);
  };

  const startDelivery = () => {
    setModalContent({
      title: "Start Delivery!!",
      text: "Are you sure to start delivery?",
      onOk: () => {
        startSubmission(async () => {
          const res = await startDeliveryOrder(
            order.deliveryOrder[0].deliveryOrderId
          );
          if (res.isSuccess) {
            notification.success({ message: res.message });
          } else {
            console.log(res.message);
            notification.error({ message: res.message });
          }
          setOpen(false);
        });
      },
    });
    setOpen(true);
  };

  const endDelivery = () => {
    setModalContent({
      title: "Finish Delivery!!",
      text: "Are you sure to finish delivery?",
      onOk: () => {
        startSubmission(async () => {
          const res = await endDeliveryOrder(
            order.deliveryOrder[0].deliveryOrderId
          );
          if (res.isSuccess) {
            notification.success({ message: res.message });
          } else {
            console.log(res.message);
            notification.error({ message: res.message });
          }
          setOpen(false);
        });
      },
    });
    setOpen(true);
  };

  const renderButton = () => {
    switch (order.customerOrderVendorStatus as CUSTOMER_ORDER_VENDOR_STATUS) {
      case CUSTOMER_ORDER_VENDOR_STATUS.NEW:
        return (
          <div className='flex items-center gap-3'>
            <Button onClick={reject} danger>
              Reject
            </Button>

            <Button type='primary' onClick={accept}>
              Accept Order
            </Button>

            <ConfigProvider
              button={{
                className: styles.linearGradientButton,
              }}
            >
              <Button type='primary' onClick={acceptWithSnackWorld}>
                Accept with Snack World
              </Button>
            </ConfigProvider>
          </div>
        );
      case CUSTOMER_ORDER_VENDOR_STATUS.ACCEPTED:
        return order.deliveryOrder[0].type === "SELF" ? (
          <Button type='primary' onClick={startDelivery}>
            Start Delivery
          </Button>
        ) : (
          <Alert
            message='Delivery is being made by Snack World'
            type='info'
            showIcon
          />
        );
      case CUSTOMER_ORDER_VENDOR_STATUS.CANCELLED:
        return <button className='btn btn-primary'>Order Prepared</button>;
      case CUSTOMER_ORDER_VENDOR_STATUS.DELIVERING:
        return (
          <Button type='primary' onClick={endDelivery}>
            Finish Delivery
          </Button>
        );
      case CUSTOMER_ORDER_VENDOR_STATUS.DELIVERED:
        return <button className='btn btn-primary'>Order Completed</button>;
      case CUSTOMER_ORDER_VENDOR_STATUS.COMPLETED:
        return <button className='btn btn-primary'>Order Completed</button>;
      default:
        return null;
    }
  };

  return (
    <>
      {renderButton()}
      <Modal
        title={modalContent.title}
        open={open}
        onOk={modalContent.onOk}
        confirmLoading={isPending}
        onCancel={() => setOpen(false)}
      >
        <p>{modalContent.text}</p>
      </Modal>
    </>
  );
}
