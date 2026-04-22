import { LoaderCircle } from 'lucide-react';

export function Loader() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <LoaderCircle className="w-12 h-12 animate-spin text-black" />
    </div>
  );
}
