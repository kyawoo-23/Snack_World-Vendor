import { addProductImage, deleteProductImage } from "@/actions/product.action";
import { ProductImage } from "@/prisma-types";
import { TProductCreateRequestVM } from "@/utils/models/product.model";
import { getImageKey } from "@/utils/shared";
import { DeleteFilled } from "@ant-design/icons";
import {
  Form,
  Row,
  Col,
  Upload,
  Button,
  FormProps,
  UploadProps,
  Image,
  UploadFile,
  Flex,
  App,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MdOutlineFileUpload } from "react-icons/md";

export default function ProductDetailsImageListForm({
  productImage,
  handlePreview,
}: {
  productImage: ProductImage[];
  handlePreview: (file: UploadFile<any>) => void;
}) {
  const [imageListForm] = Form.useForm();
  const [isPending, startSubmission] = useTransition();
  const { notification } = App.useApp();
  const router = useRouter();
  const params = useParams();

  const onUploadImageList: FormProps<TProductCreateRequestVM>["onFinish"] =
    async (values) => {
      const { productImages } = values;
      const imageFormData = new FormData();

      if (productImages?.fileList) {
        productImages.fileList.forEach((file) => {
          imageFormData.append("productImages", file.originFileObj as File);
        });
      }

      startSubmission(async () => {
        const res = await addProductImage(params.id as string, imageFormData);
        if (res.isSuccess) {
          imageListForm.resetFields();
          router.refresh();
        } else {
          notification.error({ message: res.message });
        }
      });
    };

  return (
    <Form<TProductCreateRequestVM>
      form={imageListForm}
      onFinish={onUploadImageList}
      layout='vertical'
    >
      <h3 className='font-bold my-3'>Image List</h3>
      <Row gutter={24}>
        {productImage.map((img, index) => (
          <ImageDetails key={index} id={img.productImageId} image={img.image} />
        ))}

        <Col span={24} className='my-8'>
          <hr />
        </Col>

        <Col span={24}>
          <Form.Item<TProductCreateRequestVM>
            label='Add New Image'
            name='productImages'
            rules={[{ required: true, message: "Please upload image list!" }]}
          >
            <Upload
              name='productImages'
              listType='picture'
              className='upload-list-inline'
              showUploadList={true}
              maxCount={5}
              multiple
              onPreview={handlePreview}
              accept='image/*'
            >
              <Button icon={<MdOutlineFileUpload />}>Upload (Max: 5)</Button>
            </Upload>
          </Form.Item>
        </Col>

        <Col span={24} className='mt-4'>
          <Form.Item>
            <Flex justify='end' gap={12}>
              <Button type='primary' htmlType='submit' loading={isPending}>
                Submit
              </Button>
            </Flex>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

const ImageDetails = ({ id, image }: { id: string; image: string }) => {
  const [isPending, startSubmission] = useTransition();
  const { notification } = App.useApp();
  const router = useRouter();

  const onDelete = (id: string) => {
    startSubmission(async () => {
      const res = await deleteProductImage(id, getImageKey(image));
      if (res.isSuccess) {
        notification.success({ message: res.message });
        router.refresh();
      } else {
        notification.error({ message: res.message });
      }
    });
  };

  return (
    <Col span={6}>
      <Image
        width={140}
        height={140}
        alt={`Product Image`}
        className='rounded object-contain'
        src={image}
      />
      <Button
        icon={<DeleteFilled />}
        className='w-full mb-4'
        danger
        type='primary'
        onClick={() => onDelete(id)}
        loading={isPending}
      >
        Delete
      </Button>
    </Col>
  );
};
