import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAtomValue, useSetAtom } from "jotai";
import {
  designSelectionsAtom,
  capturedCharacterAtom,
  designIdAtom,
} from "@/store/design";
import { useMutation } from "@tanstack/react-query";
import { createDesign } from "@/services/designs";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import Header from "@/components/header";
import PartSelector from "./_components/PartSelector";
import DesignCanvas from "./_components/DesignCanvas";
import { useParts } from "@/app/design/_hooks/usePartsData";
import { Skeleton } from "@/components/ui/skeleton";

export default function DesignPage() {
  const [activeStep, setActiveStep] = useState(1);
  const canvasRef = useRef(null);
  const designCanvasRef = useRef(null);
  const sectionRefs = useRef({});
  const [size, setSize] = useState({ width: 0, height: 0 });
  const navigate = useNavigate();
  const setCapturedCharacter = useSetAtom(capturedCharacterAtom);
  const designSelections = useAtomValue(designSelectionsAtom);
  const setDesignId = useSetAtom(designIdAtom);

  const { data: parts, isLoading: partsLoading } = useParts();
  const sections = parts || [];
  const stepIndex = activeStep - 1;

  const designMutation = useMutation({
    mutationFn: createDesign,
    onSuccess: (data) => {
      setDesignId(data.id);
      navigate("/checkout");
    },
    onError: (error) => {
      console.error("Error creating design:", error);
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
    const handleResize = () => {
      if (canvasRef.current) {
        setSize({
          width: canvasRef.current.offsetWidth,
          height: canvasRef.current.offsetHeight,
        });
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleContinue = useCallback(() => {
    if (activeStep === sections.length) {
      const partSelections = [];
      Object.entries(designSelections.selections).forEach(([partId, val]) => {
        const ids = Array.isArray(val) ? val : [val];
        ids.forEach(id => {
          if (id != null) partSelections.push({ partOptionId: id });
        });
      });

      designMutation.mutate({
        name: "My Character",
        imageUrl: "data:image/png",
        partSelections,
      });
    } else {
      setActiveStep((prev) => Math.min(prev + 1, sections.length));
    }
  }, [activeStep, sections.length, designSelections, designMutation]);

  const title = "Design Your Character - Tỉ Mỉ";
  const description =
    "Customize your DIY box with unique hair, eyes, clothes, and accessories. Create your perfect character design.";

  if (partsLoading) {
    return (
      <>
        <title>{title}</title>
        <div className="flex h-screen flex-col font-sans overflow-hidden">
          <Header />
          <div className="flex-1 p-8 flex items-center justify-center">
            <Skeleton className="w-64 h-8 rounded" />
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
      <div className="flex h-screen flex-col font-sans overflow-hidden">
        <Header />
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
                          ? "text-[#0000D0]"
                          : "text-muted-foreground"
                      }`}
                      disabled={stepNum > activeStep}
                    >
                      {isActive || isCompleted ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#0000D0] text-white text-sm font-extrabold shrink-0">
                          {stepNum}
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-muted-foreground/30 text-muted-foreground/70 text-sm font-bold shrink-0">
                          {stepNum}
                        </span>
                      )}
                      <span className="tracking-wide uppercase text-sm font-black">
                        {part.name}
                      </span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 bg-muted/20 border-t border-border/40">
                      <div style={{ display: isActive ? "" : "none" }}>
                        <PartSelector
                          part={part}
                          onContinue={handleContinue}
                        />
                      </div>
                      {isCompleted && (
                        <p className="text-xs text-muted-foreground">
                          Completed
                        </p>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              );
            })}
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
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
