import { ProductImage } from "@/prisma-types";
import { TProductCreateRequestVM } from "@/utils/models/product.model";
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
} from "antd";
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
  const [productImages, setProductImages] = useState<File[]>([]);

  const handleListChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "removed") {
      const updatedImageList = productImages.filter(
        (file) => file.name !== info.file.name
      );
      setProductImages(updatedImageList);

      if (updatedImageList.length === 0) {
        imageListForm.setFieldsValue({ productImages: null });
      }
    } else if (info.file.status === "done") {
      setProductImages((prev) => [...prev, info.file.originFileObj as File]);
    }
  };

  const onUploadImageList: FormProps<TProductCreateRequestVM>["onFinish"] =
    async (values) => {
      const { productImages } = values;
      const imageFormData = new FormData();

      if (productImages?.fileList) {
        productImages.fileList.forEach((file) => {
          imageFormData.append("productImages", file.originFileObj as File);
        });
      }
    };

  return (
    <Form<TProductCreateRequestVM>
      form={imageListForm}
      onFinish={onUploadImageList}
      layout='vertical'
    >
      <h3 className='font-bold'>Image List</h3>
      <Row gutter={24}>
        {productImage.map((img, index) => (
          <ImageDetails key={index} id={img.productImageId} image={img.image} />
        ))}

        <Col span={24} className='mt-8'>
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
              onChange={handleListChange}
              onPreview={handlePreview}
              accept='image/*'
            >
              {productImages.length < 5 && (
                <Button icon={<MdOutlineFileUpload />}>Upload (Max: 5)</Button>
              )}
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
  const onDelete = (id: string) => {
    console.log("Delete image with id: ", id);
  };

  return (
    <Col span={6}>
      <Image
        width={140}
        height={140}
        alt={`Product Image`}
        className='object-contain'
        src={image}
      />
      <Button
        icon={<DeleteFilled />}
        className='w-full'
        danger
        type='primary'
        onClick={() => onDelete(id)}
      >
        Delete
      </Button>
    </Col>
  );
};
