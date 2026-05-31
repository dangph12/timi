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
import { Skeleton } from '@/components/ui/skeleton';

const schema = yup.object().shape({
  fullName: yup.string().required('Required'),
  phoneNumber: yup.string().required('Required'),
  email: yup.string().email('Invalid email').required('Required'),
  consent: yup.boolean().oneOf([true], 'Must accept policy'),
  address: yup.string().required('Required'),
  deliveryNotes: yup.string()
});

export default function CheckoutPage() {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
      consent: false,
      address: '',
      deliveryNotes: ''
    }
  });

  return (
    <div className='container mx-auto max-w-6xl'>
      <div className='grid min-h-screen md:grid-cols-[1fr_500px]'>
        <form
          onSubmit={form.handleSubmit(console.log)}
          className='px-8 py-6 space-y-6'
        >
          <section className='space-y-4'>
            <h1 className='text-3xl font-bold'>Contact</h1>
            <FieldGroup>
              <Controller
                name='fullName'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Full name</FieldLabel>
                    <Input {...field} />
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
                    <FieldLabel>Phone number</FieldLabel>
                    <Input {...field} />
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
                    <FieldLabel>Email</FieldLabel>
                    <Input {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Controller
              name='consent'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <div className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={field.value}
                      onChange={e => field.onChange(e.target.checked)}
                      className='h-4 w-4'
                    />
                    <span className='text-sm'>
                      I confirm that I am at least 18 years of age and that I
                      have read and agreed to the privacy policy.
                    </span>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </section>

          <section className='space-y-4'>
            <h2 className='text-3xl font-bold'>Delivery</h2>
            <FieldGroup>
              <Controller
                name='address'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Address</FieldLabel>
                    <Input {...field} />
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
                    <FieldLabel>Delivery notes</FieldLabel>
                    <Input {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </section>
          <Skeleton className='h-16 w-full rounded-lg' />
        </form>

        <aside className='border-l bg-muted/20 px-8 py-6'>
          <div className='space-y-6'>
            <div className='space-y-3'>
              {['TỈ MỈ DIY BOX', 'STANDARD VERSION', 'KEYRING'].map(item => (
                <div key={item} className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Skeleton className='h-10 w-10' />
                    <span>{item}</span>
                  </div>
                  <Skeleton className='h-4 w-16' />
                </div>
              ))}
            </div>
            <div className='flex justify-center'>
              <Skeleton className='h-52 w-44 rounded-xl' />
            </div>
            <div className='flex gap-2'>
              <Input placeholder='Discount code' />
              <Button variant='secondary'>Apply</Button>
            </div>
            <div className='space-y-3 border-t pt-4'>
              <div className='flex justify-between'>
                <span>Subtotal</span>
                <Skeleton className='h-4 w-16' />
              </div>
              <div className='flex justify-between'>
                <span>Shipping</span>
                <Skeleton className='h-4 w-16' />
              </div>
              <div className='flex justify-between text-2xl font-bold'>
                <span>Total</span>
                <Skeleton className='h-8 w-24' />
              </div>
            </div>
            <Button className='w-full h-14'>PAY NOW</Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
