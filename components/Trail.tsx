// Divisor decorativo: rastro de ferraduras, "a passo de cavalo".
export default function Trail({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`trail ${className}`}>
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}
