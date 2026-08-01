import Header from '@/components/header';

export function AboutUsPage() {
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
            src='/aboutus/about1.png'
            alt='About Us - Tỉ Mỉ Workshop'
            className='w-full h-auto block object-cover'
          />
        </section>

        {/* VISION / SLOGAN / MISSION SECTION - White Background */}
        <section className='relative bg-[#001ffc] text-white w-full overflow-hidden'>
         <img
            src='/aboutus/about2.png'
            alt='About Us - Tỉ Mỉ Workshop'
            className='w-full h-auto block object-cover'
          />
        </section>

        {/* SERVICES SECTION */}
        <section className='relative bg-[#001ffc] text-white w-full overflow-hidden'>

           <img
            src='/aboutus/about3.png'
            alt='About Us - Tỉ Mỉ Workshop'
            className='w-full h-auto block object-cover'
          />
        </section>

        {/* FOOTER SOCIAL & BRAND PATTERN */}
        <section className='relative bg-[#001ffc] text-white w-full overflow-hidden'>

           <img
            src='/aboutus/about4.png'
            alt='About Us - Tỉ Mỉ Workshop'
            className='w-full h-auto block object-cover'
          />
        </section>

      </div>
    </>
  );
}

export default AboutUsPage;