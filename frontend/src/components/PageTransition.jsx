export default function PageTransition({ pageKey, children, className = "" }) {
  return (
    <div key={pageKey} className={`page-transition ${className}`.trim()}>
      {children}
    </div>
  );
}
