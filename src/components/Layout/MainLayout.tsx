import { Button } from "antd";
import Link from "next/link";

export default function MainLayout({
  children,
  title,
  action,
}: Readonly<{
  title: string;
  children: React.ReactNode;
  action?: {
    label: string;
    href: string;
  };
}>) {
  return (
    <main className='flex flex-col gap-4'>
      <section className='flex justify-between items-center'>
        <h1 className='font-bold text-lg md:text-xl'>{title}</h1>
        {action && (
          <Link href={action.href}>
            <Button type='primary'>{action.label}</Button>
          </Link>
        )}
      </section>
      <section className='p-4 rounded bg-white h-full'>{children}</section>
    </main>
  );
}
