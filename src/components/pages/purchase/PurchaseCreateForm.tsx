"use client";

import { vendorPurchaseProduct } from "@/actions/purchase.action";
import { Product, ProductVariant } from "@/prisma-types";
import { TProductDetailsResponse } from "@/utils/models/product.model";
import { TVendorPurchaseRequest } from "@/utils/models/purchase.model";
import { generatePurchaseCode } from "@/utils/shared";
import {
  App,
  AutoComplete,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tag,
  Spin,
  notification,
  Typography,
} from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { MdOutlineInbox } from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

const Title: React.FC<Readonly<{ title?: string }>> = (props) => (
  <span>{props.title}</span>
);

const renderProductItem = (product: Product) => ({
  value: product.name,
  key: product.productId,
  label: (
    <Space>
      <Image
        src={product.primaryImage}
        alt={product.name}
        width={20}
        height={20}
      />
      <span>{product.name}</span>
      <Divider type='vertical' />
      <Typography.Text type='secondary'>Selling price:</Typography.Text>
      <Tag color='green'>${product.price}</Tag>
    </Space>
  ),
});

const renderFlavorItem = (variant: ProductVariant) => ({
  value: variant.productVariantId,
  label: (
    <Space>
      {variant.variant.name}
      <Divider type='vertical' />
      <Typography.Text type='secondary'>Stock:</Typography.Text>
      <Tag color='blue'>{variant.stock}</Tag>
    </Space>
  ),
});

type Props = {
  products: TProductDetailsResponse[];
};

export default function PurchaseCreateForm({ products }: Props) {
  const router = useRouter();
  const [isPending, startSubmission] = useTransition();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [variantsOptions, setVariantsOptions] = useState<
    { label: JSX.Element; value: string }[]
  >([]);
  const [itemsToPurchase, setItemsToPurchase] = useState<
    {
      productId: string;
      productVariantId: string;
      variantName: string;
      variantColor: string;
      price: number;
      name: string;
      image: string;
      quantity: number;
    }[]
  >([]);
  const [selectForm] = Form.useForm();

  const groupedProducts = useMemo(() => {
    return products.reduce(
      (acc, product) => {
        const { category } = product;
        if (!acc[category.name]) {
          acc[category.name] = [];
        }
        acc[category.name].push(product);
        return acc;
      },
      {} as Record<string, typeof products>
    );
  }, [products]);

  const productOptions = Object.keys(groupedProducts).map((categoryName) => ({
    label: <Title title={categoryName} />,
    options: groupedProducts[categoryName].map((product) =>
      renderProductItem(product)
    ),
  }));

  const handleSelect = (value: string, option: any) => {
    const selectedProductId = option.key;
    setSelectedProduct(selectedProductId);
  };

  useEffect(() => {
    if (selectedProduct) {
      selectForm.setFieldsValue({ variant: undefined });
      setVariantsOptions(
        products
          .find((product) => product.productId === selectedProduct)
          ?.productVariant.map((variant) => renderFlavorItem(variant)) ?? []
      );
    }
  }, [products, selectForm, selectedProduct]);

  const addItemsToPurchase = (values: { product: string; variant: string }) => {
    const selectedProduct = products.find((product) =>
      product.productVariant.some(
        (variant) => variant.productVariantId === values.variant
      )
    );

    if (selectedProduct) {
      const selectedVariant = selectedProduct.productVariant.find(
        (variant) => variant.productVariantId === values.variant
      );

      if (selectedVariant) {
        setItemsToPurchase((prevItems) => {
          const existingItemIndex = prevItems.findIndex(
            (item) => item.productVariantId === values.variant
          );

          if (existingItemIndex !== -1) {
            const updatedItems = [...prevItems];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + 1,
            };
            return updatedItems;
          } else {
            return [
              ...prevItems,
              {
                productId: selectedProduct.productId,
                productVariantId: selectedVariant.productVariantId,
                variantName: selectedVariant.variant.name,
                variantColor: selectedVariant.variant.color,
                price: 0,
                name: selectedProduct.name,
                image: selectedProduct.primaryImage,
                quantity: 1,
              },
            ];
          }
        });
      }
    }
  };

  const handlePurchase = async () => {
    startSubmission(async () => {
      const request: TVendorPurchaseRequest = {
        purchaseCode: generatePurchaseCode(),
        purchaseProducts: itemsToPurchase.map((item) => ({
          purchasePrice: item.price,
          quantity: item.quantity,
          productId: item.productId,
          productVariantId: item.productVariantId,
        })),
      };

      const res = await vendorPurchaseProduct(request);
      if (res.isSuccess) {
        notification.success({ message: res.message });
        selectForm.resetFields();
        router.push(`/purchase`);
      } else {
        notification.error({ message: res.message });
      }
    });
  };

  return (
    <div>
      <Card title='Add Items to the Purchase List' style={{ marginBottom: 20 }}>
        <Form form={selectForm} layout='vertical' onFinish={addItemsToPurchase}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name='product'
                rules={[
                  { required: true, message: "Please select a product!" },
                ]}
              >
                <AutoComplete
                  options={productOptions}
                  onSelect={handleSelect}
                  placeholder='Search product'
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='variant'
                rules={[
                  { required: true, message: "Please select a variant!" },
                ]}
              >
                <Select
                  options={variantsOptions}
                  placeholder='Select variant'
                  style={{ width: "100%" }}
                  notFoundContent={isPending ? <Spin size='small' /> : null}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item>
                <Button type='primary' htmlType='submit'>
                  Add
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {itemsToPurchase.map((product, idx) => (
        <Card key={idx} style={{ marginBottom: 16 }}>
          <Row gutter={16} align='middle'>
            <Col span={4}>
              <Image
                src={product.image}
                alt={product.name}
                width={60}
                height={60}
              />
            </Col>
            <Col span={8}>
              <strong>{product.name}</strong> -{" "}
              <Tag color={product.variantColor}>{product.variantName}</Tag>
            </Col>
            <Col span={4}>
              <Form.Item label='Purchasing Quantity'>
                <Input
                  min={1}
                  type='number'
                  placeholder='Quantity'
                  value={product.quantity}
                  onChange={(e) => {
                    const newQuantity = Number(e.target.value);
                    setItemsToPurchase((prev) =>
                      prev.map((item, i) =>
                        i === idx ? { ...item, quantity: newQuantity } : item
                      )
                    );
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label='Purchasing Price'>
                <Input
                  min={0}
                  type='number'
                  placeholder='Price'
                  value={product.price}
                  onChange={(e) => {
                    const newPrice = Number(e.target.value);
                    setItemsToPurchase((prev) =>
                      prev.map((item, i) =>
                        i === idx ? { ...item, price: newPrice } : item
                      )
                    );
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      ))}

      {itemsToPurchase.length > 0 && (
        <div style={{ textAlign: "right", marginTop: 20 }}>
          <Button type='primary' onClick={handlePurchase}>
            Purchase $
            {itemsToPurchase.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            )}
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => setItemsToPurchase([])}
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
