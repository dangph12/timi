import { useEffect, useState, useRef } from "react";
import { useAtomValue } from "jotai";
import { orderAtom, orderPublicIdAtom } from "@/store/order";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import EstimatedDelivery from "@/components/estimated-delivery";

export default function PaymentPage() {
  const order = useAtomValue(orderAtom);
  const publicId = useAtomValue(orderPublicIdAtom);
  const customer = order?.customer;
  const item = order?.item;
  const navigate = useNavigate();

  const [isPaid, setIsPaid] = useState(false);
  const [sseStatus, setSseStatus] = useState("connecting");
  const paidRef = useRef(false);

  useEffect(() => {
    if (!order) navigate("/", { replace: true });
  }, [order, navigate]);

  useEffect(() => {
    if (!publicId) return;

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
          toast.success("Payment confirmed!");
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
  }, [publicId]);

  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);

  const totalAmount = order?.cart?.total ?? 0;
  const displayTotal = totalAmount.toLocaleString("vi-VN") + "đ";
  const displaySubtotal = (order?.cart?.subtotal ?? 0).toLocaleString("vi-VN") + "đ";

  const qrUrl = `https://vietqr.app/img?bank=TPBank&acc=00000120630&template=compact&amount=${totalAmount}&des=${encodeURIComponent(publicId || "")}&showinfo=true&holder=PHAN%20HAI%20DANG`;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText("4333998899");
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(publicId || "");
    setCopiedContent(true);
    setTimeout(() => setCopiedContent(false), 2000);
  };

  const handleFinish = () => {
    navigate("/finish");
  };

  const title = "Payment - Tỉ Mỉ";
  const description =
    "Bank transfer payment instructions for your Tỉ Mỉ order. Complete your purchase with TP bank transfer.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <div className="h-full">
        <div className="grid grid-cols-1 md:h-full md:grid-cols-[45%_55%]">
          <main className="px-8 py-4 md:px-12 md:py-8 lg:px-20 flex flex-col md:h-full md:overflow-y-auto">
            <div className="flex-1 flex flex-col justify-center min-h-0">
              <section className="space-y-2 mb-4">
                <h1 className="text-2xl md:text-3xl font-black">
                  Payment instructions
                </h1>
                <p className="text-sm md:text-base leading-snug">
                  Please transfer the payment to the following account and wait
                  for confirmation. Tỉ Mỉ workshop will call to confirm
                  your order as soon as possible.
                </p>
                <p className="text-xs md:text-sm italic font-medium pt-1">
                  I confirm that I am at least 18 years of age and that I have
                  read and agreed to the privacy policy.
                </p>
              </section>

              <div className="flex items-center gap-3 border rounded-xl p-2 md:p-3 mb-3">
                <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-primary bg-background shrink-0 ml-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Logo_TPBank.svg/960px-Logo_TPBank.png"
                  alt="TPBank Logo"
                  className="h-6 md:h-8 object-contain shrink-0"
                />
                <span className="text-xs md:text-sm font-bold leading-tight">
                  TP Bank{" "}
                  <span className="font-normal hidden xl:inline">
                    (Ngân hàng Thương mại Cổ phần Tiên Phong)
                  </span>
                </span>
              </div>

              <div className="rounded-xl border p-4 mb-4">
                <div className="grid grid-cols-[120px_1fr] md:grid-cols-[140px_1fr] gap-y-2 md:gap-y-3 text-sm">
                  <span className="font-bold">Bank</span>
                  <span>TP Bank</span>

                  <span className="font-bold">Account number</span>
                  <div className="flex items-center gap-2">
                    <span>4333998899</span>
                    <button
                      onClick={handleCopyAccount}
                      aria-label="Copy account number"
                      className="hover:opacity-70 transition-opacity flex items-center gap-1 text-primary"
                    >
                      {copiedAccount ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <span className="font-bold">Account holder</span>
                  <span>NGUYEN THUY CHI</span>

                  <span className="font-bold">Amount</span>
                  <span>{displayTotal}</span>

                  <span className="font-bold">Content</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold">{publicId || ""}</span>
                    <button
                      onClick={handleCopyContent}
                      aria-label="Copy content"
                      className="hover:opacity-70 transition-opacity flex items-center gap-1 text-primary"
                    >
                      {copiedContent ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <section className="flex items-center gap-6 mt-auto shrink-0">
                <img
                  src={qrUrl}
                  alt="VietQR Payment Code"
                  className="h-28 w-28 md:h-32 md:w-32 bg-white object-contain shrink-0 border rounded-lg p-1 shadow-sm"
                />
                <div className="flex flex-col items-center justify-center flex-1 space-y-1">
                  <div className="flex gap-2 mb-1 items-center">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Logo_TPBank.svg/960px-Logo_TPBank.png"
                      alt="TPBank Logo"
                      className="h-4 md:h-5 object-contain"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/77/VietQR_Logo.png"
                      alt="VietQR Logo"
                      className="h-4 md:h-5 object-contain"
                    />
                  </div>
                  <p className="font-bold text-base md:text-lg">
                    PHAN HAI DANG
                  </p>
                  <p className="text-lg md:text-xl">00000120630</p>
                  <p className="text-xs md:text-sm text-gray-500 font-medium">
                    TPBank
                  </p>
                </div>
              </section>
            </div>
          </main>

          <aside className="px-8 py-4 md:px-12 md:py-8 lg:px-20 flex flex-col md:h-full md:overflow-y-auto">
            <div className="flex flex-col h-full">
              <h2 className="text-2xl md:text-3xl font-black mb-4 shrink-0">
                Order details
              </h2>

              <div className="bg-background rounded-xl p-5 md:p-6 shadow-sm flex flex-col flex-1 min-h-0">
                <div className="grid grid-cols-[120px_1fr] gap-y-2 md:gap-y-3 text-sm shrink-0 mb-4">
                  <span className="font-bold">Receiver</span>
                  <span>{customer?.name}</span>

                  <span className="font-bold">Phone number</span>
                  <span>{customer?.phone}</span>

                  <span className="font-bold">Delivery address</span>
                  <span className="leading-relaxed text-xs md:text-sm">
                    {customer?.address}
                  </span>
                </div>

                <div className="py-2 shrink-0">
                  <EstimatedDelivery />
                </div>

                <div className="space-y-2 md:space-y-3 shrink-0 mt-4">
                  <h3 className="font-bold text-sm md:text-base border-b pb-1">
                    Order
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

                <div className="space-y-2 border-t pt-3 shrink-0 mt-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span>Subtotal</span>
                    <span>{displaySubtotal}</span>
                  </div>
                  <div className="flex justify-between text-xl md:text-2xl font-black pt-2 md:pt-4">
                    <span>Total</span>
                    <span>{displayTotal}</span>
                  </div>
                </div>

                {sseStatus === "error" && !isPaid && (
                  <p className="text-xs text-amber-600 text-center mt-2">
                    Connection issue — refresh page if you've paid
                  </p>
                )}

                {sseStatus === "connecting" && !isPaid && (
                  <p className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Waiting for payment confirmation...
                  </p>
                )}

                <Button
                  onClick={handleFinish}
                  disabled={!isPaid}
                  className="w-full h-12 md:h-14 mt-4 bg-linear-to-r from-[#eb129d] to-[#5543f5] hover:opacity-90 text-white text-base md:text-lg font-bold rounded-full border-0 shrink-0 disabled:opacity-40"
                >
                  {isPaid ? (
                    "Continue →"
                  ) : (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Waiting for payment...
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
