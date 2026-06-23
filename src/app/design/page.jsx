import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSetAtom } from 'jotai';
import { capturedCharacterAtom } from '@/store/design';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from '@/components/ui/collapsible';
import Header from '@/components/header';
import VersionSelector from './_components/VersionSelector';
import HairSelector from './_components/HairSelector';
import EyesSelector from './_components/EyesSelector';
import LipSelector from './_components/LipSelector';
import ClothesSelector from './_components/ClothesSelector';
import AccessorySelector from './_components/AccessorySelector';
import ItemSelector from './_components/ItemSelector';
import PackagingSelector from './_components/PackagingSelector';
import DesignCanvas from './_components/DesignCanvas';

const sections = [
  { step: 1, title: 'SELECT VERSION', Component: VersionSelector },
  { step: 2, title: 'SELECT HAIR', Component: HairSelector },
  { step: 3, title: 'SELECT EYES', Component: EyesSelector },
  { step: 4, title: 'SELECT LIP', Component: LipSelector },
  { step: 5, title: 'SELECT CLOTHES', Component: ClothesSelector },
  { step: 6, title: 'SELECT ACCESSORY', Component: AccessorySelector },
  { step: 7, title: 'SELECT ITEM', Component: ItemSelector },
  { step: 8, title: 'SELECT PACKAGING', Component: PackagingSelector }
];

export default function DesignPage() {
  const [activeStep, setActiveStep] = useState(1);
  const canvasRef = useRef(null);
  const designCanvasRef = useRef(null);
  const sectionRefs = useRef({});
  const [size, setSize] = useState({ width: 0, height: 0 });
  const navigate = useNavigate();
  const setCapturedCharacter = useSetAtom(capturedCharacterAtom);

  useEffect(() => {
    const activeRef = sectionRefs.current[activeStep];
    if (activeRef) {
      const timer = setTimeout(() => {
        activeRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeStep]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        setSize({
          width: canvasRef.current.offsetWidth,
          height: canvasRef.current.offsetHeight
        });
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function handleContinue() {
    if (activeStep === sections.length) {
      if (designCanvasRef.current) {
        const dataUrl = designCanvasRef.current.getCharacterDataUrl();
        setCapturedCharacter(dataUrl);
      }
      navigate('/checkout');
    } else {
      setActiveStep(prev => Math.min(prev + 1, sections.length));
    }
  }

  const title = 'Design Your Character - Tỉ Mỉ';
  const description = 'Customize your DIY box with unique hair, eyes, clothes, and accessories. Create your perfect character design.';

  return (
    <>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:type' content='website' />
      <div className='flex h-screen flex-col font-sans overflow-hidden'>
      <Header />
      <div className='flex flex-col md:flex-row flex-1 w-full min-h-0 overflow-hidden'>
        {/* Left Sidebar */}
        <div className='w-full md:w-1/3 p-4 pb-28 md:pb-4 overflow-y-auto border-t md:border-t-0 md:border-r border-border order-2 md:order-1 flex-1'>
          {sections.map(section => {
            const isCompleted = activeStep > section.step;
            const isActive = activeStep === section.step;

            return (
              <div
                key={section.step}
                ref={el => {
                  if (el) sectionRefs.current[section.step] = el;
                }}
              >
                <Collapsible
                  open={isActive}
                  onOpenChange={isOpen => {
                    if (isOpen && isCompleted)
                      setActiveStep(section.step);
                  }}
                  className='mb-2 rounded-md'
                >
                  <CollapsibleTrigger
                    className={`w-full p-4 font-bold text-left flex items-center gap-2 ${
                      isCompleted || isActive
                        ? 'text-[#0000D0]'
                        : 'text-muted-foreground'
                    }`}
                    disabled={section.step > activeStep}
                  >
                    {isActive || isCompleted ? (
                      <span className='inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#0000D0] text-white text-sm font-extrabold shrink-0'>
                        {section.step}
                      </span>
                    ) : (
                      <span className='inline-flex items-center justify-center w-7 h-7 rounded-full border border-muted-foreground/30 text-muted-foreground/70 text-sm font-bold shrink-0'>
                        {section.step}
                      </span>
                    )}
                    <span className='tracking-wide uppercase text-sm font-black'>
                      {section.title}
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className='p-4 bg-muted/20 border-t border-border/40'>
                    <div style={{ display: isActive ? '' : 'none' }}>
                      <section.Component onContinue={handleContinue} />
                    </div>
                    {isCompleted && (
                      <p className='text-xs text-muted-foreground'>Completed</p>
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
          className='w-full h-[40vh] md:h-full md:w-2/3 bg-muted order-1 md:order-2 shrink-0 md:shrink'
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
