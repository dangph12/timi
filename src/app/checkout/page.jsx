import { useSetAtom, useAtomValue } from 'jotai';
import { useState } from 'react';
import { orderAtom } from '@/store/order';
import { capturedCharacterAtom, designSelectionsAtom } from '@/store/design';
import { PACKAGING_OPTIONS, VERSION_OPTIONS, INCLUDED_ITEM_OPTIONS } from '@/constants/pricing';
import { useNavigate } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import EstimatedDelivery from '@/components/estimated-delivery';
import { Skeleton } from '@/components/ui/skeleton';
import { Tag } from 'lucide-react';

const SHIPPING_FEE = 30000;
const DISCOUNT_CODES = {
  TIMIWELCOME: { shippingDiscountRatio: 0.5, label: '50% OFF SHIPPING FEES' }
};

const schema = yup.object().shape({
  fullName: yup.string().required('Required'),
  phoneNumber: yup.string().required('Required'),
  email: yup.string().email('Invalid email').required('Required'),
  address: yup.string().required('Required'),
  deliveryNotes: yup.string()
});

export default function CheckoutPage() {
  const setOrder = useSetAtom(orderAtom);
  const navigate = useNavigate();
  const capturedCharacter = useAtomValue(capturedCharacterAtom);
  const selections = useAtomValue(designSelectionsAtom);

  const packagingOption = PACKAGING_OPTIONS.find(p => p.id === selections.packaging);
  const versionOption = VERSION_OPTIONS[selections.version];
  const includedItem =
    INCLUDED_ITEM_OPTIONS[selections.item?.type] ?? INCLUDED_ITEM_OPTIONS.keychain;
  const subtotal =
    (packagingOption?.price ?? 0) +
    (versionOption?.price ?? 0) +
    includedItem.price;

  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  const handleApplyDiscount = () => {
    const normalized = discountCode.trim().toUpperCase();
    setAppliedDiscount(DISCOUNT_CODES[normalized] ? normalized : null);
  };

  const discount = appliedDiscount ? DISCOUNT_CODES[appliedDiscount] : null;
  const shipping = discount
    ? SHIPPING_FEE * (1 - discount.shippingDiscountRatio)
    : SHIPPING_FEE;
  const total = subtotal + shipping;

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
      address: '',
      deliveryNotes: ''
    }
  });

  const onSubmit = data => {
    setOrder(prev => ({ ...prev, customer: data }));
    navigate('/payment');
  };

  const title = 'Checkout - Tỉ Mỉ';
  const description = 'Complete your order for the Tỉ Mỉ DIY character box. Provide your contact and delivery information.';

  return (
    <>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:type' content='website' />
      <div className='w-full'>
      <div className='grid grid-cols-1 md:h-screen md:grid-cols-2'>
        <form
          id='checkout-form'
          onSubmit={form.handleSubmit(onSubmit)}
          className='px-8 py-4 md:px-20 md:py-6 flex flex-col md:h-full md:overflow-y-auto'
        >
          <div className='mb-4 shrink-0'>
            <img
              src='/timilogo.png'
              alt='tỉ mỉ'
              className='h-12 w-auto object-contain'
            />
          </div>

          <div className='flex-1 flex flex-col min-h-0 justify-center'>
            <section className='space-y-2'>
              <h1 className='text-3xl font-black'>Contact</h1>
              <FieldGroup>
                <Controller
                  name='fullName'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel className='text-base'>Full name</FieldLabel>
                      <Input className='h-11 rounded-lg' {...field} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name='phoneNumber'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel className='text-base'>
                        Phone number
                      </FieldLabel>
                      <Input className='h-11 rounded-lg' {...field} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name='email'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel className='text-base'>Email</FieldLabel>
                      <Input className='h-11 rounded-lg' {...field} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
              <div className='pt-1 text-sm italic font-medium leading-tight cursor-pointer no-wrap'>
                I confirm that I am at least 18 years of age and that I have
                read and agreed to the privacy policy.
              </div>
            </section>

            <section className='mt-4 space-y-2'>
              <h2 className='text-3xl font-black'>Delivery</h2>
              <FieldGroup>
                <Controller
                  name='address'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel className='text-base'>Address</FieldLabel>
                      <Input className='h-11 rounded-lg' {...field} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name='deliveryNotes'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel className='text-base'>
                        Delivery notes
                      </FieldLabel>
                      <Input className='h-11 rounded-lg' {...field} />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </section>
          </div>

          <div className='mt-4 shrink-0'>
            <EstimatedDelivery />
          </div>
        </form>

        <aside className='bg-aside px-8 py-4 md:px-20 md:py-6 flex flex-col md:h-full md:overflow-y-auto'>
          <div className='flex flex-col h-full'>
            <div className='space-y-4 shrink-0'>
              {packagingOption && (
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <img
                      src={packagingOption.imageSrc}
                      alt={packagingOption.label}
                      className='h-12 w-12 object-contain rounded-md border border-[#0000D0] bg-white p-1'
                    />
                    <span className='text-sm tracking-wide'>
                      TỈ MỈ {packagingOption.label}
                    </span>
                  </div>
                  <span className='text-sm'>
                    {packagingOption.price.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              )}
              {versionOption && (
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <div className='h-12 w-12 rounded-md bg-linear-to-b from-[#0000FF] to-[#4A4AFF] border border-[#0000D0] flex items-center justify-center overflow-hidden'>
                      <img
                        src={versionOption.imageSrc}
                        alt={versionOption.label}
                        className='h-full w-full object-contain p-1'
                      />
                    </div>
                    <span className='text-sm tracking-wide'>
                      {versionOption.label}
                    </span>
                  </div>
                  <span className='text-sm'>
                    {versionOption.price.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              )}
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <img
                    src={includedItem.imageSrc}
                    alt={includedItem.label}
                    className='h-12 w-12 object-contain rounded-md border border-[#0000D0] bg-white p-1'
                  />
                  <span className='text-sm tracking-wide'>
                    {includedItem.label}
                  </span>
                </div>
                <span className='text-sm'>
                  {includedItem.price.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            <div className='flex-1 flex items-center justify-center py-4 min-h-0'>
              {capturedCharacter ? (
                <div className='h-full max-h-65 aspect-square flex flex-col bg-white border-2 border-[#0000D0] rounded-2xl p-3 shadow-sm'>
                  <div className='flex-1 w-full bg-linear-to-b from-[#0000FF] to-[#4A4AFF] rounded-xl overflow-hidden flex items-center justify-center relative min-h-0'>
                    <img
                      src={capturedCharacter}
                      alt='Your custom character design'
                      className='w-full h-full object-contain scale-[1.5] translate-y-[10%] origin-center drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] select-none animate-fade-in relative z-10'
                    />
                  </div>
                  <div className='text-center pt-2.5 pb-0.5 text-sm font-black tracking-wider text-[#0000D0] uppercase shrink-0 leading-none'>
                    ITEM DESIGN
                  </div>
                </div>
              ) : (
                <Skeleton className='h-full max-h-65 aspect-square rounded-2xl bg-foreground/10' />
              )}
            </div>

            <div className='space-y-4 shrink-0 mt-2'>
              <div className='flex gap-4'>
                <Input
                  placeholder='Discount code'
                  value={discountCode}
                  onChange={e => setDiscountCode(e.target.value)}
                  className='h-12 bg-background rounded-lg text-base'
                />
                <Button
                  type='button'
                  variant='secondary'
                  onClick={handleApplyDiscount}
                  className='h-12 px-6 bg-btn-muted text-muted-foreground font-medium rounded-lg hover:bg-btn-muted/80'
                >
                  Apply
                </Button>
              </div>

              <div className='space-y-2 pt-2'>
                <div className='flex justify-between text-base'>
                  <span>Subtotal</span>
                  <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className='flex justify-between text-base'>
                  <span>Shipping</span>
                  <span className='flex items-center gap-2'>
                    {discount && (
                      <span className='line-through text-muted-foreground'>
                        {SHIPPING_FEE.toLocaleString('vi-VN')}đ
                      </span>
                    )}
                    {shipping.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                {discount && (
                  <div className='flex items-center gap-1.5 text-sm text-[#0000D0] font-medium'>
                    <Tag className='h-4 w-4' />
                    <span>{discount.label}</span>
                  </div>
                )}
                <div className='flex justify-between text-3xl font-black pt-2'>
                  <span>Total</span>
                  <span>{total.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <Button
                type='submit'
                form='checkout-form'
                className='w-full h-14 rounded-full bg-btn-muted text-white text-lg font-bold hover:bg-btn-muted/80 mt-2'
              >
                PAY NOW
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
    </>
  );
}
