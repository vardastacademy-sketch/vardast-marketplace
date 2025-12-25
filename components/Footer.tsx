export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-slate-400">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Vardast Experts Hub. All rights reserved.
        </p>
        <p className="text-xs mt-2 text-slate-500">Powered by Vardast</p>
      </div>
    </footer>
  );
}
