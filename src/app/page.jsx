import { Button } from "@/components/ui/button";
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
      <div className="flex h-full flex-col font-body">
        <main className="flex-1 relative bg-muted flex flex-col justify-end px-0 md:px-8 py-10 lg:py-16">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <picture className="absolute inset-0 w-full h-full">
              <source media="(max-width: 768px)" srcSet="/hero/mobile.png" />
              <source media="(min-width: 769px)" srcSet="/hero/desktop.png" />
              <img
                src="/hero/desktop.png"
                alt="Hero background"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </picture>
          </div>

          <div className="relative z-10 w-full flex flex-col items-start mb-12 sm:mb-16 md:mb-20 lg:mb-28 px-6 md:px-0 lg:px-8 xl:px-12">
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
                XEM NGAY
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}

export default Page;
