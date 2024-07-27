export default function MainLayout({
  children,
  title,
}: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <main className='flex flex-col gap-4'>
      <section>
        <h1 className='font-bold text-lg md:text-xl'>{title}</h1>
      </section>
      <section className='p-4 rounded bg-white'>{children}</section>
    </main>
  );
}
