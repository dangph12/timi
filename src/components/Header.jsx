import { Button } from '@/components/ui/button';
import { Menu, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const { data: cartData } = useCart();
  const totalElements = cartData?.totalElements ?? 0;

  return (
    <header className='flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-white sticky top-0 z-50 shadow-sm'>
      <Link
        to='/'
        className='hover:opacity-80 transition-opacity flex items-center justify-center'
      >
        <img
          src='/timilogo.png'
          alt='Tỉ Mỉ logo'
          className='h-6 md:h-8 lg:h-10 w-auto object-contain'
        />
      </Link>

      <div className='flex items-center gap-2 lg:gap-4'>
        <Link
          to='/gio-hang'
          className='relative p-2 text-muted-foreground hover:text-primary transition-colors'
        >
          <ShoppingCart size={20} strokeWidth={2.5} />
          {totalElements > 0 && (
            <span className='absolute -top-0.5 -right-0.5 bg-destructive text-white text-[10px] font-bold leading-none min-w-[16px] h-4 flex items-center justify-center rounded-full px-1'>
              {totalElements > 99 ? '99+' : totalElements}
            </span>
          )}
        </Link>

        <button className='lg:hidden p-2 text-muted-foreground hover:text-primary transition-colors'>
          <Menu size={20} strokeWidth={2.5} />
        </button>

        {isAuthenticated ? (
          <Button variant='ghost' asChild>
            <Link to='/ho-so'>{user?.fullName}</Link>
          </Button>
        ) : (
          <>
            <Button variant='ghost' asChild>
              <Link to='/dang-nhap'>Đăng nhập</Link>
            </Button>
            <Button variant='outline' asChild>
              <Link to='/dang-ky'>Đăng ký</Link>
            </Button>
          </>
        )}

        <Button
          className='bg-linear-to-r from-btn-gradient-from to-btn-gradient-to hover:opacity-90 transition-opacity text-white font-black rounded-full px-5 py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-3.5 border-0 text-sm md:text-base tracking-wide shadow-sm h-auto'
          asChild
        >
          <Link to='/thiet-ke'>
            <span className='hidden sm:inline'>THIẾT KẾ NGAY</span>
            <span className='sm:hidden'>THIẾT KẾ</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
