"use client";

import { Variant, Category } from "@/prisma-types";
import {
  App,
  Col,
  Form,
  FormProps,
  Input,
  Row,
  Select,
  Tag,
  Upload,
  Image,
  Flex,
  Button,
} from "antd";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { SelectProps, UploadFile, UploadProps } from "antd";
import AvatarUploadButton from "@/components/Button/UploadButton";
import TextArea from "antd/es/input/TextArea";
import "./ProductCreateForm.css";
import { MdOutlineFileUpload } from "react-icons/md";
import { createProduct } from "@/actions/product.action";
import { TProductCreateRequest } from "@/utils/models/product.model";
import { FileType } from "@/utils/models";
import { getBase64 } from "@/utils/shared";

type Props = {
  categories: Category[];
  variants: Variant[];
};

type TagRender = SelectProps["tagRender"];

export default function ProductCreateForm({ categories, variants }: Props) {
  const router = useRouter();
  const { notification } = App.useApp();
  const [isPending, startSubmission] = useTransition();
  const [form] = Form.useForm();
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const onFinish: FormProps<TProductCreateRequest>["onFinish"] = async (
    values
  ) => {
    const { primaryImage, productImages, ...request } = values;
    const imageFormData = new FormData();

    if (primaryImage?.fileList) {
      imageFormData.append(
        "primaryImage",
        primaryImage.fileList[0].originFileObj as File
      );
    }
    if (productImages?.fileList) {
      productImages.fileList.forEach((file) => {
        imageFormData.append("productImages", file.originFileObj as File);
      });
    }

    startSubmission(async () => {
      const res = await createProduct(request, imageFormData);
      if (res.isSuccess) {
        notification.success({ message: res.message });
        form.resetFields();
        router.push("/product");
      } else {
        notification.error({ message: res.message });
      }
    });
  };

  const onReset = () => {
    form.resetFields();
  };

  const tagRender: TagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    const color = variants.find(
      (variant) => variant.variantId === value
    )?.color;

    return (
      <Tag
        color={color}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginInlineEnd: 4 }}
      >
        {label}
      </Tag>
    );
  };

  const handlePrimaryChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "removed") {
      setPrimaryImage(null);
      form.setFieldsValue({ primaryImage: null });
    } else if (info.file.status === "done") {
      setPrimaryImage(info.file.originFileObj as File);
    }
  };

  const handleListChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "removed") {
      const updatedImageList = productImages.filter(
        (file) => file.name !== info.file.name
      );
      setProductImages(updatedImageList);

      if (updatedImageList.length === 0) {
        form.setFieldsValue({ productImages: null });
      }
    } else if (info.file.status === "done") {
      setProductImages((prev) => [...prev, info.file.originFileObj as File]);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  return (
    <>
      <Form<TProductCreateRequest>
        form={form}
        name='product'
        layout='vertical'
        onFinish={onFinish}
        autoComplete='off'
        style={{ maxWidth: "640px" }}
      >
        <Row gutter={24} align='bottom'>
          <Col span={12}>
            <Form.Item<TProductCreateRequest>
              label='Primary Image'
              name='primaryImage'
              rules={[
                { required: true, message: "Please upload primary image!" },
              ]}
            >
              <Upload
                name='avatar'
                listType='picture-card'
                showUploadList={true}
                onChange={handlePrimaryChange}
                onPreview={handlePreview}
              >
                {!primaryImage && <AvatarUploadButton />}
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<TProductCreateRequest>
              label='Name'
              name='name'
              rules={[{ required: true, message: "Please input name!" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item<TProductCreateRequest>
              label='Description'
              name='description'
              rules={[{ required: true, message: "Please input description!" }]}
            >
              <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item<TProductCreateRequest>
              label='Category'
              name='categoryId'
              rules={[{ required: true, message: "Please select category!" }]}
            >
              <Select
                placeholder='Select category'
                options={categories.map((category) => ({
                  label: category.name,
                  value: category.categoryId,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<TProductCreateRequest>
              label='Variant'
              name='productVariants'
              rules={[{ required: true, message: "Please select variant!" }]}
            >
              <Select
                placeholder='Select variant'
                tagRender={tagRender}
                options={variants.map((variant) => ({
                  label: variant.name,
                  value: variant.variantId,
                }))}
                mode='multiple'
                allowClear
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item<TProductCreateRequest>
              label='Price'
              name='price'
              rules={[{ required: true, message: "Please input price!" }]}
            >
              <Input type='number' addonBefore='$' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<TProductCreateRequest>
              label='Weight'
              name='weight'
              rules={[{ required: true, message: "Please input weight!" }]}
            >
              <Input type='number' addonAfter='gram' />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item<TProductCreateRequest>
              label='Image List'
              name='productImages'
              rules={[{ required: true, message: "Please upload image list!" }]}
            >
              <Upload
                name='productImages'
                listType='picture'
                className='upload-list-inline'
                showUploadList={true}
                maxCount={3}
                multiple
                onChange={handleListChange}
                onPreview={handlePreview}
                accept='image/*'
              >
                {productImages.length < 5 && (
                  <Button icon={<MdOutlineFileUpload />}>
                    Upload (Max: 3)
                  </Button>
                )}
              </Upload>
            </Form.Item>
          </Col>

          <Col span={24} className='mt-4'>
            <Form.Item>
              <Flex justify='end' gap={12}>
                <Button htmlType='button' onClick={onReset}>
                  Reset
                </Button>
                <Button type='primary' htmlType='submit' loading={isPending}>
                  Submit
                </Button>
              </Flex>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {previewImage && (
        <Image
          alt='Preview Image'
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
}
