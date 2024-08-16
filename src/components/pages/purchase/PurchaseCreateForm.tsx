"use client";

import { Product, ProductVariant } from "@/prisma-types";
import { TProductDetailsResponse } from "@/utils/models/product.model";
import {
  AutoComplete,
  Button,
  Flex,
  Form,
  FormProps,
  Input,
  Select,
  Space,
  Tag,
} from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdOutlineInbox } from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

const Title: React.FC<Readonly<{ title?: string }>> = (props) => (
  <Flex align='center' justify='space-between'>
    {props.title}
  </Flex>
);

const renderProductItem = (product: Product) => ({
  value: product.name,
  key: product.productId,
  label: (
    <Flex align='center' justify='space-between'>
      <div className='flex items-center gap-2'>
        <Image
          src={product.primaryImage}
          alt={product.name}
          width={20}
          height={20}
        />
        {product.name}
      </div>
      <span className='flex items-center gap-1'>
        <RiMoneyDollarCircleLine /> {product.price}
      </span>
    </Flex>
  ),
});

const renderFlavorItem = (variant: ProductVariant) => ({
  value: variant.productVariantId,
  label: (
    <Flex align='center' justify='space-between'>
      {variant.variant.name}
      <span className='flex items-center gap-1'>
        <MdOutlineInbox /> {variant.stock}
      </span>
    </Flex>
  ),
});

type Props = {
  products: TProductDetailsResponse[];
};

export default function PurchaseCreateForm({ products }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [flavorsOptions, setFlavorsOptions] = useState<
    {
      label: JSX.Element;
      value: string;
    }[]
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

  const groupedProducts = products.reduce(
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

  console.log(groupedProducts);

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
      selectForm.setFieldsValue({ flavor: undefined });
      setFlavorsOptions(
        products
          .find((product) => product.productId === selectedProduct)
          ?.productVariant.map((variant) => renderFlavorItem(variant)) ?? []
      );
    }
  }, [products, selectForm, selectedProduct]);

  const addItemsToPurchase: FormProps<{
    product: string;
    flavor: string;
  }>["onFinish"] = (values) => {
    console.log(values);

    const selectedProduct = products.find((product) =>
      product.productVariant.some(
        (variant) => variant.productVariantId === values.flavor
      )
    );

    if (selectedProduct) {
      const selectedVariant = selectedProduct.productVariant.find(
        (variant) => variant.productVariantId === values.flavor
      );

      if (selectedVariant) {
        setItemsToPurchase((prevItems) => [
          ...prevItems,
          {
            productId: selectedProduct.productId,
            productVariantId: selectedVariant.productVariantId,
            variantName: selectedVariant.variant.name,
            variantColor: selectedVariant.variant.color,
            price: selectedProduct.price,
            name: selectedProduct.name,
            image: selectedProduct.primaryImage,
            quantity: 1,
          },
        ]);
      }
    }
  };

  return (
    <>
      <Form form={selectForm} layout='vertical' onFinish={addItemsToPurchase}>
        <div className='flex justify-end items-center'>
          <div className='flex flex-col gap-2'>
            <h3 className='text-md font-medium'>Add product to purchase:</h3>
            <Space.Compact>
              <Form.Item
                name='product'
                rules={[
                  { required: true, message: "Please select a product!" },
                ]}
              >
                <AutoComplete
                  popupClassName='certain-category-search-dropdown'
                  popupMatchSelectWidth={500}
                  style={{ width: 250 }}
                  options={productOptions}
                  onSelect={handleSelect}
                >
                  <Input placeholder='Search product' />
                </AutoComplete>
              </Form.Item>
              <Form.Item
                name='flavor'
                rules={[{ required: true, message: "Please select a flavor!" }]}
              >
                <Select
                  placeholder='Select flavor'
                  style={{ width: 200 }}
                  options={flavorsOptions}
                />
              </Form.Item>
              <Form.Item>
                <Button type='primary' htmlType='submit'>
                  Add
                </Button>
              </Form.Item>
            </Space.Compact>
          </div>
        </div>
      </Form>
      {itemsToPurchase.map((product, idx) => (
        <div key={idx} className='flex items-center justify-between gap-3'>
          <div className='flex items-center gap-2'>
            <Image
              className='rounded object-cover'
              src={product.image}
              alt={product.name}
              width={60}
              height={60}
            />
            {product.name} -
            <Tag color={product.variantColor}>{product.variantName}</Tag>
          </div>
          <div className='flex items-center gap-1'>
            <RiMoneyDollarCircleLine /> {product.price}
          </div>
        </div>
      ))}
    </>
  );
}
