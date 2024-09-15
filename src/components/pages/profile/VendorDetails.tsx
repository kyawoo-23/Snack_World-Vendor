"use client";

import { updateVendorLogo } from "@/actions/account.action";
import { Vendor } from "@/prisma-types";
import { getImageKey } from "@/utils/shared";
import { App, Button, Image } from "antd";

import React, { useRef, useState, useTransition } from "react";

type Props = {
  vendor: Vendor;
};

export default function VendorDetails({ vendor }: Props) {
  const { notification } = App.useApp();
  const [isPending, startSubmission] = useTransition();
  const [newImage, setNewImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onSave = async () => {
    startSubmission(async () => {
      const formData = new FormData();
      if (newImage) {
        formData.append("image", newImage);
        const res = await updateVendorLogo(
          getImageKey(vendor.image || ""),
          formData
        );
        if (res.isSuccess) {
          notification.success({ message: res.message });
        } else {
          notification.error({ message: res.message });
        }
      }
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (file) {
      setNewImage(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className='flex flex-col gap-2'
      style={{
        maxWidth: "480px",
      }}
    >
      <figure className='relative size-52 rounded'>
        <Image
          src={(newImage && URL.createObjectURL(newImage)) || vendor.image}
          alt={vendor.name}
          className='object-cover'
        />
      </figure>

      <div className='grid grid-cols-2 w-52 gap-2'>
        <Button
          htmlType='button'
          onClick={() => {
            setNewImage(null);
            fileInputRef.current?.value && (fileInputRef.current.value = "");
          }}
        >
          Reset
        </Button>
        <Button type='primary' htmlType='button' onClick={triggerFileInput}>
          Upload
        </Button>
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <Button
          className='col-span-2 mt-4'
          type='primary'
          size='large'
          onClick={onSave}
          loading={isPending}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
