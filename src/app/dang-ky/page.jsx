import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { GOOGLE_OAUTH_URL } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldGroup, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const registerSchema = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  password: yup.string().min(6, 'Mật khẩu tối thiểu 6 ký tự').required('Vui lòng nhập mật khẩu'),
  fullName: yup.string().required('Vui lòng nhập họ tên'),
  phone: yup.string().required('Vui lòng nhập số điện thoại'),
});

export default function RegisterPage() {
  const { register: doRegister, loading } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { email: '', password: '', fullName: '', phone: '' },
  });

  const onSubmit = async (data) => {
    try {
      await doRegister(data);
      navigate('/');
    } catch {
      // Errors handled by useAuth toast
    }
  };

  const title = 'Đăng ký - Tỉ Mỉ';
  const description = 'Tạo tài khoản Tỉ Mỉ mới.';

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <div className="flex min-h-full items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-black">Đăng ký</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Tạo tài khoản mới tại Tỉ Mỉ
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Họ và tên</FieldLabel>
                    <Input placeholder="Nguyen Van A" {...field} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input type="email" placeholder="email@example.com" {...field} />
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
                    <Input placeholder="0123456789" {...field} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Mật khẩu</FieldLabel>
                    <Input type="password" placeholder="••••••••" {...field} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Hoặc</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" asChild>
            <a href={GOOGLE_OAUTH_URL}>Đăng ký với Google</a>
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Đã có tài khoản?{' '}
            <Link to="/dang-nhap" className="font-medium text-primary hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
