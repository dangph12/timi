import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/dang-nhap', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (!isAuthenticated || !user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const title = 'Hồ sơ - Tỉ Mỉ';

  return (
    <>
      <title>{title}</title>
      <div className="flex min-h-full items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-black">Hồ sơ của tôi</h1>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel>Họ và tên</FieldLabel>
              <Input value={user.fullName} readOnly />
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input value={user.email} readOnly />
            </Field>
            <Field>
              <FieldLabel>Số điện thoại</FieldLabel>
              <Input value={user.phone || '—'} readOnly />
            </Field>
            <Field>
              <FieldLabel>Địa chỉ</FieldLabel>
              <Input value="Địa chỉ (sắp có)" readOnly />
            </Field>
          </FieldGroup>

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </div>
    </>
  );
}
