import { Button } from '@/components/ui/button';
import Header from '@/components/header';
import { Link } from 'react-router';

export function Page() {
  const title = 'Tỉ Mỉ - Made by hand, shaped by you';
  const description =
    'Custom DIY character design workshop. Design your own unique character and bring it home with Tỉ Mỉ.';

  return (
    <>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:type' content='website' />
      <div className='flex min-h-screen flex-col font-sans bg-white overflow-x-hidden'>
              <Header />
      
              {/* HERO SECTION - Blue Background with about1 image */}
              <section className='relative bg-[#001ffc] text-white w-full overflow-hidden'>
                {/* Desktop */}

                
                <Link to='/design' className='hidden md:block'>
                  <img
                    src='/homebg1.png'
                    alt='About Us - Tỉ Mỉ Workshop'
                    className='w-full h-auto object-cover'
                  />
                </Link>
              




                {/* Mobile - clickable to /design */}
                <Link to='/design' className='block md:hidden'>
                  <img
                    src='/hombg3.png'
                    alt='Back to School Collection - Try it'
                    className='w-full h-auto object-cover'
                  />
                </Link>
              </section>
   
      
            </div>
    </>
  );
}

export default Page;
