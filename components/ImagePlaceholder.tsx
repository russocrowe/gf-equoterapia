const backgrounds = {
  marrom: "bg-marrom-claro",
  azul: "bg-azul-claro",
};

export default function ImagePlaceholder({
  label,
  tone = "marrom",
  className = "",
}: {
  label: string;
  tone?: keyof typeof backgrounds;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border border-dashed border-tinta/20 text-center text-sm text-tinta/60 ${backgrounds[tone]} ${className}`}
    >
      {label}
    </div>
  );
}
