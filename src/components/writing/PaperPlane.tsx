export default function PaperPlane({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M5 26 59 7 40 58 28 36 5 26Z" fill="currentColor" />
      <path d="m59 7-31 29 12 22 19-51Z" fill="#002fa7" fillOpacity=".18" />
      <path d="m59 7-31 29M28 36l-5 13 11-8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="m59 7-31 29" stroke="#002fa7" strokeOpacity=".45" strokeWidth="1.2" />
    </svg>
  );
}
