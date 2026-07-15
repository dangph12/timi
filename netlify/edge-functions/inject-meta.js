const META = {
  '/': {
    title: 'Tỉ Mỉ - Cá nhân hoá phụ kiện cho bạn',
    description:
      'Tự tay thiết kế nhân vật độc đáo của riêng bạn cùng Tỉ Mỉ.',
  },
  '/design': {
    title: 'Thiết kế nhân vật - Tỉ Mỉ',
    description:
      'Tùy chỉnh hộp DIY của bạn với kiểu tóc, mắt, quần áo và phụ kiện độc đáo. Tạo thiết kế nhân vật hoàn hảo.',
  },
  '/checkout': {
    title: 'Thanh toán - Tỉ Mỉ',
    description:
      'Hoàn tất đơn hàng Tỉ Mỉ của bạn. Vui lòng cung cấp thông tin liên hệ và giao hàng.',
  },
  '/payment': {
    title: 'Thanh toán - Tỉ Mỉ',
    description: 'Thanh toán đơn hàng của bạn',
  },
  '/finish': {
    title: 'Đã xác nhận đơn hàng - Tỉ Mỉ',
    description: 'Cảm ơn bạn đã đặt hàng tại shop Tỉ Mỉ.',
  },
};

const FALLBACK = {
  title: 'Tỉ Mỉ',
  description: 'Tỉ Mỉ - Cá nhân hoá phụ kiện cho bạn.',
};

const OG_IMAGE = 'https://timishop.netlify.app/og-image.jpg';

function matchMeta(pathname) {
  if (pathname === '/') return META['/'];
  if (pathname === '/design') return META['/design'];
  if (pathname === '/checkout') return META['/checkout'];
  if (pathname.includes('/payment')) return META['/payment'];
  if (pathname.includes('/finish')) return META['/finish'];
  return FALLBACK;
}

export default async (request, context) => {
  const url = new URL(request.url);
  const accept = request.headers.get('accept') || '';
  if (!accept.includes('text/html')) return context.next();

  const meta = matchMeta(url.pathname);
  const response = await context.next();
  const page = await response.text();

  const tags =
    `<title>${meta.title}</title>` +
    `<meta name="description" content="${meta.description}" />` +
    `<meta property="og:title" content="${meta.title}" />` +
    `<meta property="og:description" content="${meta.description}" />` +
    `<meta property="og:type" content="website" />` +
    `<meta property="og:image" content="${OG_IMAGE}" />` +
    `<meta property="og:image:width" content="1200" />` +
    `<meta property="og:image:height" content="630" />` +
    `<meta name="twitter:card" content="summary_large_image" />` +
    `<meta name="twitter:image" content="${OG_IMAGE}" />`;

  const withLang = page.replace('<html', '<html lang="vi"');
  return new Response(withLang.replace('</head>', tags + '</head>'), {
    headers: { 'content-type': 'text/html; charset=utf-8' }
  });
};
