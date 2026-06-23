import { Button } from '@/components/ui/button';
import Header from '@/components/header';

export function Page() {
  const title = 'Tỉ Mỉ - Made by hand, shaped by you';
  const description = 'Custom DIY character design workshop. Design your own unique character and bring it home with Tỉ Mỉ.';

  return (
    <>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:type' content='website' />
      <div className='flex min-h-screen flex-col font-sans'>
      <Header />

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
    </>
  );
}

export default Page;
