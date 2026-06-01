import { Button } from '@/components/ui/button';
import { ShoppingCart, Search, User, ChevronDown, Menu } from 'lucide-react';
import { Link } from 'react-router'; // Assuming react-router is used

export function Page() {
  return (
    <div className='flex min-h-screen flex-col font-sans'>
      {/* Header */}
      <header className='flex items-center justify-between px-4 md:px-8 py-6 md:py-8 bg-white sticky top-0 z-50 shadow-sm'>
        {/* Mobile Menu Button */}
        <button className='lg:hidden p-2 -ml-2 text-gray-700 hover:text-pink-500 transition-colors'>
          <Menu size={24} strokeWidth={2.5} />
        </button>

        {/* Left Navigation */}
        <nav className='hidden lg:flex gap-8 items-center font-bold text-lg'>
          <a href='#' className='flex items-center gap-1 hover:text-pink-500 transition-colors'>
            SHOP <ChevronDown size={14} strokeWidth={3} className="mt-0.5" />
          </a>
          <a href='#' className='flex items-center gap-1 hover:text-pink-500 transition-colors'>
            HOW TO BUY <ChevronDown size={14} strokeWidth={3} className="mt-0.5" />
          </a>
          <a href='#' className='hover:text-pink-500 transition-colors'>ABOUT US</a>
        </nav>

        {/* Center Logo */}
        <div className='absolute left-1/2 -translate-x-1/2'>
          <Link to="/" className='hover:opacity-80 transition-opacity flex items-center justify-center'>
            {/* Make sure to save the requested logo image as "logo.png" inside the "public" folder */}
            <img src="/timilogo.png" alt="tỉ mỉ logo" className="h-10 md:h-14 lg:h-16 w-auto object-contain" />
          </Link>
        </div>

        {/* Right Actions */}
        <div className='flex items-center gap-4 lg:gap-8'>
          <div className='flex items-center gap-3 lg:gap-5'>
            <button className='relative hover:text-pink-500 transition-colors group'>
              <ShoppingCart size={24} strokeWidth={2.5} />
              <span className='absolute -top-2 -right-2 md:-right-3 bg-[#42d1d1] text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white group-hover:scale-110 transition-transform'>
                3
              </span>
            </button>
            <button className='hover:text-pink-500 transition-colors hidden sm:block'>
              <Search size={24} strokeWidth={2.5} />
            </button>
            <button className='hover:text-pink-500 transition-colors hidden sm:block'>
              <User size={24} strokeWidth={2.5} />
            </button>
          </div>
          <Button 
            className='bg-gradient-to-r from-[#f43397] to-[#b340e6] hover:opacity-90 transition-opacity text-white font-black rounded-full px-5 py-5 md:px-6 md:py-6 lg:px-8 border-0 text-xs md:text-sm tracking-wide shadow-sm'
            asChild
          >
            <Link to="/design">
              <span className="hidden sm:inline">DESIGN YOUR ITEM</span>
              <span className="sm:hidden">DESIGN</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className='flex-1 relative bg-[#e7e7eb] flex flex-col justify-end px-0 md:px-8 py-10 lg:py-16'>
        
        {/* Decorative Background Elements based on screenshot feel */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
          <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
        </div>

        {/* Content */}
        <div className='relative z-10 w-full flex flex-col items-start mb-12 sm:mb-16 md:mb-20 lg:mb-28 px-6 md:px-0 lg:px-8 xl:px-12'>
          <h1 
            className='text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[1.1] font-black text-[#8cc6eb] tracking-wide'
            style={{
              WebkitTextStroke: '0.12em white',
              paintOrder: 'stroke fill',
            }}
          >
            Made by hand, shaped by you
          </h1>
          <Button 
            className='bg-[#8cc6eb] hover:bg-[#7cb9e0] text-white border-[3px] md:border-4 border-white rounded-full px-5 py-3 md:px-8 md:py-6 text-sm md:text-lg font-black tracking-widest shadow-none mt-2 md:mt-4 lg:mt-6'
          >
            CHECK IT OUT
          </Button>
        </div>
        
        {/* Pagination Indicators */}
        <div className="absolute bottom-6 md:bottom-10 right-6 md:right-10 lg:right-16 z-10 flex gap-2 md:gap-3">
          {[1, 2, 3, 4, 5, 6].map((item, i) => (
            <button 
              key={i} 
              className={`h-2 rounded-full transition-all ${i === 1 ? 'w-10 bg-white' : 'w-10 bg-white/50 hover:bg-white/70'}`} 
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Page;
