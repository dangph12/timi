import StepContinue from './StepContinue';

export default function PackagingSelector({ onContinue }) {
  return (
    <>
      <p className='text-xs text-muted-foreground font-semibold mb-4 tracking-wide'>
        No packaging options available yet
      </p>
      <StepContinue disabled={false} onClick={onContinue} />
    </>
  );
}
