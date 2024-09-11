"use client";

import { acceptOrder } from "@/actions/order.action";
import { CustomerOrderVendor } from "@/prisma-types";
import { CUSTOMER_ORDER_VENDOR_STATUS } from "@/utils/constants";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm, ConfigProvider, App } from "antd";
import { createStyles } from "antd-style";
import { useTransition } from "react";

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
  const { notification } = App.useApp();
  const [isPending, startSubmission] = useTransition();
  const { styles } = useStyle();

  const reject = () => {
    console.log("Rejecting Order!!");
  };

  const accept = () => {
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
    });
  };

  const acceptWithSnackWorld = () => {
    startSubmission(async () => {
      const res = await acceptOrder({
        customerOrderId: order.customerOrderId,
        customerOrderVendorId: order.customerOrderVendorId,
        type: "REQUEST",
        deliveryName: order.customerOrder.orderCode + "_Snack World",
      });
    });
  };

  const renderButton = () => {
    switch (order.customerOrderVendorStatus as CUSTOMER_ORDER_VENDOR_STATUS) {
      case CUSTOMER_ORDER_VENDOR_STATUS.NEW:
        return (
          <div className='flex items-center gap-3'>
            <Popconfirm
              title='Rejecting Order!!'
              description='Are you sure to reject this order?'
              okText='Yes'
              cancelText='No'
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={reject}
              okButtonProps={{ loading: isPending }}
            >
              <Button danger>Reject</Button>
            </Popconfirm>
            <Popconfirm
              title='Accepting Order!!'
              description='Are you sure to accept this order?'
              okText='Yes'
              cancelText='No'
              onConfirm={accept}
              okButtonProps={{ loading: isPending }}
            >
              <Button type='primary'>Accept Order</Button>
            </Popconfirm>

            <ConfigProvider
              button={{
                className: styles.linearGradientButton,
              }}
            >
              <Popconfirm
                title='Snack World Service!!'
                description='Are you sure to accept this order?'
                okText='Yes'
                cancelText='No'
                onConfirm={acceptWithSnackWorld}
                okButtonProps={{ loading: isPending }}
              >
                <Button type='primary'>Accept with Snack World</Button>
              </Popconfirm>
            </ConfigProvider>
          </div>
        );
      case CUSTOMER_ORDER_VENDOR_STATUS.ACCEPTED:
        return <button className='btn btn-primary'>Prepare Order</button>;
      case CUSTOMER_ORDER_VENDOR_STATUS.CANCELLED:
        return <button className='btn btn-primary'>Order Prepared</button>;
      case CUSTOMER_ORDER_VENDOR_STATUS.DELIVERING:
        return <button className='btn btn-primary'>Order Delivered</button>;
      case CUSTOMER_ORDER_VENDOR_STATUS.DELIVERED:
        return <button className='btn btn-primary'>Order Completed</button>;
      default:
        return null;
    }
  };

  return renderButton();
}
