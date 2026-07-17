import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAtomValue, useSetAtom } from "jotai";
import {
  designSelectionsAtom,
  partOptionsAtom,
  designIdAtom,
  capturedCharacterAtom,
  designNameAtom,
} from "@/store/design";
import { useMutation } from "@tanstack/react-query";
import { createDesign } from "@/services/designs";
import { uploadCharacterDesign } from "@/services/cloudinary";
import { selectedSkuAtom, skuSelectionsAtom } from "@/store/sku";
import { addCartItem } from "@/services/cart";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import PartSelector from "./_components/PartSelector";
import SkuSelector from "./_components/SkuSelector";
import DesignCanvas from "./_components/DesignCanvas";
import { useParts } from "@/app/thiet-ke/_hooks/usePartsData";
import { Skeleton } from "@/components/ui/skeleton";
import Loading from "@/components/loading";
import { toast } from "sonner";

export default function DesignPage() {
  const [activeStep, setActiveStep] = useState(1);
  const canvasRef = useRef(null);
  const designCanvasRef = useRef(null);
  const sectionRefs = useRef({});
  const [size, setSize] = useState({ width: 0, height: 0 });
  const navigate = useNavigate();
  const designSelections = useAtomValue(designSelectionsAtom);
  const partOptions = useAtomValue(partOptionsAtom);
  const setDesignId = useSetAtom(designIdAtom);
  const setCapturedCharacter = useSetAtom(capturedCharacterAtom);
  const designName = useAtomValue(designNameAtom);
  const selectedSku = useAtomValue(selectedSkuAtom);
  const skuSelections = useAtomValue(skuSelectionsAtom);

  const {
    data: parts,
    isLoading: partsLoading,
    error: partsError,
  } = useParts();
  const sections = parts || [];
  const skuStep = sections.length + 1;

  const designMutation = useMutation({
    mutationFn: async ({ name, dataUrl, partSelections }) => {
      const imageUrl = dataUrl ? await uploadCharacterDesign(dataUrl) : "";
      setCapturedCharacter(imageUrl);
      return createDesign({ name, imageUrl, partSelections });
    },
    onSuccess: (data) => {
      setDesignId(data.id);
      navigate("/tao-don-hang");
    },
    onError: async (error) => {
      const { getErrorMessage } = await import('@/lib/api');
      toast.error(await getErrorMessage(error));
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const partSelections = [];
      Object.entries(designSelections.selections).forEach(([, val]) => {
        const ids = Array.isArray(val) ? val : [val];
        ids.forEach((id) => {
          if (id != null) partSelections.push({ partOptionId: id });
        });
      });
      const dataUrl = designCanvasRef.current?.getCharacterDataUrl() ?? "";
      const imageUrl = dataUrl ? await uploadCharacterDesign(dataUrl) : "";
      setCapturedCharacter(imageUrl);
      const design = await createDesign({ name: designName, imageUrl, partSelections });
      setDesignId(design.id);
      await addCartItem({
        skuId: selectedSku?.id,
        characterDesignId: design.id,
        quantity: skuSelections?.quantity ?? 1,
      });
    },
    onSuccess: () => {
      toast.success("Đã thêm vào giỏ hàng");
    },
    onError: async (error) => {
      const { getErrorMessage } = await import('@/lib/api');
      toast.error(await getErrorMessage(error));
    },
  });

  useEffect(() => {
    const activeRef = sectionRefs.current[activeStep];
    if (activeRef) {
      const timer = setTimeout(() => {
        activeRef.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeStep]);

  useEffect(() => {
    if (partsLoading) return;
    const el = canvasRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      setSize((prev) => {
        if (prev.width === w && prev.height === h) return prev;
        return { width: w, height: h };
      });
    };
    const observer = new ResizeObserver(() => measure());
    observer.observe(el);
    measure();
    return () => observer.disconnect();
  }, [partsLoading]);

  const handleContinue = useCallback(() => {
    if (activeStep === skuStep) {
      const partSelections = [];
      Object.entries(designSelections.selections).forEach(([, val]) => {
        const ids = Array.isArray(val) ? val : [val];
        ids.forEach((id) => {
          if (id != null) partSelections.push({ partOptionId: id });
        });
      });

      const dataUrl = designCanvasRef.current?.getCharacterDataUrl() ?? "";

      designMutation.mutate({
        name: designName,
        dataUrl,
        partSelections,
      });
    } else if (activeStep === sections.length) {
      setActiveStep(skuStep);
    } else {
      setActiveStep((prev) => Math.min(prev + 1, sections.length));
    }
  }, [
    activeStep,
    sections.length,
    skuStep,
    designSelections,
    designName,
    designMutation,
  ]);

  const title = "Thiết kế nhân vật - Tỉ Mỉ";
  const description =
    "Tùy chỉnh hộp DIY của bạn với kiểu tóc, mắt, quần áo và phụ kiện độc đáo. Tạo thiết kế nhân vật hoàn hảo.";

  if (partsLoading) {
    return (
      <>
        <title>{title}</title>
        <div className="flex h-full flex-col font-body">
          <div className="flex-1 p-8 flex items-center justify-center">
            <Skeleton className="w-64 h-8 rounded" />
          </div>
        </div>
      </>
    );
  }

  if (partsError) {
    return (
      <>
        <title>{title}</title>
        <div className="flex h-full flex-col font-body">
          <div className="flex-1 p-8 flex items-center justify-center text-destructive text-sm">
            Không thể tải tùy chọn thiết kế. Vui lòng thử lại sau.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <div className="flex h-full flex-col font-body">
        <div className="flex flex-col md:flex-row flex-1 w-full min-h-0 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-full md:w-1/3 p-4 pb-28 md:pb-4 overflow-y-auto border-t md:border-t-0 md:border-r border-border order-2 md:order-1 flex-1">
            {sections.map((part, idx) => {
              const stepNum = idx + 1;
              const isCompleted = activeStep > stepNum;
              const isActive = activeStep === stepNum;

              return (
                <div
                  key={part.id}
                  ref={(el) => {
                    if (el) sectionRefs.current[stepNum] = el;
                  }}
                >
                  <Collapsible
                    open={isActive}
                    onOpenChange={(isOpen) => {
                      if (isOpen && isCompleted) setActiveStep(stepNum);
                    }}
                    className="mb-2 rounded-md"
                  >
                    <CollapsibleTrigger
                      className={`w-full p-4 font-bold text-left flex items-center gap-2 ${
                        isCompleted || isActive
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                      disabled={stepNum > activeStep}
                    >
                      {isActive || isCompleted ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-extrabold shrink-0">
                          {stepNum}
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-muted-foreground/30 text-muted-foreground/70 text-sm font-bold shrink-0">
                          {stepNum}
                        </span>
                      )}
                      <span className="tracking-wide uppercase text-sm font-black">
                        Chọn {part.name}
                      </span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 bg-muted/20 border-t border-border/40">
                      {isActive && (
                        <PartSelector part={part} onContinue={handleContinue} />
                      )}
                      {isCompleted && !isActive && (
                        <p className="text-xs text-muted-foreground">
                          Hoàn tất
                        </p>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              );
            })}

            {/* SKU Step */}
            <div
              ref={(el) => {
                if (el) sectionRefs.current[skuStep] = el;
              }}
            >
              <Collapsible
                open={activeStep === skuStep}
                onOpenChange={(isOpen) => {
                  if (isOpen && activeStep > skuStep) setActiveStep(skuStep);
                }}
                className="mb-2 rounded-md"
              >
                <CollapsibleTrigger
                  className={`w-full p-4 font-bold text-left flex items-center gap-2 ${
                    activeStep >= skuStep
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  disabled={skuStep > activeStep}
                >
                  {activeStep >= skuStep ? (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-sm font-extrabold shrink-0">
                      {skuStep}
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-muted-foreground/30 text-muted-foreground/70 text-sm font-bold shrink-0">
                      {skuStep}
                    </span>
                  )}
                  <span className="tracking-wide uppercase text-sm font-black">
                    SẢN PHẨM
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 bg-muted/20 border-t border-border/40">
                  {activeStep === skuStep && (
                    <SkuSelector
                      onContinue={handleContinue}
                      isPending={designMutation.isPending}
                      onAddToCart={() => addToCartMutation.mutate()}
                      isAddingToCart={addToCartMutation.isPending}
                    />
                  )}
                  {activeStep > skuStep && (
                    <p className="text-xs text-muted-foreground">Hoàn tất</p>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>

          {/* Right Canvas */}
          <div
            ref={canvasRef}
            className="w-full h-[40vh] md:h-full md:w-2/3 bg-muted order-1 md:order-2 shrink-0 md:shrink"
          >
            {size.width > 0 && (
              <DesignCanvas
                ref={designCanvasRef}
                width={size.width}
                height={size.height}
                selections={designSelections}
                partOptions={partOptions}
              />
            )}
          </div>
        </div>
      </div>

      {designMutation.isPending && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center">
          <Loading className="h-12 w-12 text-primary" />
          <p className="mt-6 text-sm font-bold tracking-wide text-primary">
            Đang tạo nhân vật...
          </p>
        </div>
      )}
    </>
  );
}
