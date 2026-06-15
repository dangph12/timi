import StepContinue from './StepContinue';

export default function HairSelector({ onContinue }) {
  return (
    <>
      <p className='text-xs text-muted-foreground font-semibold mb-4 tracking-wide'>
        No hair options available yet
      </p>
      <StepContinue disabled={false} onClick={onContinue} />
    </>
  );
}
