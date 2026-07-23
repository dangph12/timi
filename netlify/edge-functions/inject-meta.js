const META = {
  '/': {
    title: 'Timi - Cá nhân hoá phụ kiện cho bạn',
    description:
      'Tự tay thiết kế nhân vật độc đáo của riêng bạn cùng Timi.',
  },
  '/gioi-thieu': {
    title: 'Giới thiệu - Timi',
    description:
      'Timi là trang web giới thiệu sản phẩm, cho phép bạn tự tay thiết kế nhân vật và trải nghiệm quy trình mua sắm trực tuyến.',
  },
  '/thiet-ke': {
    title: 'Thiết kế nhân vật - Timi',
    description:
      'Tùy chỉnh hộp DIY của bạn với kiểu tóc, mắt, quần áo và phụ kiện độc đáo. Tạo thiết kế nhân vật hoàn hảo.',
  },
  '/tao-don-hang': {
    title: 'Thanh toán - Timi',
    description:
      'Hoàn tất đơn hàng Timi của bạn. Vui lòng cung cấp thông tin liên hệ và giao hàng.',
  },
  '/thanh-toan': {
    title: 'Thanh toán - Timi',
    description: 'Thanh toán đơn hàng của bạn',
  },
  '/hoan-tat': {
    title: 'Đã xác nhận đơn hàng - Timi',
    description: 'Cảm ơn bạn đã đặt hàng tại shop Timi.',
  },
};

const FALLBACK = {
  title: 'Timi',
  description: 'Timi - Cá nhân hoá phụ kiện cho bạn.',
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
