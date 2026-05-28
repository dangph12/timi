import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle as KonvaCircle } from 'react-konva';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Box } from 'lucide-react';

export default function DesignPage() {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [selectedShape, setSelectedShape] = useState(null);
  const canvasRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

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
    <div className='flex h-screen w-full'>
      {/* Left Sidebar */}
      <div className='w-1/3 p-4 overflow-y-auto border-r border-border'>
        <h1 className='text-2xl font-bold mb-6'>Design</h1>

        {sections.map(section => {
          const isCompleted = activeStep > parseInt(section.id);
          const isActive = activeStep === parseInt(section.id);

          return (
            <Collapsible
              key={section.id}
              open={isActive}
              onOpenChange={isOpen => {
                if (isOpen && isCompleted) setActiveStep(parseInt(section.id));
              }}
              className='mb-2 rounded-md'
            >
              <CollapsibleTrigger
                className={`w-full p-4 font-semibold text-left ${isCompleted || isActive ? 'text-foreground' : 'text-muted-foreground'}`}
                disabled={parseInt(section.id) > activeStep}
              >
                {isActive ? (
                  <span className='inline-flex items-center justify-center w-6 h-6 rounded-full border text-sm mr-2 bg-foreground text-background'>
                    {section.id}
                  </span>
                ) : (
                  section.id + '.'
                )}
                {section.title}
              </CollapsibleTrigger>
              <CollapsibleContent className='p-4 bg-muted/20'>
                {section.id === '1' ? (
                  <>
                    <span className='inline-flex items-center justify-center w-6 h-6 rounded-full border text-sm mr-2 mb-2'>
                      {section.id}
                    </span>
                    <div className='flex gap-4'>
                      <button
                        onClick={() => {
                          setSelectedVersion('economy');
                          setSelectedShape('circle');
                        }}
                        className={`border-2 p-4 rounded flex flex-col items-center ${
                          selectedVersion === 'economy'
                            ? 'border-primary'
                            : 'border-border'
                        }`}
                      >
                        <Box className='size-12 mb-2' />
                        <p className='font-bold'>ECONOMY</p>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedVersion('standard');
                          setSelectedShape('rect');
                        }}
                        className={`border-2 p-4 rounded flex flex-col items-center ${
                          selectedVersion === 'standard'
                            ? 'border-primary'
                            : 'border-border'
                        }`}
                      >
                        <Box className='size-12 mb-2' />
                        <p className='font-bold'>STANDARD</p>
                      </button>
                    </div>
                    <Button
                      className='w-full mt-4'
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
              {selectedShape === 'circle' && (
                <KonvaCircle
                  x={size.width / 2}
                  y={size.height / 2}
                  radius={50}
                  fill='white'
                />
              )}
              {selectedShape === 'rect' && (
                <Rect
                  x={size.width / 2 - 50}
                  y={size.height / 2 - 50}
                  width={100}
                  height={100}
                  fill='white'
                />
              )}
            </Layer>
          </Stage>
        )}
      </div>
    </div>
  );
}
