"use client";

import { Variant, Category, Product } from "@/prisma-types";
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
import { createProduct } from "@/actions/product.action";
import { TProductCreateRequestVM } from "@/utils/models/product.model";
import { FileType } from "@/utils/models";
import { getBase64 } from "@/utils/shared";
import ProductDetailsImageListForm from "@/components/pages/product/ProductDetailsImageListForm";

type Props = {
  categories: Category[];
  variants: Variant[];
  initialValues?: Product;
};

type TagRender = SelectProps["tagRender"];

export default function ProductDetails({
  categories,
  variants,
  initialValues,
}: Props) {
  const router = useRouter();
  const { notification } = App.useApp();
  const [isPending, startSubmission] = useTransition();
  const [form] = Form.useForm();
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const onFinish: FormProps<TProductCreateRequestVM>["onFinish"] = async (
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

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  return (
    <div style={{ maxWidth: "640px" }}>
      <Form<TProductCreateRequestVM>
        form={form}
        name='product'
        layout='vertical'
        onFinish={onFinish}
        autoComplete='off'
      >
        <Row gutter={24} align='bottom'>
          <Col span={24}>
            <Form.Item<TProductCreateRequestVM>
              label='Primary Image'
              name='primaryImage'
              rules={[
                { required: true, message: "Please upload primary image!" },
              ]}
            >
              <div className='grid grid-cols-2 items-center'>
                <Image
                  width={100}
                  height={100}
                  alt={initialValues?.name}
                  src={initialValues?.primaryImage}
                />
                <Upload
                  name='avatar'
                  listType='picture-card'
                  showUploadList={true}
                  onChange={handlePrimaryChange}
                  onPreview={handlePreview}
                  accept='image/*'
                >
                  {!primaryImage && <AvatarUploadButton />}
                </Upload>
              </div>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<TProductCreateRequestVM>
              label='Name'
              name='name'
              rules={[{ required: true, message: "Please input name!" }]}
            >
              <Input defaultValue={initialValues?.name} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item<TProductCreateRequestVM>
              label='Description'
              name='description'
              rules={[{ required: true, message: "Please input description!" }]}
            >
              <TextArea
                autoSize={{ minRows: 3, maxRows: 5 }}
                defaultValue={initialValues?.description}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item<TProductCreateRequestVM>
              label='Category'
              name='categoryId'
              rules={[{ required: true, message: "Please select category!" }]}
            >
              <Select
                placeholder='Select category'
                defaultValue={initialValues?.categoryId}
                options={categories.map((category) => ({
                  label: category.name,
                  value: category.categoryId,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<TProductCreateRequestVM>
              label='Variant'
              name='productVariants'
              rules={[{ required: true, message: "Please select variant!" }]}
            >
              <Select
                placeholder='Select variant'
                defaultValue={initialValues?.productVariant.map(
                  (variant) => variant.variantId
                )}
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
            <Form.Item<TProductCreateRequestVM>
              label='Price'
              name='price'
              rules={[{ required: true, message: "Please input price!" }]}
            >
              <Input
                type='number'
                addonBefore='$'
                defaultValue={initialValues?.price}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<TProductCreateRequestVM>
              label='Weight'
              name='weight'
              rules={[{ required: true, message: "Please input weight!" }]}
            >
              <Input
                type='number'
                addonAfter='gram'
                defaultValue={initialValues?.weight}
              />
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

      <ProductDetailsImageListForm
        productImage={initialValues?.productImage ?? []}
        handlePreview={handlePreview}
      />

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
    </div>
  );
}
