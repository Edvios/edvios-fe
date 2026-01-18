import { Toaster } from 'react-hot-toast';

interface ToastProviderProps {
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
}

export function ToastProvider({ position = 'top-right' }: ToastProviderProps) {
  return (
    <Toaster
      position={position}
      toastOptions={{
        duration: 4000,
        className:
          'bg-white text-gray-700 border border-gray-200 rounded-lg shadow-lg min-w-[600px] max-w-[800px] p-4 text-sm',
        success: {
          duration: 3000,
          className: 'bg-green-50 text-green-800 border-green-200',
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          duration: 3000,
          className: 'bg-red-400 text-red-900 border-red-500',
          iconTheme: {
            primary: '#dc2626',
            secondary: '#fff',
          },
        },
        loading: {
          className: 'bg-blue-50 text-blue-800 border-blue-200',
          iconTheme: {
            primary: '#3b82f6',
            secondary: '#fff',
          },
        },
        // Custom toast types
        blank: {
          className: 'bg-gray-50 text-gray-800 border-gray-200',
        },
      }}
    />
  );
}

// Export commonly used toast functions for convenience
export { default as toast } from 'react-hot-toast';
