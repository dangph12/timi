import { Button } from '@/components/ui/button';
import { ShoppingCart, Search, User, ChevronDown, Menu } from 'lucide-react';
import { Link } from 'react-router'; // Assuming react-router is used

export default function Header() {
  return (
    <header className='flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-white sticky top-0 z-50 shadow-sm'>
      {/* Mobile Menu Button */}
      <button className='lg:hidden p-2 -ml-2 text-gray-700 hover:text-pink-500 transition-colors'>
        <Menu size={20} strokeWidth={2.5} />
      </button>

      {/* Left Navigation */}
      <nav className='hidden lg:flex gap-6 items-center font-bold text-sm tracking-wide'>
        <a
          href='#'
          className='flex items-center gap-1 hover:text-pink-500 transition-colors'
        >
          SHOP <ChevronDown size={14} strokeWidth={3} className='mt-0.5' />
        </a>
        <a
          href='#'
          className='flex items-center gap-1 hover:text-pink-500 transition-colors'
        >
          HOW TO BUY{' '}
          <ChevronDown size={14} strokeWidth={3} className='mt-0.5' />
        </a>
        <a href='#' className='hover:text-pink-500 transition-colors'>
          ABOUT US
        </a>
      </nav>

      {/* Center Logo */}
      <div className='absolute left-1/2 -translate-x-1/2'>
        <Link
          to='/'
          className='hover:opacity-80 transition-opacity flex items-center justify-center'
        >
          <img
            src='/timilogo.png'
            alt='tỉ mỉ logo'
            className='h-12 md:h-14 lg:h-16 w-auto object-contain'
          />
        </Link>
      </div>

      {/* Right Actions */}
      <div className='flex items-center gap-4 lg:gap-6'>
        <div className='flex items-center gap-3 lg:gap-5'>
          <button className='relative hover:text-pink-500 transition-colors group'>
            <ShoppingCart size={28} strokeWidth={2} />
            <span className='absolute -top-3 -right-3 bg-[#42d1d1] text-black text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white group-hover:scale-110 transition-transform'>
              3
            </span>
          </button>
          <button className='hover:text-pink-500 transition-colors hidden sm:block'>
            <Search size={28} strokeWidth={2} />
          </button>
          <button className='hover:text-pink-500 transition-colors hidden sm:block'>
            <User size={28} strokeWidth={2} />
          </button>
        </div>
        <Button
          className='bg-linear-to-r from-[#f43397] to-[#b340e6] hover:opacity-90 transition-opacity text-white font-black rounded-full px-4 py-2 md:px-5 md:py-2.5 lg:px-6 border-0 text-xs md:text-sm tracking-wide shadow-sm h-auto'
          asChild
        >
          <Link to='/design'>
            <span className='hidden sm:inline'>DESIGN YOUR ITEM</span>
            <span className='sm:hidden'>DESIGN</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
