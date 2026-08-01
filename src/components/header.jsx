import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Search, User, ChevronDown, Menu, X } from 'lucide-react';
import { Link } from 'react-router'; // Assuming react-router is used

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className='flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-white sticky top-0 z-50 shadow-sm'>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className='lg:hidden p-2 -ml-2 text-gray-700 hover:text-pink-500 transition-colors focus:outline-hidden'
          aria-label='Toggle menu'
        >
          {isMobileMenuOpen ? (
            <X size={24} strokeWidth={2.5} />
          ) : (
            <Menu size={24} strokeWidth={2.5} />
          )}
        </button>

        {/* Left Navigation */}
        <nav className='hidden lg:flex gap-6 items-center font-bold text-sm tracking-wide'>
          <a
            href='#'
            className='flex items-center gap-1 hover:text-pink-500 transition-colors'
          >
            SHOP <ChevronDown size={14} strokeWidth={3} className='mt-0.5' />
          </a>
          <Link to='/howtobuy' className='hover:text-pink-500 transition-colors'>
            HOW TO BUY
          </Link>

          <Link to='/aboutus' className='hover:text-pink-500 transition-colors'>
            ABOUT US
          </Link>
        </nav>

        {/* Center Logo */}
        <div className='absolute left-1/2 -translate-x-1/2 flex items-center justify-center h-full'>
          <Link
            to='/'
            className='hover:opacity-80 transition-opacity flex items-center justify-center'
          >
            <img
              src='/timilogo.png'
              alt='tỉ mỉ logo'
              className='h-6 md:h-8 lg:h-10 w-auto object-contain'
            />
          </Link>
        </div>

        {/* Right Actions */}
        <div className='flex items-center gap-4 lg:gap-6'>
          <div className='flex items-center gap-3 lg:gap-5'>
            <button className='relative hover:text-pink-500 transition-colors group'>
              <ShoppingCart size={24} md:size={28} strokeWidth={2} />
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
            className='bg-linear-to-r from-[#f43397] to-[#b340e6] hover:opacity-90 transition-opacity text-white font-black rounded-full px-3 py-1.5 md:px-5 md:py-2.5 lg:px-6 border-0 text-[11px] md:text-sm tracking-wide shadow-sm h-auto'
            asChild
          >
            <Link to='/design'>
              <span className='hidden sm:inline'>DESIGN YOUR ITEM</span>
              <span className='sm:hidden'>DESIGN</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className='lg:hidden fixed inset-x-0 top-[53px] md:top-[65px] bg-white z-40 border-b border-gray-200 shadow-lg px-6 py-6 transition-all animate-in slide-in-from-top-2'>
          <nav className='flex flex-col gap-4 font-bold text-base tracking-wide text-gray-800'>
            <a
              href='#'
              onClick={() => setIsMobileMenuOpen(false)}
              className='flex items-center justify-between py-2 border-b border-gray-100 hover:text-pink-500 transition-colors'
            >
              <span>SHOP</span>
              <ChevronDown size={18} />
            </a>
            <Link
              to='/howtobuy'
              onClick={() => setIsMobileMenuOpen(false)}
              className='py-2 border-b border-gray-100 hover:text-pink-500 transition-colors'
            >
              HOW TO BUY
            </Link>
            <Link
              to='/aboutus'
              onClick={() => setIsMobileMenuOpen(false)}
              className='py-2 border-b border-gray-100 hover:text-pink-500 transition-colors'
            >
              ABOUT US
            </Link>

     
          </nav>
        </div>
      )}
    </>
  );
}
