import React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function CheckoutPage() {
  return (
    <div className='container mx-auto max-w-6xl'>
      <div className='grid min-h-screen md:grid-cols-[1fr_500px]'>
        {/* Left Column: Payment Instructions */}
        <main className='px-8 py-6 space-y-6 flex flex-col justify-center'>
          <section className='space-y-4'>
            <h1 className='text-3xl font-bold'>Payment instructions</h1>
            <p className='text-base leading-relaxed'>
              Please transfer the payment to the following account and click the
              "Complete Order" button. Tỉ Mỉ workshop will call to confirm your
              order as soon as possible.
            </p>
            <p className='text-sm italic text-muted-foreground'>
              I confirm that I am at least 18 years of age and that I have read
              and agreed to the privacy policy.
            </p>
          </section>

          {/* Bank Selector Component Skeleton */}
          <Skeleton className='h-16 w-full rounded-lg' />

          {/* Account Details Form */}
          <div className='rounded-lg border p-6 bg-card text-card-foreground shadow-sm'>
            <div className='grid grid-cols-[140px_1fr] gap-y-4 text-sm'>
              <span className='font-bold'>Bank</span>
              <span>BIDV Bank</span>

              <span className='font-bold'>Account number</span>
              <div className='flex items-center gap-2'>
                <span>4333998899</span>
                <Skeleton className='h-4 w-4' /> {/* Copy Icon */}
              </div>

              <span className='font-bold'>Account holder</span>
              <span>NGUYEN THUY CHI</span>

              <span className='font-bold'>Amount</span>
              <span>194.000đ</span>

              <span className='font-bold'>Content</span>
              <div className='flex items-center gap-2'>
                <span>NGUYEN VAN A 0912345678</span>
                <Skeleton className='h-4 w-4' /> {/* Copy Icon */}
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <section className='flex flex-col sm:flex-row items-center gap-8 pt-4'>
            <Skeleton className='h-48 w-48 rounded-lg shrink-0' />
            <div className='flex flex-col items-center text-center space-y-2'>
              <div className='flex gap-3 mb-2'>
                <Skeleton className='h-8 w-16 rounded' />
                <Skeleton className='h-8 w-16 rounded' />
              </div>
              <p className='font-bold text-lg'>NGUYEN THUY CHI</p>
              <p className='text-xl'>4333998899</p>
              <p className='text-sm text-muted-foreground font-medium'>
                BIDV - CN TU SON
              </p>
            </div>
          </section>
        </main>

        {/* Right Column: Order Details */}
        <aside className='border-l bg-muted/20 px-8 py-6 flex flex-col justify-center'>
          <div className='space-y-6 bg-background rounded-xl p-6 shadow-sm border'>
            <h2 className='text-2xl font-bold'>Order details</h2>

            {/* Delivery Info */}
            <div className='grid grid-cols-[120px_1fr] gap-y-3 text-sm'>
              <span className='font-bold'>Receiver</span>
              <span>Nguyễn Văn A</span>

              <span className='font-bold'>Phone number</span>
              <span>0912345678</span>

              <span className='font-bold'>Delivery address</span>
              <span className='leading-relaxed'>
                Greenwich Hà Nội, Tòa nhà Golden Park, Số 2 Phạm Văn Bạch,
                Phường Cầu Giấy, Thành phố Hà Nội
              </span>
            </div>

            {/* Timeline Component Skeleton */}
            <Skeleton className='h-24 w-full rounded-xl border border-blue-200 bg-blue-50/50' />

            {/* Order Items */}
            <div className='space-y-3'>
              <h3 className='font-bold text-base border-b pb-2'>Order</h3>
              <div className='flex justify-between text-sm'>
                <span>TỈ MỈ DIY BOX</span>
                <span>59.000đ</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span>STANDARD VERSION</span>
                <span>120.000đ</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span>KEYRING</span>
                <span>0đ</span>
              </div>
            </div>

            {/* Order Summary & Action */}
            <div className='space-y-3 border-t pt-4'>
              <div className='flex justify-between text-sm font-bold'>
                <span>Subtotal</span>
                <span>179.000đ</span>
              </div>
              <div className='flex justify-between text-sm font-bold'>
                <span>Shipping</span>
                <span>15.000đ</span>
              </div>
              <div className='flex justify-between text-2xl font-extrabold mt-4'>
                <span>Total</span>
                <span>194.000đ</span>
              </div>
            </div>

            <Button className='w-full h-14 mt-4 bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white font-bold rounded-full border-0'>
              COMPLETE ORDER
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
