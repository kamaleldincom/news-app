import { Loader2 } from 'lucide-react';

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-gray-900 mb-2" />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}