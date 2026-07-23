import { Button } from "@/components/ui/button";
import { PenTool, LogIn, LayoutGrid } from "lucide-react";
import { Link } from "react-router";

export function Page() {
  const title = "Timi - Cá nhân hoá phụ kiện cho bạn";
  const description =
    "Tự tay thiết kế nhân vật độc đáo của riêng bạn cùng Timi.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <div className="font-body">
        <main className="relative bg-muted w-full aspect-video max-h-[calc(100svh-80px)] min-h-[280px]">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <picture className="absolute inset-0 w-full h-full">
              <source media="(max-width: 768px)" srcSet="/hero/mobile.png" />
              <source media="(min-width: 769px)" srcSet="/hero/desktop.png" />
              <img
                src="/hero/desktop.png"
                alt="Hero background"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </picture>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-6 md:px-0 lg:px-8 xl:px-12 pb-8 md:pb-12 lg:pb-16">
            <h1
              className="text-[1.5rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] font-black text-primary/50 break-words tracking-normal sm:tracking-wide"
              style={{
                WebkitTextStroke: "0.12em white",
                paintOrder: "stroke fill",
              }}
            >
              Cá nhân hoá phụ kiện cho bạn
            </h1>
            <Link to="/thiet-ke">
              <Button className="bg-primary hover:bg-primary/75 text-white border-[3px] md:border-4 border-white rounded-full px-5 py-3 md:px-8 md:py-6 text-sm md:text-lg font-black tracking-widest shadow-none mt-2 md:mt-4 lg:mt-6">
                THIẾT KẾ NGAY
              </Button>
            </Link>
          </div>
        </main>

        <section className="bg-background px-4 md:px-8 py-12 md:py-20">
          <div className="mx-auto max-w-3xl space-y-8 md:space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="flex h-14 w-14 md:h-20 md:w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <LogIn className="h-7 w-7 md:h-10 md:w-10" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg md:text-xl font-black mb-1">Vào là thiết kế luôn</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Không cần tạo tài khoản, không cần đăng nhập trước.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="flex h-14 w-14 md:h-20 md:w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <PenTool className="h-7 w-7 md:h-10 md:w-10" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg md:text-xl font-black mb-1">Tự tay chỉnh từng chi tiết</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Tóc, mắt, quần áo, phụ kiện — đổi cái nào thấy ngay cái đó trên hình.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="flex h-14 w-14 md:h-20 md:w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <LayoutGrid className="h-7 w-7 md:h-10 md:w-10" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg md:text-xl font-black mb-1">Nhiều lựa chọn thiết kế</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Hơn 70 lựa chọn dành cho bạn
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-10 md:mt-14">
            <Link to="/thiet-ke">
              <Button className="bg-primary hover:bg-primary/75 text-white border-[3px] md:border-4 border-white rounded-full px-5 py-3 md:px-8 md:py-6 text-sm md:text-lg font-black tracking-widest shadow-none">
                THIẾT KẾ NGAY
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

export default Page;
