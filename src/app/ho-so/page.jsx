import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAtom } from 'jotai';
import { useAuth } from '@/hooks/useAuth';
import { userAtom } from '@/store/auth';
import { authApi } from '@/services/auth';
import { getErrorMessage } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldGroup, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

const profileSchema = yup.object({
  fullName: yup.string().required('Vui lòng nhập họ tên'),
  phone: yup.string().nullable(),
  address: yup.string().nullable(),
});

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  const form = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: { fullName: '', phone: '', address: '' },
  });

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/dang-nhap', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user, form]);

  const onSubmit = async (data) => {
    try {
      const result = await authApi.updateProfile(data);
      setUser((prev) => ({ ...prev, ...data }));
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
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-black mb-6">Thông tin cá nhân</h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input value={user.email} readOnly />
            </Field>
            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Họ và tên</FieldLabel>
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
                  <FieldLabel>Số điện thoại</FieldLabel>
                  <Input {...field} value={field.value || ''} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Địa chỉ</FieldLabel>
                  <Input {...field} value={field.value || ''} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <Button type="submit" disabled={form.formState.isSubmitting}>
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
