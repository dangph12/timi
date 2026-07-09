import { useSetAtom, useAtomValue } from "jotai";
import { orderIdAtom } from "@/store/order";
import { capturedCharacterAtom, designIdAtom, designNameAtom } from "@/store/design";
import { selectedSkuAtom, skuSelectionsAtom } from "@/store/sku";
import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/services/orders";
import { yupResolver } from "@hookform/resolvers/yup";
import { checkoutFormSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Header from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutPage() {
  const setOrderId = useSetAtom(orderIdAtom);
  const navigate = useNavigate();
  const capturedCharacter = useAtomValue(capturedCharacterAtom);
  const designId = useAtomValue(designIdAtom);
  const designName = useAtomValue(designNameAtom);
  const selectedSku = useAtomValue(selectedSkuAtom);
  const skuSelections = useAtomValue(skuSelectionsAtom);

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

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      setOrderId(data.id);
      navigate("/payment");
    },
    onError: (error) => {
      console.error("Error creating order:", error);
    },
  });

  const onSubmit = (data) => {
    orderMutation.mutate({
      email: data.email,
      phone: data.phone,
      address: data.address,
      items: [
        {
          skuId: selectedSku?.id,
          characterDesignId: designId,
          quantity: quantity,
        },
      ],
    });
  };

  const title = "Checkout - Tỉ Mỉ";
  const description =
    "Complete your order for the Tỉ Mỉ DIY character box. Provide your contact and delivery information.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <div className="flex flex-col h-screen">
        <Header />
        <div className="grid grid-cols-1 flex-1 min-h-0 md:grid-cols-2">
          <form
            id="checkout-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-8 py-4 md:px-20 md:py-6 flex flex-col md:h-full md:overflow-y-auto"
          >
            <div className="flex-1 flex flex-col min-h-0">
              <section className="space-y-2">
                <h1 className="text-3xl font-black">Contact</h1>
                <FieldGroup>
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel className="text-base">Full name</FieldLabel>
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
                          Phone number
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
                <div className="pt-1 text-sm italic font-medium leading-tight cursor-pointer no-wrap">
                  I confirm that I am at least 18 years of age and that I have
                  read and agreed to the privacy policy.
                </div>
              </section>

              <section className="mt-4 space-y-2">
                <h2 className="text-3xl font-black">Delivery</h2>
                <FieldGroup>
                  <Controller
                    name="address"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel className="text-base">Address</FieldLabel>
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
                          Delivery notes
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
                <table className="w-full text-left border-collapse min-w-[350px]">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="pb-4 font-semibold text-muted-foreground whitespace-nowrap">Tên sản phẩm</th>
                      <th className="pb-4 text-center font-semibold text-muted-foreground whitespace-nowrap">Số lượng</th>
                      <th className="pb-4 text-right font-semibold text-muted-foreground whitespace-nowrap">Giá tiền</th>
                    </tr>
                  </thead>
                  <tbody>
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
                  </tbody>
                </table>
              </div>
            </div>

            <div className="shrink-0 space-y-4 mt-6 pt-4 border-t border-border/50">
              <div className="space-y-2">
                <div className="flex justify-between text-2xl md:text-3xl font-black">
                  <span>Total</span>
                  <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <Button
                type="submit"
                form="checkout-form"
                disabled={orderMutation.isPending}
                className="w-full h-14 rounded-full bg-btn-muted text-white text-lg font-bold hover:bg-btn-muted/80 mt-2"
              >
                {orderMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "PAY NOW"
                )}
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
