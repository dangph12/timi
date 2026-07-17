import { useEffect, useState, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { orderAtom, orderPublicIdAtom, paymentMethodAtom } from "@/store/order";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { cancelOrder, confirmCodPayment, getOrder } from "@/services/orders";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function PaymentPage() {
  const { publicId: urlPublicId } = useParams();
  const order = useAtomValue(orderAtom);
  const atomPublicId = useAtomValue(orderPublicIdAtom);
  const setOrder = useSetAtom(orderAtom);
  const setOrderPublicId = useSetAtom(orderPublicIdAtom);
  const publicId = urlPublicId || atomPublicId;
  const customer = order?.customer;
  const item = order?.item;
  const isPaymentDone = order?.currentPaymentStatus === "PAID" || order?.currentStatus === "PROCESSING";
  const navigate = useNavigate();

  const [isPaid, setIsPaid] = useState(false);
  const [sseStatus, setSseStatus] = useState("connecting");
  const paidRef = useRef(false);
  const redirectedRef = useRef(false);
  const setPaymentMethod = useSetAtom(paymentMethodAtom);
  const [selectedMethod, setSelectedMethod] = useState("QR");
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

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
    if (fetchedOrder?.currentPaymentStatus === "PAID" && !paidRef.current) {
      paidRef.current = true;
      setIsPaid(true);
      setSseStatus("paid");
    }
  }, [fetchedOrder]);

  useEffect(() => {
    if (redirectedRef.current) return;
    if (!publicId) return;
    if (order?.currentPaymentStatus === "PAID" || order?.currentStatus === "PROCESSING") {
      redirectedRef.current = true;
      navigate(`/${publicId}/hoan-tat`, { replace: true });
    }
  }, [order, publicId, navigate]);

  useEffect(() => {
    if (!order && !urlPublicId) navigate("/", { replace: true });
  }, [order, urlPublicId, navigate]);

  useEffect(() => {
    if (!publicId || selectedMethod !== "QR" || isExpired || isPaymentDone) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
    const url = `${baseUrl}/sse/orders/${publicId}`;
    const eventSource = new EventSource(url);

    eventSource.addEventListener("payment-status", (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.status === "PAID" && !paidRef.current) {
          paidRef.current = true;
          setIsPaid(true);
          setSseStatus("paid");
          toast.success("Đã xác nhận thanh toán!");
        }
      } catch (e) {
        console.error("Failed to parse SSE event:", e);
      }
    });

    eventSource.onerror = () => {
      setSseStatus("error");
    };

    eventSource.onopen = () => {
      setSseStatus("connected");
    };

    return () => {
      eventSource.close();
    };
  }, [publicId, selectedMethod, isExpired, isPaymentDone]);

  useEffect(() => {
    if (!order?.expiresAt) return;
    const expiresAt = new Date(order.expiresAt).getTime();

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      setIsExpired(remaining <= 0);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [order?.expiresAt]);

  useEffect(() => {
    if (isExpired && !isPaymentDone) {
      toast.warning("Mã QR đã hết hạn. Vui lòng chuyển sang COD.");
    }
  }, [isExpired, isPaymentDone]);

  const totalAmount = order?.cart?.total ?? 0;
  const displayTotal = totalAmount.toLocaleString("vi-VN") + "đ";
  const displaySubtotal = (order?.cart?.subtotal ?? 0).toLocaleString("vi-VN") + "đ";

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const qrUrl = `https://vietqr.app/img?bank=TPBank&acc=00000120630&template=compact2&amount=${totalAmount}&des=${encodeURIComponent(publicId || "")}&showinfo=true&holder=PHAN%20HAI%20DANG`;

  const handleFinish = () => {
    navigate(`/${publicId}/hoan-tat`);
  };

  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    if (!publicId) { toast.error("Không tìm thấy đơn hàng"); return; }
    setIsCancelling(true);
    try {
      await cancelOrder(publicId);
      toast.success("Đã hủy đơn hàng");
      navigate(-1);
    } catch (error) {
      const { getErrorMessage } = await import('@/lib/api');
      toast.error(await getErrorMessage(error));
      setIsCancelling(false);
    }
  };

  const [isConfirmingCod, setIsConfirmingCod] = useState(false);

  const handleContinue = async () => {
    if (selectedMethod === "COD") {
      if (isPaymentDone) return;
      if (!publicId) { toast.error("Không tìm thấy đơn hàng"); return; }
      setIsConfirmingCod(true);
      try {
        await confirmCodPayment(publicId);
        toast.success("Xác nhận thanh toán thành công!");
        navigate(`/${publicId}/hoan-tat`);
      } catch (error) {
        const { getErrorMessage } = await import('@/lib/api');
        toast.error(await getErrorMessage(error));
        setIsConfirmingCod(false);
      }
    }
  };

  const title = "Thanh toán - Tỉ Mỉ";
  const description =
    "Thanh toán đơn hàng của bạn";

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
      <div className="h-full relative">
        <div className="grid grid-cols-1 md:h-full md:grid-cols-[45%_55%]">
          <main className="px-8 py-4 md:px-12 md:py-8 lg:px-20 flex flex-col md:h-full md:overflow-y-auto">
            <div className="flex-1 flex flex-col min-h-0">
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-3 text-base font-semibold text-foreground hover:bg-muted px-3 py-2 -ml-3 rounded-lg transition-colors mb-4"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Hủy đơn hàng
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Hủy đơn hàng?</DialogTitle>
                    <DialogDescription>
                      Bạn có chắc muốn hủy đơn hàng này?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Tiếp tục chỉnh sửa</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        variant="destructive"
                        onClick={handleCancel}
                        disabled={isCancelling}
                      >
                        {isCancelling ? "Đang hủy..." : "Có, hủy"}
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* Payment method selector */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMethod("QR");
                    setPaymentMethod("QR");
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg border text-sm font-bold transition-colors disabled:opacity-50 ${
                    selectedMethod === "QR"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                  disabled={isPaymentDone}
                >
                  Chuyển khoản (QR)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMethod("COD");
                    setPaymentMethod("COD");
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg border text-sm font-bold transition-colors disabled:opacity-50 ${
                    selectedMethod === "COD"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                  disabled={isPaymentDone}
                >
                  Thanh toán khi nhận hàng
                </button>
              </div>

              {selectedMethod === "QR" && (
                <>
                  <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-base mb-4 mt-4">
                    <span className="font-bold text-muted-foreground">Chủ tài khoản</span>
                    <span>PHAN HAI DANG</span>
                    <span className="font-bold text-muted-foreground">Số tài khoản</span>
                    <span>00000120630</span>
                    <span className="font-bold text-muted-foreground">Nội dung</span>
                    <span className="font-mono">{publicId}</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={qrUrl}
                      alt="VietQR Payment Code"
                       className={`h-44 w-44 md:h-56 md:w-56 bg-white object-contain border rounded-lg p-1 shadow-sm ${
                         isExpired || isPaymentDone ? "opacity-30" : ""
                       }`}
                    />

                    {timeLeft !== null && (
                      <div className={`text-center text-base font-bold ${
                        isExpired ? "text-destructive" : "text-foreground"
                      }`}>
                        {isExpired ? (
                          "Mã QR đã hết hạn. Vui lòng chuyển sang COD."
                        ) : (
                          <>
                            QR hết hạn sau {formatTime(timeLeft)}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {selectedMethod === "COD" && (
                <div className="mt-4">
                  <p className="font-bold text-base">Thanh toán khi nhận hàng</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Bạn đã chọn thanh toán khi nhận hàng. Thanh toán khi nhận được đơn hàng.
                  </p>
                </div>
              )}
            </div>
          </main>

          <aside className="px-8 py-4 md:px-12 md:py-8 lg:px-20 flex flex-col md:h-full md:overflow-hidden">
              <h2 className="text-2xl md:text-3xl font-black mb-4 shrink-0">
                Chi tiết đơn hàng
              </h2>

              <div className="flex-1 md:min-h-0 md:overflow-y-auto">
                <div className="grid grid-cols-[120px_1fr] gap-y-2 md:gap-y-3 text-sm shrink-0 mb-4">
                  <span className="font-bold">Người nhận</span>
                  <span>{customer?.name}</span>

                  <span className="font-bold">Số điện thoại</span>
                  <span>{customer?.phone}</span>

                  <span className="font-bold">Địa chỉ giao hàng</span>
                  <span className="leading-relaxed text-xs md:text-sm">
                    {customer?.address}
                  </span>
                </div>

                <div className="space-y-2 md:space-y-3 shrink-0 mt-4">
                  <h3 className="font-bold text-sm md:text-base border-b pb-1">
                    Đơn hàng
                  </h3>
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <div className="flex items-center gap-3">
                      {item?.image && (
                        <img
                          src={item.image}
                          alt={item.designName}
                          className="h-10 w-8 object-contain shrink-0"
                        />
                      )}
                      <div className="flex flex-col">
                        <span>{item?.designName}</span>
                        <span className="text-muted-foreground">
                          {item?.category}{item?.category && item?.size ? " · " : ""}{item?.size}
                        </span>
                      </div>
                    </div>
                    <span className="whitespace-nowrap">
                      {item?.price?.toLocaleString("vi-VN")}đ × {item?.quantity}
                    </span>
                  </div>
                </div>

                {sseStatus === "error" && !isPaid && (
                  <p className="text-xs text-warning text-center mt-2">
                    Lỗi kết nối — hãy tải lại trang nếu bạn đã thanh toán
                  </p>
                )}
            </div>

            <div className="sticky bottom-0 bg-background md:static shrink-0 space-y-4 mt-6 pt-4 border-t border-border/50">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>Tạm tính</span>
                  <span>{displaySubtotal}</span>
                </div>
                <div className="flex justify-between text-2xl md:text-3xl font-black">
                  <span>Tổng cộng</span>
                  <span>{displayTotal}</span>
                </div>
              </div>

              {selectedMethod === "QR" ? (
                <PayButton
                  onClick={handleFinish}
                  disabled={!isPaid && !isPaymentDone}
                  loading={!isPaymentDone && !isPaid}
                   label={isPaymentDone ? "Đã thanh toán" : "Xong"}
                  loadingLabel="Đang chờ thanh toán..."
                />
              ) : (
                <PayButton
                  onClick={handleContinue}
                  disabled={isConfirmingCod || isPaymentDone}
                  loading={isConfirmingCod}
                  label={isPaymentDone ? "Đã xác nhận" : "Tiếp tục"}
                  loadingLabel="Đang xác nhận..."
                />
              )}
            </div>
          </aside>
        </div>

      </div>
    </>
  );
}

function PayButton({ onClick, disabled, loading, label, loadingLabel }) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-14 rounded-full bg-btn-muted text-white text-lg font-bold hover:bg-btn-muted/80 mt-2"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          {loadingLabel}
        </span>
      ) : (
        label
      )}
    </Button>
  );
}
