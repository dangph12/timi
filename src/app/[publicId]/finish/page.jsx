import { useAtomValue, useSetAtom } from "jotai";
import { orderAtom, orderPublicIdAtom } from "@/store/order";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getOrder } from "@/services/orders";
import { Loader2 } from "lucide-react";

export default function FinishPage() {
  const { publicId: urlPublicId } = useParams();
  const order = useAtomValue(orderAtom);
  const setOrder = useSetAtom(orderAtom);
  const setOrderPublicId = useSetAtom(orderPublicIdAtom);
  const publicId = urlPublicId;
  const customer = order?.customer;
  const item = order?.item;
  const navigate = useNavigate();

  const { data: fetchedOrder } = useQuery({
    queryKey: ["order", publicId],
    queryFn: () => getOrder(publicId),
    enabled: !!publicId && !order,
  });

  useEffect(() => {
    if (fetchedOrder) {
      setOrder(fetchedOrder);
      setOrderPublicId(publicId);
    }
  }, [fetchedOrder, publicId, setOrder, setOrderPublicId]);

  useEffect(() => {
    if (!order && !urlPublicId) navigate("/", { replace: true });
  }, [order, urlPublicId, navigate]);

  const displaySubtotal = (order?.cart?.subtotal ?? 0).toLocaleString("vi-VN") + "đ";
  const displayTotal = (order?.cart?.total ?? 0).toLocaleString("vi-VN") + "đ";

  const title = "Đã xác nhận đơn hàng - Tỉ Mỉ";
  const description =
    "Cảm ơn bạn đã đặt hàng tại shop Tỉ Mỉ.";

  if (!order && urlPublicId) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  if (!order) return null;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <div className="h-full bg-muted flex flex-col overflow-y-auto">
        <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 w-full min-h-0 py-8">
          <div className="w-full max-w-3xl mb-6 shrink-0 px-4 md:px-0">
            <h1 className="text-2xl md:text-4xl font-black tracking-tight mb-2">
              Cảm ơn bạn đã đặt hàng
            </h1>
            <p className="text-sm md:text-lg">
              <span className="text-primary font-bold">Shop Tỉ Mỉ</span> sẽ gọi xác nhận đơn hàng của bạn trong thời gian sớm nhất.
            </p>
          </div>

          <div className="bg-background rounded-xl p-6 md:p-8 shadow-sm w-full max-w-3xl flex flex-col min-h-0">
            <div className="grid grid-cols-[110px_1fr] md:grid-cols-[160px_1fr] gap-y-3 text-xs md:text-sm shrink-0">
              <span className="font-bold">Mã đơn hàng</span>
              <span>{order.publicId}</span>

              <span className="font-bold">Người nhận</span>
              <span>{customer?.name}</span>

              <span className="font-bold">Số điện thoại</span>
              <span>{customer?.phone}</span>

              <span className="font-bold">Địa chỉ giao hàng</span>
              <span className="leading-relaxed">{customer?.address}</span>
            </div>

            <div className="space-y-3 shrink-0 mt-6">
              <h3 className="font-bold text-sm md:text-base border-b border-black/10 pb-2">
                Đơn hàng
              </h3>
              {item && (
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.designName}
                        className="h-10 w-8 object-contain shrink-0"
                      />
                    )}
                    <div className="flex flex-col">
                      <span>{item.designName}</span>
                      <span className="text-muted-foreground">
                        {item.category}{item.category && item.size ? " · " : ""}{item.size}
                      </span>
                    </div>
                  </div>
                  <span className="whitespace-nowrap">
                    {item.price?.toLocaleString("vi-VN")}đ × {item.quantity}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2 border-t border-black/10 pt-3 shrink-0 mt-4">
              <div className="flex justify-between text-xs md:text-sm font-bold">
                <span>Tạm tính</span>
                <span>{displaySubtotal}</span>
              </div>
              <div className="flex justify-between text-xl md:text-3xl font-black pt-2 md:pt-3">
                <span>Tổng cộng</span>
                <span>{displayTotal}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
