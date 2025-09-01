import { Spinner } from '@/app/components/ui/Spinner';

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-gray-600">Carregando...</p>
      </div>
    </div>
  );
}
