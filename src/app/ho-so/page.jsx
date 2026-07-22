import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm, Controller } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAtom } from 'jotai';
import { useAuth } from '@/hooks/useAuth';
import { userAtom } from '@/store/auth';
import { updateProfile } from '@/services/auth';
import { getErrorMessage } from '@/lib/api';
import { parseAddress, buildAddress } from '@/lib/address';
import { useAddressSelection } from '@/hooks/useAddressSelection';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldGroup, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Loader2, Save, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

const profileSchema = yup.object({
  fullName: yup.string().required('Vui lòng nhập họ tên'),
  phone: yup.string().nullable(),
  street: yup.string().nullable(),
});

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  const {
    effectiveProvince,
    effectiveWard,
    setSelectedProvince,
    setSelectedWard,
    provincesQuery,
    wardsQuery,
  } = useAddressSelection(user?.address);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: { fullName: '', phone: '', street: '' },
  });

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/dang-nhap', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (user) {
      const { street } = parseAddress(user.address || '');
      form.reset({
        fullName: user.fullName || '',
        phone: user.phone || '',
        street: street,
      });
    }
  }, [user, form]);

  const onSubmit = async (data) => {
    if (!effectiveProvince || !effectiveWard) {
      setSubmitted(true);
      toast.error('Vui lòng chọn tỉnh/thành phố và phường/xã');
      return;
    }
    try {
      const fullAddress = buildAddress(data.street, effectiveWard?.name, effectiveProvince?.name);
      const payload = { ...data, address: fullAddress };
      const result = await updateProfile(payload);
      setUser((prev) => ({ ...prev, ...payload }));
      toast.success(result.message || 'Cập nhật thông tin thành công');
    } catch (error) {
      const msg = await getErrorMessage(error);
      toast.error(msg);
    }
  };

  if (!isAuthenticated || !user) return null;

  const title = 'Hồ sơ - Tỉ Mỉ';

  return (
    <>
      <title>{title}</title>
      <div className="mx-auto max-w-xl px-4">
        <h1 className="text-4xl font-black font-heading tracking-tight border-b-2 border-primary/20 pb-3 mb-6">
          Thông tin cá nhân
        </h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Field>
            <FieldLabel className="font-heading font-semibold">Email</FieldLabel>
            <Input value={user.email} readOnly className="bg-muted/50" />
          </Field>

          <FieldGroup className="gap-2">
              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel className="font-heading font-semibold">Họ và tên</FieldLabel>
                    <Input {...field} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel className="font-heading font-semibold">Số điện thoại</FieldLabel>
                    <Input {...field} value={field.value || ''} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Field className="md:col-span-2">
                  <FieldLabel className="font-heading font-semibold">Tỉnh / Thành phố</FieldLabel>
                  <div className="relative">
                    <select
                      value={effectiveProvince?.code ?? ""}
                      onChange={(e) => {
                        const code = Number(e.target.value);
                        const province = code
                          ? provincesQuery.data?.find((p) => p.code === code)
                          : null;
                        setSelectedProvince(province);
                        setSelectedWard(null);
                        setSubmitted(false);
                      }}
                      className={`h-11 w-full rounded-lg border bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 appearance-none ${
                        submitted && !effectiveProvince ? 'border-destructive' : 'border-input'
                      }`}
                    >
                      <option value="">Chọn tỉnh / thành phố</option>
                      {provincesQuery.data?.map((p) => (
                        <option key={p.code} value={p.code}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
                  </div>
                </Field>

                <Field className="md:col-span-3">
                  <FieldLabel className="font-heading font-semibold">Phường / Xã</FieldLabel>
                  <div className="relative">
                    <select
                      value={effectiveWard?.code ?? ""}
                      onChange={(e) => {
                        const code = Number(e.target.value);
                        const ward = code
                          ? wardsQuery.data?.wards?.find((w) => w.code === code)
                          : null;
                        setSelectedWard(ward);
                        setSubmitted(false);
                      }}
                      disabled={!effectiveProvince || wardsQuery.isLoading}
                      className={`h-11 w-full rounded-lg border bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 appearance-none ${
                        submitted && !effectiveWard ? 'border-destructive' : 'border-input'
                      }`}
                    >
                      <option value="">
                        {effectiveProvince ? "Chọn phường / xã" : "Chọn tỉnh / thành phố trước"}
                      </option>
                      {wardsQuery.data?.wards?.map((w) => (
                        <option key={w.code} value={w.code}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
                  </div>
                </Field>
              </div>

              <Controller
                name="street"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel className="font-heading font-semibold">Số nhà, ngõ</FieldLabel>
                    <Input {...field} value={field.value || ''} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

          <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {form.formState.isSubmitting ? 'Đang xử lý...' : 'Lưu thay đổi'}
          </Button>
        </form>
      </div>
    </>
  );
}
