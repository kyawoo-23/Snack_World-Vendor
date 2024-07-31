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
import type { GetProp, SelectProps, UploadFile, UploadProps } from "antd";
import AvatarUploadButton from "@/components/Button/UploadButton";
import TextArea from "antd/es/input/TextArea";
import "./ProductCreateForm.css";
import { MdOutlineFileUpload } from "react-icons/md";

type Props = {
  categories: Category[];
  variants: Variant[];
};

type FieldType = {
  name: string;
  price: number;
  description: string;
  categoryId: string;
  variantId: string[];
  weight: number;
  primaryImage: UploadFile;
  imageList: UploadFile;
};

type TagRender = SelectProps["tagRender"];
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export default function ProductCreateForm({ categories, variants }: Props) {
  const router = useRouter();
  const { notification } = App.useApp();
  const [isPending, startSubmission] = useTransition();
  const [form] = Form.useForm();
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [imageList, setImageList] = useState<File[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log(values);
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
      const updatedImageList = imageList.filter(
        (file) => file.name !== info.file.name
      );
      setImageList(updatedImageList);

      if (updatedImageList.length === 0) {
        form.setFieldsValue({ imageList: null });
      }
    } else if (info.file.status === "done") {
      setImageList((prev) => [...prev, info.file.originFileObj as File]);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  return (
    <>
      <Form<FieldType>
        form={form}
        name='product'
        layout='vertical'
        onFinish={onFinish}
        autoComplete='off'
        style={{ maxWidth: "640px" }}
      >
        <Row gutter={24} align='bottom'>
          <Col span={12}>
            <Form.Item<FieldType>
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
            <Form.Item<FieldType>
              label='Name'
              name='name'
              rules={[{ required: true, message: "Please input name!" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item<FieldType>
              label='Description'
              name='description'
              rules={[{ required: true, message: "Please input description!" }]}
            >
              <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item<FieldType>
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
            <Form.Item<FieldType>
              label='Variant'
              name='variantId'
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
            <Form.Item<FieldType>
              label='Price'
              name='price'
              rules={[{ required: true, message: "Please input price!" }]}
            >
              <Input type='number' addonBefore='$' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<FieldType>
              label='Weight'
              name='weight'
              rules={[{ required: true, message: "Please input weight!" }]}
            >
              <Input type='number' addonAfter='gram' />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item<FieldType>
              label='Image List'
              name='imageList'
              rules={[{ required: true, message: "Please upload image list!" }]}
            >
              <Upload
                name='imageList'
                listType='picture'
                className='upload-list-inline'
                showUploadList={true}
                maxCount={3}
                multiple
                onChange={handleListChange}
                onPreview={handlePreview}
                accept='image/*'
              >
                {imageList.length < 5 && (
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
