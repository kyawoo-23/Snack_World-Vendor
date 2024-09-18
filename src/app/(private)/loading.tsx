import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default function Loading() {
  return (
    <div className='h-[90vh] grid place-items-center'>
      <Spin indicator={<LoadingOutlined spin />} size='default' />
    </div>
  );
}
