import StepContinue from './StepContinue';

export default function ItemSelector({ onContinue }) {
  return (
    <>
      <p className='text-xs text-muted-foreground font-semibold mb-4 tracking-wide'>
        No item options available yet
      </p>
      <StepContinue disabled={false} onClick={onContinue} />
    </>
  );
}
