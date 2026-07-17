const META = {
  '/': {
    title: 'Tỉ Mỉ - Cá nhân hoá phụ kiện cho bạn',
    description:
      'Tự tay thiết kế nhân vật độc đáo của riêng bạn cùng Tỉ Mỉ.',
  },
  '/thiet-ke': {
    title: 'Thiết kế nhân vật - Tỉ Mỉ',
    description:
      'Tùy chỉnh hộp DIY của bạn với kiểu tóc, mắt, quần áo và phụ kiện độc đáo. Tạo thiết kế nhân vật hoàn hảo.',
  },
  '/tao-don-hang': {
    title: 'Thanh toán - Tỉ Mỉ',
    description:
      'Hoàn tất đơn hàng Tỉ Mỉ của bạn. Vui lòng cung cấp thông tin liên hệ và giao hàng.',
  },
  '/thanh-toan': {
    title: 'Thanh toán - Tỉ Mỉ',
    description: 'Thanh toán đơn hàng của bạn',
  },
  '/hoan-tat': {
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
  if (pathname === '/thiet-ke') return META['/thiet-ke'];
  if (pathname === '/tao-don-hang') return META['/tao-don-hang'];
  if (pathname.includes('/thanh-toan')) return META['/thanh-toan'];
  if (pathname.includes('/hoan-tat')) return META['/hoan-tat'];
  return FALLBACK;
}

export default async (request, context) => {
  const url = new URL(request.url);
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  const meta = matchMeta(url.pathname);
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
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
};
