// /components/LoadingOverlay.js
import LoadingSpinner from './LoadingSpinner';

export default function LoadingOverlay({ isVisible, message = '저장 중...' }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-2xl transform transition-all duration-300 ease-in-out max-w-sm w-11/12 flex flex-col items-center">
        <LoadingSpinner size="lg" color="fuchsia" className="mb-4" />
        <p className="text-fuchsia-900 font-medium">{message}</p>
      </div>
    </div>
  );
}