import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Header from '@/components/header';

// Simple custom hook to load images for react-konva
function useImage(url) {
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (!url) {
      return;
    }
    let active = true;
    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      if (active) setImage(img);
    };
    img.onerror = err => {
      console.error('Failed to load image:', url, err);
      if (active) setImage(null);
    };
    return () => {
      active = false;
      setImage(null);
    };
  }, [url]);
  return image;
}

export default function DesignPage() {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const canvasRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const imageUrl = selectedVersion ? `/version/${selectedVersion}.png` : null;
  const image = useImage(imageUrl);

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

  return (
    <div className='flex h-screen flex-col font-sans overflow-hidden'>
      <Header />
      <div className='flex flex-1 w-full min-h-0'>
        {/* Left Sidebar */}
        <div className='w-1/3 p-4 overflow-y-auto border-r border-border'>
          {sections.map(section => {
            const isCompleted = activeStep > parseInt(section.id);
            const isActive = activeStep === parseInt(section.id);

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
                  className={`w-full p-4 font-bold text-left flex items-center gap-2 ${isCompleted || isActive ? 'text-[#0000D0]' : 'text-muted-foreground'}`}
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
                  {section.id === '1' ? (
                    <>
                      <p className='text-xs text-muted-foreground font-semibold mb-4 tracking-wide'>
                        Choose one
                      </p>
                      <div className='flex gap-4 mb-4'>
                        {/* Classic / Economy Card */}
                        <button
                          onClick={() => {
                            setSelectedVersion('economy');
                          }}
                          className={`group relative flex-1 bg-white border-2 rounded-xl overflow-hidden transition-all duration-200 outline-none flex flex-col ${
                            selectedVersion === 'economy'
                              ? 'border-[#0000D0] shadow-md shadow-blue-100'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {/* Image block with gradient */}
                          <div className='aspect-4/3 w-full bg-linear-to-b from-[#0000FF] to-[#4A4AFF] relative overflow-hidden shrink-0'>
                            <div className='absolute inset-0 flex items-center justify-center p-3'>
                              <img
                                src='/version/economy.png'
                                className='max-w-[105%] max-h-[105%] object-contain filter drop-shadow-sm'
                                alt='CLASSIC VERSION'
                              />
                            </div>

                            {/* Selection indicator */}
                            {selectedVersion === 'economy' && (
                              <span className='absolute bottom-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-[#0000D0] text-white border-2 border-white shadow-sm z-10'>
                                <Check className='size-3.5 stroke-3' />
                              </span>
                            )}
                          </div>
                          {/* Title text */}
                          <div className='p-3 bg-white text-center w-full border-t border-slate-100 mt-auto'>
                            <p
                              className={`text-[11px] font-black tracking-wider uppercase transition-colors ${
                                selectedVersion === 'economy'
                                  ? 'text-[#0000D0]'
                                  : 'text-slate-600'
                              }`}
                            >
                              Classic Version
                            </p>
                          </div>
                        </button>

                        {/* Standard Card */}
                        <button
                          onClick={() => {
                            setSelectedVersion('standard');
                          }}
                          className={`group relative flex-1 bg-white border-2 rounded-xl overflow-hidden transition-all duration-200 outline-none flex flex-col ${
                            selectedVersion === 'standard'
                              ? 'border-[#0000D0] shadow-md shadow-blue-100'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {/* Image block with gradient */}
                          <div className='aspect-4/3 w-full bg-linear-to-b from-[#0000FF] to-[#4A4AFF] relative overflow-hidden shrink-0'>
                            <div className='absolute inset-0 flex items-center justify-center p-3'>
                              {/* Scale to standard image */}
                              <img
                                src='/version/standard.png'
                                className='max-w-[115%] max-h-[115%] object-contain filter drop-shadow-sm'
                                alt='STANDARD VERSION'
                              />
                            </div>

                            {/* Selection indicator */}
                            {selectedVersion === 'standard' && (
                              <span className='absolute bottom-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-[#0000D0] text-white border-2 border-white shadow-sm z-10'>
                                <Check className='size-3.5 stroke-3' />
                              </span>
                            )}
                          </div>
                          {/* Title text */}
                          <div className='p-3 bg-white text-center w-full border-t border-slate-100 mt-auto'>
                            <p
                              className={`text-[11px] font-black tracking-wider uppercase transition-colors ${
                                selectedVersion === 'standard'
                                  ? 'text-[#0000D0]'
                                  : 'text-slate-600'
                              }`}
                            >
                              Standard Version
                            </p>
                          </div>
                        </button>
                      </div>
                      <Button
                        className='w-full py-4 text-xs font-black bg-[#0000D0] hover:bg-[#0000A0] text-white tracking-widest rounded-full h-11 transition-all shadow-md active:scale-[0.98]'
                        onClick={() => setActiveStep(2)}
                        disabled={!selectedVersion}
                      >
                        CONTINUE →
                      </Button>
                    </>
                  ) : (
                    <>
                      <p>Configure {section.title.toLowerCase()}...</p>
                      <Button
                        className='w-full mt-4'
                        onClick={() => setActiveStep(prev => prev + 1)}
                      >
                        CONTINUE →
                      </Button>
                    </>
                  )}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        {/* Right Canvas */}
        <div ref={canvasRef} className='w-2/3 h-full bg-muted'>
          {size.width > 0 && (
            <Stage width={size.width} height={size.height}>
              <Layer>
                <Rect
                  x={0}
                  y={0}
                  width={size.width}
                  height={size.height}
                  fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                  fillLinearGradientEndPoint={{ x: 0, y: size.height }}
                  fillLinearGradientColorStops={[0, '#0000FF', 1, '#4A4AFF']}
                />
                {image &&
                  (() => {
                    const maxDim = Math.min(size.width, size.height) * 0.83;
                    let renderWidth = maxDim;
                    let renderHeight = maxDim;

                    if (image.width && image.height) {
                      const imageRatio = image.width / image.height;
                      if (imageRatio > 1) {
                        renderWidth = maxDim;
                        renderHeight = maxDim / imageRatio;
                      } else {
                        renderWidth = maxDim * imageRatio;
                        renderHeight = maxDim;
                      }
                    }

                    return (
                      <KonvaImage
                        image={image}
                        x={size.width / 2 - renderWidth / 2}
                        y={size.height / 2 - renderHeight / 2}
                        width={renderWidth}
                        height={renderHeight}
                      />
                    );
                  })()}
              </Layer>
            </Stage>
          )}
        </div>
      </div>
    </div>
  );
}
