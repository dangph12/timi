import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import Header from '@/components/header';

export function HowToBuyPage() {
  const title = 'About Us - Tỉ Mỉ Workshop';
  const description =
    'Tỉ Mỉ Workshop is a craft studio where customers design felt portraits and turn them into personalised products such as keychain, griptok, magnet/badges, luggage tag.';

  const [form, setForm] = useState({ fullname: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />

      <div className='flex min-h-screen flex-col font-sans bg-white overflow-x-hidden'>
        <Header />

        {/* HERO SECTION */}
        <section className='relative bg-[#001ffc] text-white w-full overflow-hidden'>
          <img
            src='/aboutus/howtobuy2.png'
            alt='About Us - Tỉ Mỉ Workshop'
            className='w-full h-auto block object-cover'
          />
        </section>

        {/* WORKSHOP BOOKING FORM */}
        <section
          className='w-full h-full py-25 px-4'
          style={{
            backgroundImage: "url('/aboutus/howtobuybg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          

          <form
            onSubmit={handleSubmit}
            className='w-full max-w-5xl mx-auto bg-[#ff5cba] rounded-3xl p-8 md:p-12 flex flex-col gap-5'
          >
            {/* Full name */}
            <div className='flex flex-col gap-1'>
              <label className='font-extrabold text-[#001ffc] text-sm md:text-base'>
                Full name <span className='font-normal italic text-white'>( required )</span>
              </label>
              <input
                type='text'
                name='fullname'
                value={form.fullname}
                onChange={handleChange}
                required
                className='w-full md:w-1/2 rounded-2xl border-2 border-[#001ffc] bg-white px-4 py-3 outline-none text-gray-800 text-sm'
              />
            </div>

            {/* Phone + Email */}
            <div className='flex flex-col md:flex-row gap-5'>
              <div className='flex flex-col gap-1 flex-1'>
                <label className='font-extrabold text-[#001ffc] text-sm md:text-base'>
                  Phone number <span className='font-normal italic text-white'>( required )</span>
                </label>
                <input
                  type='tel'
                  name='phone'
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className='w-full rounded-2xl border-2 border-[#001ffc] bg-white px-4 py-3 outline-none text-gray-800 text-sm'
                />
              </div>
              <div className='flex flex-col gap-1 flex-1'>
                <label className='font-extrabold text-[#001ffc] text-sm md:text-base'>
                  Email <span className='font-normal italic text-white'>( required )</span>
                </label>
                <input
                  type='email'
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  required
                  className='w-full rounded-2xl border-2 border-[#001ffc] bg-white px-4 py-3 outline-none text-gray-800 text-sm'
                />
              </div>
            </div>

            {/* Message */}
            <div className='flex flex-col gap-1'>
              <label className='font-extrabold text-[#001ffc] text-sm md:text-base'>Message</label>
              <textarea
                name='message'
                value={form.message}
                onChange={handleChange}
                rows={5}
                className='w-full rounded-2xl border-2 border-[#001ffc] bg-white px-4 py-3 outline-none text-gray-800 text-sm resize-none'
              />
            </div>

            {/* Submit */}
            <div className='flex flex-col items-center gap-2 mt-2'>
              <button
                type='submit'
                className='px-12 py-3 rounded-2xl border-2 border-[#001ffc] bg-white text-[#e91e8c] font-extrabold text-base hover:bg-[#001ffc] hover:text-white transition-colors'
              >
                Submit
              </button>
              {submitted && (
                <div className='text-center mt-1'>
                  <p className='text-[#001ffc] font-extrabold italic text-base'>Registration successful!</p>
                  <p className='text-white italic text-sm'>
                    <span className='font-bold'>Tỉ Mỉ workshop</span> will call to confirm your booking as soon as possible.
                  </p>
                </div>
              )}
            </div>
          </form>
        </section>

        <section className='relative bg-[#001ffc] text-white w-full overflow-hidden'>
          <img
            src='/aboutus/flbg.png'
            alt='About Us - Tỉ Mỉ Workshop'
            className='w-full h-auto block object-cover'
          />
        </section>

      </div>
    </>
  );
}

export default HowToBuyPage;