import { useAtomValue } from 'jotai';
import { orderAtom } from '@/store/order';

export default function FinishPage() {
  const order = useAtomValue(orderAtom);
  const customer = order?.customer;

  const title = 'Order Confirmed - Tỉ Mỉ';
  const description = 'Thank you for your order at Tỉ Mỉ workshop. Your custom DIY character is being prepared.';

  return (
    <>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:type' content='website' />
      <div className='h-screen bg-[#f7f7f7] flex flex-col relative overflow-hidden'>
      <div className='absolute top-6 left-6 md:top-8 md:left-10'>
        <div className='mb-4 shrink-0'>
          <img
            src='/timilogo.png'
            alt='tỉ mỉ'
            className='h-12 w-auto object-contain'
          />
        </div>
      </div>

      <main className='flex-1 flex flex-col items-center justify-center px-4 md:px-6 w-full min-h-0'>
        <div className='w-full max-w-3xl mb-6 shrink-0 px-4 md:px-0'>
          <h1 className='text-2xl md:text-4xl font-black tracking-tight mb-2'>
            Thank you for your order
          </h1>
          <p className='text-sm md:text-lg'>
            <span className='text-primary font-bold'>Tỉ Mỉ workshop</span> will
            call to confirm your order as soon as possible.
          </p>
        </div>

        <div className='bg-background rounded-xl p-6 md:p-8 shadow-sm w-full max-w-3xl flex flex-col shrink min-h-0'>
          <div className='grid grid-cols-[110px_1fr] md:grid-cols-[160px_1fr] gap-y-3 text-xs md:text-sm shrink-0'>
            <span className='font-bold'>Order ID</span>
            <span>001576</span>

            <span className='font-bold'>Receiver</span>
            <span>{customer?.fullName}</span>

            <span className='font-bold'>Phone number</span>
            <span>{customer?.phoneNumber}</span>

            <span className='font-bold'>Delivery address</span>
            <span className='leading-relaxed'>{customer?.address}</span>
          </div>

          <div className='space-y-3 shrink-0 mt-6'>
            <h3 className='font-bold text-sm md:text-base border-b border-black/10 pb-2'>
              Order
            </h3>
            <div className='flex justify-between text-xs md:text-sm'>
              <span>TỈ MỈ DIY BOX</span>
              <span>59.000đ</span>
            </div>
            <div className='flex justify-between text-xs md:text-sm'>
              <span>STANDARD VERSION</span>
              <span>120.000đ</span>
            </div>
            <div className='flex justify-between text-xs md:text-sm'>
              <span>KEYRING</span>
              <span>0đ</span>
            </div>
          </div>

          <div className='space-y-2 border-t border-black/10 pt-3 shrink-0 mt-4'>
            <div className='flex justify-between text-xs md:text-sm font-bold'>
              <span>Subtotal</span>
              <span>179.000đ</span>
            </div>
            <div className='flex justify-between text-xs md:text-sm font-bold'>
              <span>Shipping</span>
              <span>15.000đ</span>
            </div>
            <div className='flex justify-between text-xl md:text-3xl font-black pt-2 md:pt-3'>
              <span>Total</span>
              <span>194.000đ</span>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
