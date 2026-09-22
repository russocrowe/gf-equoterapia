export default function ImagePlaceholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border border-dashed border-ink/20 bg-lime/30 text-center text-sm text-muted ${className}`}
    >
      {label}
    </div>
  );
}
