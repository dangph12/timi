import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Link } from 'react-router'; // Assuming react-router is used

export default function Header() {
  return (
    <header className='flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-white sticky top-0 z-50 shadow-sm'>
      <button className='lg:hidden p-2 -ml-2 text-gray-700 hover:text-pink-500 transition-colors'>
        <Menu size={20} strokeWidth={2.5} />
      </button>
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

      <div className='flex items-center gap-4 lg:gap-6'>
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
