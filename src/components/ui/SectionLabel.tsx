export default function SectionLabel({
  index,
  children,
  className,
}: {
  index: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${className ?? ""}`}>
      <span className="label-accent">{index}</span>
      <span className="h-px w-8 bg-white/20" aria-hidden="true" />
      <span className="label">{children}</span>
    </div>
  );
}
