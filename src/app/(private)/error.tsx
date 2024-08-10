"use client";

import MainLayout from "@/components/Layout/MainLayout";
import { Button } from "antd";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='min-h-screen'>
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6'>
        <div className='max-w-md w-full bg-white shadow-md rounded-lg p-6'>
          <h2 className='text-2xl font-bold text-red-600 mb-4'>
            Something went wrong!
          </h2>
          <p className='text-gray-700 mb-6 font-medium'>{error.message}</p>
          <Button onClick={() => reset()} type='primary'>
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
