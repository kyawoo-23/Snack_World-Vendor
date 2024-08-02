import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";

export default function Loading() {
  return (
    <div className='h-screen grid place-items-center'>
      <Spin indicator={<LoadingOutlined spin />} size='small' />
    </div>
  );
}
