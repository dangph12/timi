const META = {
  '/': {
    title: 'Tỉ Mỉ - Made by hand, shaped by you',
    description:
      'Custom DIY character design workshop. Design your own unique character and bring it home with Tỉ Mỉ.'
  },
  '/design': {
    title: 'Design Your Character - Tỉ Mỉ',
    description:
      'Customize your DIY box with unique hair, eyes, clothes, and accessories. Create your perfect character design.'
  },
  '/checkout': {
    title: 'Checkout - Tỉ Mỉ',
    description:
      'Complete your order for the Tỉ Mỉ DIY character box. Provide your contact and delivery information.'
  },
  '/payment': {
    title: 'Payment - Tỉ Mỉ',
    description:
      'Bank transfer payment instructions for your Tỉ Mỉ order. Complete your purchase with BIDV bank transfer.'
  },
  '/finish': {
    title: 'Order Confirmed - Tỉ Mỉ',
    description:
      'Thank you for your order at Tỉ Mỉ workshop. Your custom DIY character is being prepared.'
  }
};

const FALLBACK = {
  title: 'Tỉ Mỉ',
  description: 'Custom DIY character design workshop.'
};

export default async (request, context) => {
  const url = new URL(request.url);
  const accept = request.headers.get('accept') || '';
  if (!accept.includes('text/html')) return context.next();

  const meta = META[url.pathname] || FALLBACK;
  const response = await context.next();
  const page = await response.text();

  const tags =
    `<title>${meta.title}</title>` +
    `<meta name="description" content="${meta.description}" />` +
    `<meta property="og:title" content="${meta.title}" />` +
    `<meta property="og:description" content="${meta.description}" />` +
    `<meta property="og:type" content="website" />` +
    `<meta name="twitter:card" content="summary_large_image" />`;

  return new Response(page.replace('</head>', tags + '</head>'), {
    headers: { 'content-type': 'text/html; charset=utf-8' }
  });
};
