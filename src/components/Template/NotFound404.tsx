import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import NotFoundImg from "@/app/assets/image/404-NotFound.svg";

export default function NotFound404() {
  return (
    <div className='grid place-items-center h-screen'>
      <div className='flex flex-col items-center gap-4'>
        <Image src={NotFoundImg} width={320} height={320} alt='Not Found' />
        <p className='text-lg'>Could not find requested resource</p>
        <Link href='/'>
          <Button type='primary'>Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
