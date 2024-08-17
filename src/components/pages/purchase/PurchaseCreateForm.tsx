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
  Flex,
  Form,
  FormProps,
  Input,
  Select,
  Space,
  Tag,
} from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
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
  const router = useRouter();
  const { notification } = App.useApp();
  const [isPending, startSubmission] = useTransition();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [variantsOptions, setVariantsOptions] = useState<
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

  const addItemsToPurchase: FormProps<{
    product: string;
    variant: string;
  }>["onFinish"] = (values) => {
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
            // Product with the same variant already exists, update the quantity
            const updatedItems = [...prevItems];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + 1,
            };
            return updatedItems;
          } else {
            // Product does not exist, add a new one
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

      console.log("Purchasing items", request);
      const res = await vendorPurchaseProduct(request);
      if (res.isSuccess) {
        notification.success({ message: res.message });
        selectForm.resetFields();
        router.push(`/purchase?updated=${new Date().getTime()}`);
      } else {
        notification.error({ message: res.message });
      }
    });
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
                name='variant'
                rules={[
                  { required: true, message: "Please select a variant!" },
                ]}
              >
                <Select
                  placeholder='Select variant'
                  style={{ width: 200 }}
                  options={variantsOptions}
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
        <div key={idx} className='flex items-center justify-between gap-3 mb-3'>
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
          <div className='flex items-center gap-2'>
            <Input
              min={1}
              type='number'
              placeholder='Quantity'
              prefix={<MdOutlineInbox />}
              value={product.quantity}
              onChange={(e) => {
                setItemsToPurchase((prevItems) => {
                  const newItems = [...prevItems];
                  newItems[idx].quantity = Number(e.target.value);
                  return newItems;
                });
              }}
            />
            <Input
              min={0}
              type='number'
              placeholder='Purchasing price'
              prefix={<RiMoneyDollarCircleLine />}
              value={product.price}
              onChange={(e) => {
                setItemsToPurchase((prevItems) => {
                  const newItems = [...prevItems];
                  newItems[idx].price = Number(e.target.value);
                  return newItems;
                });
              }}
            />
          </div>
        </div>
      ))}

      {itemsToPurchase.length > 0 && (
        <div className='w-full bg-white rounded-md flex items-center justify-end'>
          <Button
            type='primary'
            size='large'
            loading={isPending}
            onClick={handlePurchase}
          >
            Purchase $
            {itemsToPurchase.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            )}
          </Button>
        </div>
      )}
    </>
  );
}
