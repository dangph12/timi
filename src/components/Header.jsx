import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useCartCount } from '@/hooks/useCartCount';
import { cn } from '@/lib/shadcn';

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const { data: totalElements = 0 } = useCartCount();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className='flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-background sticky top-0 z-50 shadow-sm'>
        <Link
          to='/'
          className='hover:opacity-80 transition-opacity flex items-center justify-center'
        >
          <img
            src='/logo.png'
            alt='Timi logo'
            className='h-6 md:h-8 lg:h-10 w-auto object-contain'
          />
        </Link>

        <div className='flex items-center gap-2 sm:gap-4 lg:gap-6'>
          <Link
            to='/gio-hang'
            className='relative p-2 text-muted-foreground hover:text-primary transition-colors'
          >
            <ShoppingCart size={20} strokeWidth={2.5} />
            {totalElements > 0 && (
              <span className='absolute -top-0.5 -right-0.5 bg-destructive text-white text-[10px] font-bold leading-none min-w-[16px] h-4 flex items-center justify-center rounded-full px-1'>
                {totalElements > 9 ? '9+' : totalElements}
              </span>
            )}
          </Link>

          <div className='hidden lg:flex items-center gap-2'>
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
          </div>

          <Button
            className='bg-linear-to-r from-btn-gradient-from to-btn-gradient-to hover:opacity-90 transition-opacity text-white font-black rounded-full px-5 py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-3.5 border-0 text-sm md:text-base tracking-wide shadow-sm h-auto'
            asChild
          >
            <Link to='/thiet-ke'>
              <span className='hidden sm:inline'>THIẾT KẾ NGAY</span>
              <span className='sm:hidden'>THIẾT KẾ</span>
            </Link>
          </Button>

          <button
            className='lg:hidden p-2 text-muted-foreground hover:text-primary transition-colors'
            onClick={() => setDrawerOpen(true)}
            aria-label='Mở menu'
          >
            <Menu size={20} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {drawerOpen && (
        <div
          className='fixed inset-0 z-50 bg-black/30 lg:hidden'
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 right-0 bottom-0 z-50 w-72 bg-background shadow-xl lg:hidden flex flex-col transition-transform duration-200',
          drawerOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className='flex items-center justify-between px-4 py-3 border-b'>
          <span className='font-bold text-sm'>Menu</span>
          <button
            onClick={() => setDrawerOpen(false)}
            className='p-1 hover:bg-muted rounded-md transition-colors'
            aria-label='Đóng menu'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <nav className='flex-1 px-4 py-4 space-y-1'>
          <Link
            to='/thiet-ke'
            onClick={() => setDrawerOpen(false)}
            className='block px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted transition-colors'
          >
            Thiết kế
          </Link>
          <Link
            to='/gio-hang'
            onClick={() => setDrawerOpen(false)}
            className='block px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted transition-colors'
          >
            Giỏ hàng
          </Link>
          {isAuthenticated ? (
            <>
              <div className='border-t my-3' />
              <Link
                to='/ho-so'
                onClick={() => setDrawerOpen(false)}
                className='block px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted transition-colors'
              >
                Hồ sơ
              </Link>
              <Link
                to='/don-hang'
                onClick={() => setDrawerOpen(false)}
                className='block px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted transition-colors'
              >
                Đơn hàng
              </Link>
            </>
          ) : (
            <>
              <div className='border-t my-3' />
              <Link
                to='/dang-nhap'
                onClick={() => setDrawerOpen(false)}
                className='block px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted transition-colors'
              >
                Đăng nhập
              </Link>
              <Link
                to='/dang-ky'
                onClick={() => setDrawerOpen(false)}
                className='block px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted transition-colors'
              >
                Đăng ký
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
