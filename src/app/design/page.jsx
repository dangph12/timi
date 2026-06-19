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
  { id: '1', title: 'SELECT VERSION' },
  { id: '2', title: 'SELECT HAIR' },
  { id: '3', title: 'SELECT EYES' },
  { id: '4', title: 'SELECT LIP' },
  { id: '5', title: 'SELECT CLOTHES' },
  { id: '6', title: 'SELECT ACCESSORY' },
  { id: '7', title: 'SELECT ITEM' },
  { id: '8', title: 'SELECT PACKAGING' }
];

const selectorMap = {
  1: VersionSelector,
  2: HairSelector,
  3: EyesSelector,
  4: LipSelector,
  5: ClothesSelector,
  6: AccessorySelector,
  7: ItemSelector,
  8: PackagingSelector
};

export default function DesignPage() {
  const [activeStep, setActiveStep] = useState(1);
  const canvasRef = useRef(null);
  const designCanvasRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const navigate = useNavigate();
  const setCapturedCharacter = useSetAtom(capturedCharacterAtom);

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

  return (
    <div className='flex h-screen flex-col font-sans overflow-hidden'>
      <Header />
      <div className='flex flex-1 w-full min-h-0'>
        {/* Left Sidebar */}
        <div className='w-1/3 p-4 overflow-y-auto border-r border-border'>
          {sections.map(section => {
            const isCompleted = activeStep > parseInt(section.id);
            const isActive = activeStep === parseInt(section.id);
            const SelectorComponent = selectorMap[parseInt(section.id)];

            return (
              <Collapsible
                key={section.id}
                open={isActive}
                onOpenChange={isOpen => {
                  if (isOpen && isCompleted)
                    setActiveStep(parseInt(section.id));
                }}
                className='mb-2 rounded-md'
              >
                <CollapsibleTrigger
                  className={`w-full p-4 font-bold text-left flex items-center gap-2 ${
                    isCompleted || isActive
                      ? 'text-[#0000D0]'
                      : 'text-muted-foreground'
                  }`}
                  disabled={parseInt(section.id) > activeStep}
                >
                  {isActive || isCompleted ? (
                    <span className='inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#0000D0] text-white text-sm font-extrabold shrink-0'>
                      {section.id}
                    </span>
                  ) : (
                    <span className='inline-flex items-center justify-center w-7 h-7 rounded-full border border-muted-foreground/30 text-muted-foreground/70 text-sm font-bold shrink-0'>
                      {section.id}
                    </span>
                  )}
                  <span className='tracking-wide uppercase text-sm font-black'>
                    {section.title}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent className='p-4 bg-muted/20 border-t border-border/40'>
                  {isActive && SelectorComponent && (
                    <SelectorComponent onContinue={handleContinue} />
                  )}
                  {isCompleted && (
                    <p className='text-xs text-muted-foreground'>Completed</p>
                  )}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        {/* Right Canvas */}
        <div ref={canvasRef} className='w-2/3 h-full bg-muted'>
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
  );
}
