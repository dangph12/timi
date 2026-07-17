import { useState, useEffect } from "react";
import { useSetAtom, useAtomValue } from "jotai";
import { orderIdAtom, orderAtom, orderPublicIdAtom } from "@/store/order";
import { capturedCharacterAtom, designIdAtom, designNameAtom } from "@/store/design";
import { selectedSkuAtom, skuSelectionsAtom } from "@/store/sku";
import { userAtom } from "@/store/auth";
import { useNavigate, useLocation } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createOrder } from "@/services/orders";
import { useCart } from "@/hooks/useCart";
import { checkoutCart } from "@/services/cart";
import { yupResolver } from "@hookform/resolvers/yup";
import { checkoutFormSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown, ArrowLeft } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import { toast } from "sonner";

export default function CheckoutPage() {
  const setOrderId = useSetAtom(orderIdAtom);
  const setOrder = useSetAtom(orderAtom);
  const setOrderPublicId = useSetAtom(orderPublicIdAtom);
  const navigate = useNavigate();
  const capturedCharacter = useAtomValue(capturedCharacterAtom);
  const designId = useAtomValue(designIdAtom);
  const designName = useAtomValue(designNameAtom);
  const selectedSku = useAtomValue(selectedSkuAtom);
  const skuSelections = useAtomValue(skuSelectionsAtom);
  const user = useAtomValue(userAtom);
  const location = useLocation();
  const fromCart = location.state?.fromCart;

  // useEffect(() => {
  //   if (!capturedCharacter) navigate("/thiet-ke", { replace: true });
  // }, [capturedCharacter, navigate]);

  const price = selectedSku?.price ?? 0;
  const quantity = skuSelections?.quantity ?? 1;
  const subtotal = price * quantity;

  const form = useForm({
    resolver: yupResolver(checkoutFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      note: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue('name', user.fullName || '');
      form.setValue('phone', user.phone || '');
      form.setValue('email', user.email || '');
    }
  }, [user]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  const provincesQuery = useQuery({
    queryKey: ["provinces"],
    queryFn: () =>
      fetch("https://provinces.open-api.vn/api/v2/p/").then((r) => r.json()),
    staleTime: Infinity,
  });

  const wardsQuery = useQuery({
    queryKey: ["wards", selectedProvince?.code],
    queryFn: () =>
      fetch(
        `https://provinces.open-api.vn/api/v2/p/${selectedProvince.code}?depth=2`
      ).then((r) => r.json()),
    enabled: !!selectedProvince,
    staleTime: Infinity,
  });

  const cartQuery = useCart();

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      setOrderId(data.id);
      setOrderPublicId(data.publicId);
      setOrder((prev) => ({
        ...prev,
        id: data.id,
        publicId: data.publicId,
        expiresAt: data.expiresAt,
      }));
      toast.success('Đã tạo đơn hàng thành công!');
      navigate(`/${data.publicId}/thanh-toan`);
    },
    onError: async (error) => {
      const { getErrorMessage } = await import('@/lib/api');
      toast.error(await getErrorMessage(error));
    },
  });

  const cartCheckoutMutation = useMutation({
    mutationFn: checkoutCart,
    onSuccess: (data) => {
      setOrderId(data.id);
      setOrderPublicId(data.publicId);
      setOrder((prev) => ({
        ...prev,
        id: data.id,
        publicId: data.publicId,
        expiresAt: data.expiresAt,
      }));
      toast.success('Đã tạo đơn hàng thành công!');
      navigate(`/${data.publicId}/thanh-toan`);
    },
    onError: async (error) => {
      const { getErrorMessage } = await import('@/lib/api');
      toast.error(await getErrorMessage(error));
    },
  });

  const onSubmit = (data) => {
    const fullAddress = [data.address, selectedWard?.name, selectedProvince?.name]
      .filter(Boolean)
      .join(", ");

    if (fromCart) {
      setOrder({
        customer: { name: data.name, phone: data.phone, email: data.email, address: fullAddress },
        cart: { subtotal: 0, total: 0 },
        expiresAt: null,
      });

      cartCheckoutMutation.mutate({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: fullAddress,
        accountId: user?.accountId,
        note: data.note,
      });
    } else {
      setOrder({
        customer: { name: data.name, phone: data.phone, email: data.email, address: fullAddress },
        item: { designName, image: capturedCharacter, category: selectedSku?.category?.name, size: selectedSku?.size?.name, price, quantity },
        cart: { subtotal, total: subtotal },
        expiresAt: null,
      });

      orderMutation.mutate({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: fullAddress,
        accountId: user?.accountId,
        items: [
          {
            skuId: selectedSku?.id,
            characterDesignId: designId,
            quantity: quantity,
          },
        ],
      });
    }
  };

  const title = "Thanh toán - Tỉ Mỉ";
  const description =
    "Hoàn tất đơn hàng Tỉ Mỉ của bạn. Vui lòng cung cấp thông tin liên hệ và giao hàng.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <div className="flex flex-col h-full relative">
        <div className="grid grid-cols-1 flex-1 min-h-0 md:grid-cols-2">
          <form
            id="checkout-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-8 py-4 md:px-20 md:py-6 flex flex-col md:h-full md:overflow-y-auto"
          >
            <div className="flex-1 flex flex-col min-h-0">
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-3 text-base font-semibold text-foreground hover:bg-muted px-3 py-2 -ml-3 rounded-lg transition-colors mb-2"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Quay lại
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Hủy đơn hàng?</DialogTitle>
                    <DialogDescription>
                      Bạn có chắc muốn hủy? Đơn hàng sẽ không được tạo.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Không, quay trở lại</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        variant="destructive"
                        onClick={() => navigate(-1)}
                      >
                        Có, hủy đơn hàng
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <section className="space-y-2">
                <h1 className="text-3xl font-black">Liên hệ</h1>
                <FieldGroup>
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel className="text-base">Họ và tên</FieldLabel>
                        <Input className="h-11 rounded-lg" {...field} />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="phone"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel className="text-base">
                          Số điện thoại
                        </FieldLabel>
                        <Input className="h-11 rounded-lg" {...field} />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel className="text-base">Email</FieldLabel>
                        <Input className="h-11 rounded-lg" {...field} />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </section>

              <section className="mt-4 space-y-2">
                <h2 className="text-3xl font-black">Giao hàng</h2>
                <FieldGroup>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel className="text-base">Tỉnh / Thành phố</FieldLabel>
                      <div className="relative">
                        <select
                          value={selectedProvince?.code ?? ""}
                          onChange={(e) => {
                            const code = Number(e.target.value);
                            const province = code
                              ? provincesQuery.data?.find((p) => p.code === code)
                              : null;
                            setSelectedProvince(province);
                            setSelectedWard(null);
                          }}
                          className="h-11 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 appearance-none"
                        >
                          <option value="">Chọn tỉnh / thành phố</option>
                          {provincesQuery.data?.map((p) => (
                            <option key={p.code} value={p.code}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
                      </div>
                    </Field>

                    <Field>
                      <FieldLabel className="text-base">Phường / Xã</FieldLabel>
                      <div className="relative">
                        <select
                          value={selectedWard?.code ?? ""}
                          onChange={(e) => {
                            const code = Number(e.target.value);
                            const ward = code
                              ? wardsQuery.data?.wards?.find((w) => w.code === code)
                              : null;
                            setSelectedWard(ward);
                          }}
                          disabled={!selectedProvince || wardsQuery.isLoading}
                          className="h-11 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 appearance-none"
                        >
                          <option value="">
                            {selectedProvince ? "Chọn phường / xã" : "Chọn tỉnh / thành phố trước"}
                          </option>
                          {wardsQuery.data?.wards?.map((w) => (
                            <option key={w.code} value={w.code}>
                              {w.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
                      </div>
                    </Field>
                  </div>

                  <Controller
                    name="address"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel className="text-base">Số nhà, ngõ</FieldLabel>
                        <Input className="h-11 rounded-lg" {...field} />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="note"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel className="text-base">
                          Ghi chú giao hàng
                        </FieldLabel>
                        <Input className="h-11 rounded-lg" {...field} />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </section>
            </div>
          </form>

          <aside className="bg-aside px-8 py-4 md:px-20 md:py-6 flex flex-col md:h-full md:overflow-hidden">
            <div className="flex-1 md:min-h-0 md:overflow-y-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-87.5">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="pb-4 font-semibold text-muted-foreground whitespace-nowrap">Tên sản phẩm</th>
                      <th className="pb-4 text-center font-semibold text-muted-foreground whitespace-nowrap">Số lượng</th>
                      <th className="pb-4 text-right font-semibold text-muted-foreground whitespace-nowrap">Giá tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fromCart
                      ? cartQuery.data?.content?.map((item) => {
                          const unitPrice =
                            item.priceAtPurchase ?? item.sku?.price ?? 0;
                          return (
                            <tr key={item.id}>
                              <td className="py-4 pr-4">
                                <div className="flex items-center gap-4">
                                  <img
                                    src={item.characterDesign?.imageUrl}
                                    alt={item.characterDesign?.name}
                                    className="h-16 w-12 object-contain bg-foreground shrink-0"
                                  />
                                  <div className="flex flex-col">
                                    <span className="text-sm md:text-base font-bold text-foreground">
                                      {item.characterDesign?.name}
                                    </span>
                                    <span className="text-xs md:text-sm text-muted-foreground mt-0.5">
                                      {item.sku?.category?.name}
                                      {item.sku?.category?.name && item.sku?.size?.name
                                        ? ' · '
                                        : ''}
                                      {item.sku?.size?.name}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 text-center align-middle">
                                <span className="text-sm text-foreground">
                                  {item.quantity}
                                </span>
                              </td>
                              <td className="py-4 text-right align-middle">
                                <span className="text-sm text-foreground whitespace-nowrap">
                                  {unitPrice.toLocaleString('vi-VN')}đ
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      : (
                      <tr>
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-4">
                            {capturedCharacter ? (
                              <img
                                src={capturedCharacter}
                                alt={designName}
                                className="h-16 w-12 object-contain bg-foreground shrink-0"
                              />
                            ) : (
                              <Skeleton className="h-16 w-12 shrink-0 rounded-none bg-foreground" />
                            )}
                            <div className="flex flex-col">
                              <span className="text-sm md:text-base font-bold text-foreground">
                                {designName}
                              </span>
                              <span className="text-xs md:text-sm text-muted-foreground mt-0.5">
                                {selectedSku?.category?.name}{" "}
                                {selectedSku?.category?.name && selectedSku?.size?.name ? "·" : ""}{" "}
                                {selectedSku?.size?.name}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-center align-middle">
                          <span className="text-sm text-foreground">{quantity}</span>
                        </td>
                        <td className="py-4 text-right align-middle">
                          <span className="text-sm text-foreground whitespace-nowrap">
                            {price.toLocaleString('vi-VN')}đ
                          </span>
                        </td>
                      </tr>
                      )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="shrink-0 space-y-4 mt-6 pt-4 border-t border-border/50">
              <div className="space-y-2">
                <div className="flex justify-between text-2xl md:text-3xl font-black">
                  <span>Tổng cộng</span>
                  <span>
                    {fromCart
                      ? (cartQuery.data?.content?.reduce(
                          (sum, item) =>
                            sum +
                            (item.priceAtPurchase ?? item.sku?.price ?? 0) *
                              item.quantity,
                          0
                        ) ?? 0).toLocaleString('vi-VN')
                      : subtotal.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                form="checkout-form"
                disabled={orderMutation.isPending || cartCheckoutMutation.isPending}
                className="w-full h-14 rounded-full bg-btn-muted text-white text-lg font-bold hover:bg-btn-muted/80 mt-2"
              >
                {orderMutation.isPending || cartCheckoutMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Đang xử lý...
                  </span>
                ) : (
                  "THANH TOÁN NGAY"
                )}
              </Button>
            </div>
          </aside>
        </div>

      </div>
    </>
  );
}
