import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy } from 'lucide-react';

export default function PaymentPage() {
  return (
    <div className='w-full'>
      <div className='grid grid-cols-1 md:h-screen md:grid-cols-2'>
        <main className='px-8 py-4 md:px-20 md:py-8 flex flex-col md:h-full md:overflow-y-auto'>
          <div className='text-primary text-4xl font-bold italic tracking-tighter mb-4 shrink-0'>
            tỉ mỉ
          </div>

          <div className='flex-1 flex flex-col justify-center min-h-0'>
            <section className='space-y-2 mb-4'>
              <h1 className='text-2xl md:text-3xl font-black'>
                Payment instructions
              </h1>
              <p className='text-sm md:text-base leading-snug'>
                Please transfer the payment to the following account and click
                the "Complete Order" button. Tỉ Mỉ workshop will call to confirm
                your order as soon as possible.
              </p>
              <p className='text-xs md:text-sm italic font-medium pt-1'>
                I confirm that I am at least 18 years of age and that I have
                read and agreed to the privacy policy.
              </p>
            </section>

            <div className='flex items-center gap-3 border rounded-xl p-2 md:p-3 mb-3'>
              <div className='flex items-center justify-center w-4 h-4 rounded-full border-2 border-primary bg-background shrink-0 ml-1'>
                <div className='w-2 h-2 rounded-full bg-primary' />
              </div>
              <Skeleton className='h-6 w-20 md:h-8 md:w-24 rounded shrink-0 bg-gray-500' />
              <span className='text-xs md:text-sm font-bold leading-tight'>
                BIDV Bank{' '}
                <span className='font-normal hidden xl:inline'>
                  (Joint Stock Commercial Bank for Investment and Development of
                  Vietnam)
                </span>
              </span>
            </div>

            <div className='rounded-xl border p-4 mb-4'>
              <div className='grid grid-cols-[120px_1fr] md:grid-cols-[140px_1fr] gap-y-2 md:gap-y-3 text-sm'>
                <span className='font-bold'>Bank</span>
                <span>BIDV Bank</span>

                <span className='font-bold'>Account number</span>
                <div className='flex items-center gap-2'>
                  <span>4333998899</span>
                  <button
                    aria-label='Copy account number'
                    className='hover:opacity-70 transition-opacity'
                  >
                    <Copy className='h-4 w-4' />
                  </button>
                </div>

                <span className='font-bold'>Account holder</span>
                <span>NGUYEN THUY CHI</span>

                <span className='font-bold'>Amount</span>
                <span>194.000đ</span>

                <span className='font-bold'>Content</span>
                <div className='flex items-center gap-2'>
                  <span>NGUYEN VAN A 0912345678</span>
                  <button
                    aria-label='Copy content'
                    className='hover:opacity-70 transition-opacity'
                  >
                    <Copy className='h-4 w-4' />
                  </button>
                </div>
              </div>
            </div>

            <section className='flex items-center gap-6 mt-auto shrink-0'>
              <Skeleton className='h-28 w-28 md:h-32 md:w-32 rounded-none bg-gray-500 shrink-0' />
              <div className='flex flex-col items-center justify-center flex-1 space-y-1'>
                <div className='flex gap-2 mb-1'>
                  <Skeleton className='h-5 w-16 md:h-6 md:w-20 rounded-none bg-gray-500' />
                  <Skeleton className='h-5 w-16 md:h-6 md:w-20 rounded-none bg-gray-500' />
                </div>
                <p className='font-bold text-base md:text-lg'>
                  NGUYEN THUY CHI
                </p>
                <p className='text-lg md:text-xl'>4333998899</p>
                <p className='text-xs md:text-sm text-gray-500 font-medium'>
                  BIDV - CN TU SON
                </p>
              </div>
            </section>
          </div>
        </main>

        <aside className='bg-[#f7f7f7] px-8 py-4 md:px-20 md:py-8 flex flex-col md:h-full md:overflow-y-auto'>
          <div className='flex flex-col h-full'>
            <h2 className='text-2xl md:text-3xl font-black mb-4 shrink-0'>
              Order details
            </h2>

            <div className='bg-background rounded-xl p-5 md:p-6 shadow-sm flex flex-col flex-1 min-h-0'>
              <div className='grid grid-cols-[120px_1fr] gap-y-2 md:gap-y-3 text-sm shrink-0 mb-4'>
                <span className='font-bold'>Receiver</span>
                <span>Nguyễn Văn A</span>

                <span className='font-bold'>Phone number</span>
                <span>0912345678</span>

                <span className='font-bold'>Delivery address</span>
                <span className='leading-relaxed text-xs md:text-sm'>
                  Greenwich Hà Nội, Tòa nhà Golden Park, Số 2 Phạm Văn Bạch,
                  Phường Cầu Giấy, Thành phố Hà Nội
                </span>
              </div>

              <div className='flex-1 flex min-h-[60px] py-2 shrink'>
                <Skeleton className='h-full w-full rounded-none bg-gray-500' />
              </div>

              <div className='space-y-2 md:space-y-3 shrink-0 mt-4'>
                <h3 className='font-bold text-sm md:text-base border-b pb-1'>
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

              <div className='space-y-2 border-t pt-3 shrink-0 mt-3'>
                <div className='flex justify-between text-sm font-bold'>
                  <span>Subtotal</span>
                  <span>179.000đ</span>
                </div>
                <div className='flex justify-between text-sm font-bold'>
                  <span>Shipping</span>
                  <span>15.000đ</span>
                </div>
                <div className='flex justify-between text-xl md:text-2xl font-black pt-2 md:pt-4'>
                  <span>Total</span>
                  <span>194.000đ</span>
                </div>
              </div>

              <Button className='w-full h-12 md:h-14 mt-4 bg-gradient-to-r from-[#eb129d] to-[#5543f5] hover:opacity-90 text-white text-base md:text-lg font-bold rounded-full border-0 shrink-0'>
                COMPLETE ORDER
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
