import { PenTool, LogIn, LayoutGrid, TriangleAlert } from "lucide-react";

const KEYPOINTS = [
  { icon: LogIn, text: "Vào là thiết kế luôn — không cần tạo tài khoản, không cần đăng nhập trước." },
  { icon: PenTool, text: "Tự tay chỉnh từng chi tiết — tóc, mắt, quần áo, phụ kiện, đổi cái nào thấy ngay cái đó." },
  { icon: LayoutGrid, text: "Nhiều lựa chọn thiết kế — hơn 70 lựa chọn dành cho bạn." },
];

export function Page() {
  const title = "Giới thiệu - Timi";
  const description = "Timi là trang web giới thiệu sản phẩm, cho phép bạn tự tay thiết kế nhân vật và trải nghiệm quy trình mua sắm trực tuyến.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <div className="mx-auto max-w-2xl px-4 py-12 md:py-20 font-body">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
          Về Timi
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-10">
          Timi là nền tảng cho phép bạn tự tay thiết kế nhân vật độc đáo, sau đó áp dụng lên nhiều loại sản phẩm khác nhau. Trải nghiệm quy trình từ thiết kế, đặt hàng, đến thanh toán — tất cả trong một giao diện trực quan và mượt mà.
        </p>

        <p className="text-sm md:text-base text-muted-foreground leading-relaxed -mt-6 mb-10">
          Dự án được phát triển bởi{' '}
          <a
            href="https://drive.google.com/open?id=1gocMqsnAcFRHsIriBcvfsw-SC4FqEGtD&usp=drive_fs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-bold underline underline-offset-2"
          >
            Phan Hải Đăng
          </a>
        </p>

        <h2 className="text-2xl font-black mb-4">Tính năng chính</h2>
        <ul className="space-y-3 mb-10">
          {KEYPOINTS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.text} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-base text-muted-foreground leading-relaxed pt-1">
                  {item.text}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="rounded-xl border border-dashed border-warning/40 bg-warning/5 p-5 text-base leading-relaxed">
          <p className="font-bold text-warning mb-1 flex items-center gap-1.5"><TriangleAlert className="h-4 w-4" /> Thông tin quan trọng</p>
          <p>
            Trang web này là sản phẩm giới thiệu nhằm mục đích phát triển và trình bày khả năng kỹ thuật, không phải một cửa hàng thực tế. Các đơn hàng được tạo ra chỉ nhằm mục đích trải nghiệm quy trình và sẽ không được xử lý, giao hàng hay hoàn tiền.
          </p>
        </div>
      </div>
    </>
  );
}

export default Page;
