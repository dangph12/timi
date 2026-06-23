import { useAtomValue, useSetAtom } from 'jotai';
import { orderAtom } from '@/store/order';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { addDoc } from 'firebase/firestore';
import { ordersCollection } from '@/lib/firebase';
import { Order } from '@/models/orders';
import { useState } from 'react';
import EstimatedDelivery from '@/components/estimated-delivery';

// Helper function to remove Vietnamese diacritics
const removeDiacritics = str => {
  if (!str) return '';
  return str
    .normalize('NFD') // decomposes characters into base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // removes diacritical marks
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

export default function PaymentPage() {
  const order = useAtomValue(orderAtom);
  const customer = order?.customer;
  const setOrder = useSetAtom(orderAtom);
  const navigate = useNavigate();

  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);

  const totalAmount = order?.cart?.total || 194000;
  const displayTotal = totalAmount.toLocaleString('vi-VN') + 'đ';
  const displaySubtotal =
    (order?.cart?.subtotal || 179000).toLocaleString('vi-VN') + 'đ';
  const displayShipping =
    (order?.cart?.shipping !== undefined
      ? order.cart.shipping
      : 15000
    ).toLocaleString('vi-VN') + 'đ';

  const rawContent = customer
    ? `${customer.fullName} ${customer.phoneNumber}`
    : 'NGUYEN VAN A 0912345678';
  const paymentContent = removeDiacritics(rawContent).toUpperCase();

  const qrUrl = `https://img.vietqr.io/image/970418-4333998899-qr_only.png?amount=${totalAmount}&addInfo=${encodeURIComponent(paymentContent)}&accountName=NGUYEN%20THUY%20CHI`;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('4333998899');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(paymentContent);
    setCopiedContent(true);
    setTimeout(() => setCopiedContent(false), 2000);
  };

  const handleComplete = async () => {
    try {
      const orderData = new Order({ ...order, payment: { status: 'paid' } });
      await addDoc(ordersCollection, orderData.toFirestore());
      setOrder(prev => ({ ...prev, paid: true }));
      navigate('/finish');
    } catch (e) {
      console.error('Error adding order: ', e);
    }
  };
  const title = 'Payment - Tỉ Mỉ';
  const description = 'Bank transfer payment instructions for your Tỉ Mỉ order. Complete your purchase with BIDV bank transfer.';

  return (
    <>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:type' content='website' />
      <div className='w-full'>
      <div className='grid grid-cols-1 md:h-screen md:grid-cols-[45%_55%]'>
        <main className='px-8 py-4 md:px-12 md:py-8 lg:px-20 flex flex-col md:h-full md:overflow-y-auto'>
          <div className='mb-4 shrink-0'>
            <img
              src='/timilogo.png'
              alt='tỉ mỉ'
              className='h-12 w-auto object-contain'
            />
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
              <img
                src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Logo_Bidv_m%E1%BB%9Bi.svg/1920px-Logo_Bidv_m%E1%BB%9Bi.svg.png'
                alt='BIDV Logo'
                className='h-6 md:h-8 object-contain shrink-0'
              />
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
                    onClick={handleCopyAccount}
                    aria-label='Copy account number'
                    className='hover:opacity-70 transition-opacity flex items-center gap-1 text-primary'
                  >
                    {copiedAccount ? (
                      <Check className='h-4 w-4 text-green-500' />
                    ) : (
                      <Copy className='h-4 w-4' />
                    )}
                  </button>
                </div>

                <span className='font-bold'>Account holder</span>
                <span>NGUYEN THUY CHI</span>

                <span className='font-bold'>Amount</span>
                <span>{displayTotal}</span>

                <span className='font-bold'>Content</span>
                <div className='flex items-center gap-2'>
                  <span className='font-mono font-bold'>{paymentContent}</span>
                  <button
                    onClick={handleCopyContent}
                    aria-label='Copy content'
                    className='hover:opacity-70 transition-opacity flex items-center gap-1 text-primary'
                  >
                    {copiedContent ? (
                      <Check className='h-4 w-4 text-green-500' />
                    ) : (
                      <Copy className='h-4 w-4' />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <section className='flex items-center gap-6 mt-auto shrink-0'>
              <img
                src={qrUrl}
                alt='VietQR Payment Code'
                className='h-28 w-28 md:h-32 md:w-32 bg-white object-contain shrink-0 border rounded-lg p-1 shadow-sm'
              />
              <div className='flex flex-col items-center justify-center flex-1 space-y-1'>
                <div className='flex gap-2 mb-1 items-center'>
                  <img
                    src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Logo_Bidv_m%E1%BB%9Bi.svg/1920px-Logo_Bidv_m%E1%BB%9Bi.svg.png'
                    alt='BIDV Logo'
                    className='h-4 md:h-5 object-contain'
                  />
                  <img
                    src='https://upload.wikimedia.org/wikipedia/commons/7/77/VietQR_Logo.png'
                    alt='VietQR Logo'
                    className='h-4 md:h-5 object-contain'
                  />
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

        <aside className='px-8 py-4 md:px-12 md:py-8 lg:px-20 flex flex-col md:h-full md:overflow-y-auto'>
          <div className='flex flex-col h-full'>
            <h2 className='text-2xl md:text-3xl font-black mb-4 shrink-0'>
              Order details
            </h2>

            <div className='bg-background rounded-xl p-5 md:p-6 shadow-sm flex flex-col flex-1 min-h-0'>
              <div className='grid grid-cols-[120px_1fr] gap-y-2 md:gap-y-3 text-sm shrink-0 mb-4'>
                <span className='font-bold'>Receiver</span>
                <span>{customer?.fullName}</span>

                <span className='font-bold'>Phone number</span>
                <span>{customer?.phoneNumber}</span>

                <span className='font-bold'>Delivery address</span>
                <span className='leading-relaxed text-xs md:text-sm'>
                  {customer?.address}
                </span>
              </div>

              <div className='py-2 shrink-0'>
                <EstimatedDelivery />
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
                  <span>{displaySubtotal}</span>
                </div>
                <div className='flex justify-between text-sm font-bold'>
                  <span>Shipping</span>
                  <span>{displayShipping}</span>
                </div>
                <div className='flex justify-between text-xl md:text-2xl font-black pt-2 md:pt-4'>
                  <span>Total</span>
                  <span>{displayTotal}</span>
                </div>
              </div>

              <Button
                onClick={handleComplete}
                className='w-full h-12 md:h-14 mt-4 bg-linear-to-r from-[#eb129d] to-[#5543f5] hover:opacity-90 text-white text-base md:text-lg font-bold rounded-full border-0 shrink-0'
              >
                COMPLETE ORDER
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
    </>
  );
}
