import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export function Page() {
  const title = "Tỉ Mỉ - Làm bằng tay, định hình bởi bạn";
  const description =
    "Xưởng thiết kế nhân vật DIY. Tự tay thiết kế nhân vật độc đáo của riêng bạn cùng Tỉ Mỉ.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <div className="flex h-full flex-col font-body">
        {/* Hero Section */}
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

          {/* Content */}
          <div className="relative z-10 w-full flex flex-col items-start mb-12 sm:mb-16 md:mb-20 lg:mb-28 px-6 md:px-0 lg:px-8 xl:px-12">
            <h1
              className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[1.1] font-black text-primary/25 tracking-wide"
              style={{
                WebkitTextStroke: "0.12em white",
                paintOrder: "stroke fill",
              }}
            >
              Làm bằng tay, định hình bởi bạn
            </h1>
            <Link to="/design">
              <Button className="bg-primary/25 hover:bg-primary/15 text-white border-[3px] md:border-4 border-white rounded-full px-5 py-3 md:px-8 md:py-6 text-sm md:text-lg font-black tracking-widest shadow-none mt-2 md:mt-4 lg:mt-6">
                XEM NGAY
              </Button>
            </Link>
          </div>

          {/* Pagination Indicators */}
          <div className="absolute bottom-6 md:bottom-10 right-6 md:right-10 lg:right-16 z-10 flex gap-2 md:gap-3">
            {[1, 2, 3, 4, 5, 6].map((item, i) => (
              <button
                key={i}
                className={`h-2 rounded-full transition-all ${i === 1 ? "w-10 bg-white" : "w-10 bg-white/50 hover:bg-white/70"}`}
                aria-label={`Chuyển đến slide ${i + 1}`}
              />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default Page;
