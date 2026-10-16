export default function ImagePlaceholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  const radius = /\brounded/.test(className) ? "" : "rounded-xl";

  return (
    <div
      className={`flex items-center justify-center border border-dashed border-sand bg-sand-soft px-4 text-center text-sm ${radius} ${className}`}
    >
      {label}
    </div>
  );
}
