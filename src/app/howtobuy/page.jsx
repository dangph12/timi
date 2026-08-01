import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import Header from '@/components/header';

export function HowToBuyPage() {
  const title = 'About Us - Tỉ Mỉ Workshop';
  const description =
    'Tỉ Mỉ Workshop is a craft studio where customers design felt portraits and turn them into personalised products such as keychain, griptok, magnet/badges, luggage tag.';

  return (
    <>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />

      <div className='flex min-h-screen flex-col font-sans bg-white overflow-x-hidden'>
        <Header />

        {/* HERO SECTION - Blue Background with about1 image */}
        <section className='relative bg-[#001ffc] text-white w-full overflow-hidden'>
          <img
            src='/aboutus/howtobuy.png'
            alt='About Us - Tỉ Mỉ Workshop'
            className='w-full h-auto block object-cover'
          />
        </section>

       
      </div>
    </>
  );
}

export default HowToBuyPage;