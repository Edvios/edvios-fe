import toast from 'react-hot-toast';
import type { ToastOptions, ToastPosition } from 'react-hot-toast';

export type TToastType = 'success' | 'error' | 'loading' | 'info' | 'warning';

export interface IThemeAwareToastOptions extends Omit<ToastOptions, 'style'> {
  theme?: 'light' | 'dark' | 'auto';
  position?: ToastPosition;
}

export const getResolvedTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';

  const isDark = document.documentElement.classList.contains('dark');
  return isDark ? 'dark' : 'light';
};

const getToastStyles = (type: TToastType, theme: 'light' | 'dark') => {
  const baseStyles = {
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    padding: '12px 16px',
    maxWidth: '400px',
    boxShadow:
      theme === 'dark'
        ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
        : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border:
      theme === 'dark'
        ? '1px solid rgb(39, 39, 42)'
        : '1px solid rgb(229, 231, 235)',
  };

  const typeStyles = {
    success: {
      backgroundColor:
        theme === 'dark' ? 'rgb(20, 83, 45)' : 'rgb(240, 253, 244)',
      color: theme === 'dark' ? 'rgb(187, 247, 208)' : 'rgb(22, 101, 52)',
      border:
        theme === 'dark'
          ? '1px solid rgb(34, 197, 94)'
          : '1px solid rgb(134, 239, 172)',
    },
    error: {
      backgroundColor:
        theme === 'dark' ? 'rgb(127, 29, 29)' : 'rgb(254, 242, 242)',
      color: theme === 'dark' ? 'rgb(252, 165, 165)' : 'rgb(153, 27, 27)',
      border:
        theme === 'dark'
          ? '1px solid rgb(239, 68, 68)'
          : '1px solid rgb(252, 165, 165)',
    },
    loading: {
      backgroundColor:
        theme === 'dark' ? 'rgb(39, 39, 42)' : 'rgb(255, 255, 255)',
      color: theme === 'dark' ? 'rgb(244, 244, 245)' : 'rgb(39, 39, 42)',
      border:
        theme === 'dark'
          ? '1px solid rgb(63, 63, 70)'
          : '1px solid rgb(229, 231, 235)',
    },
    info: {
      backgroundColor:
        theme === 'dark' ? 'rgb(30, 58, 138)' : 'rgb(239, 246, 255)',
      color: theme === 'dark' ? 'rgb(147, 197, 253)' : 'rgb(30, 58, 138)',
      border:
        theme === 'dark'
          ? '1px solid rgb(59, 130, 246)'
          : '1px solid rgb(147, 197, 253)',
    },
    warning: {
      backgroundColor:
        theme === 'dark' ? 'rgb(120, 53, 15)' : 'rgb(255, 251, 235)',
      color: theme === 'dark' ? 'rgb(253, 224, 71)' : 'rgb(120, 53, 15)',
      border:
        theme === 'dark'
          ? '1px solid rgb(245, 158, 11)'
          : '1px solid rgb(253, 224, 71)',
    },
  };

  return {
    ...baseStyles,
    ...typeStyles[type],
  };
};

export class AppToast {
  private static getTheme(options?: IThemeAwareToastOptions): 'light' | 'dark' {
    if (options?.theme === 'auto' || !options?.theme) {
      return getResolvedTheme();
    }
    return options.theme;
  }

  private static createToastOptions(
    type: TToastType,
    userOptions?: IThemeAwareToastOptions,
  ): ToastOptions {
    const theme = this.getTheme(userOptions);
    const styles = getToastStyles(type, theme);

    return {
      duration: type === 'loading' ? Infinity : 4000,
      position: 'top-right',
      ...userOptions,
      style: styles,
    };
  }

  static success(message: string, options?: IThemeAwareToastOptions) {
    const toastOptions = this.createToastOptions('success', options);
    return toast.success(message, toastOptions);
  }

  static error(message: string, options?: IThemeAwareToastOptions) {
    const toastOptions = this.createToastOptions('error', options);
    return toast.error(message, toastOptions);
  }

  static loading(message: string, options?: IThemeAwareToastOptions) {
    const toastOptions = this.createToastOptions('loading', options);
    return toast.loading(message, toastOptions);
  }

  static info(message: string, options?: IThemeAwareToastOptions) {
    const toastOptions = this.createToastOptions('info', options);
    return toast(message, toastOptions);
  }

  static warning(message: string, options?: IThemeAwareToastOptions) {
    const toastOptions = this.createToastOptions('warning', options);
    return toast(message, toastOptions);
  }

  static dismiss(toastId?: string) {
    return toast.dismiss(toastId);
  }

  static remove(toastId?: string) {
    return toast.remove(toastId);
  }

  static promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    },
    options?: IThemeAwareToastOptions,
  ) {
    const theme = this.getTheme(options);
    const loadingStyle = getToastStyles('loading', theme);
    const successStyle = getToastStyles('success', theme);
    const errorStyle = getToastStyles('error', theme);

    return toast.promise(promise, messages, {
      loading: { style: loadingStyle },
      success: { style: successStyle },
      error: { style: errorStyle },
      ...options,
    });
  }
}

// Export individual functions for convenience
export const showSuccessToast = (
  message: string,
  options?: IThemeAwareToastOptions,
) => AppToast.success(message, options);

export const showErrorToast = (
  message: string,
  options?: IThemeAwareToastOptions,
) => AppToast.error(message, options);

export const showLoadingToast = (
  message: string,
  options?: IThemeAwareToastOptions,
) => AppToast.loading(message, options);

export const showInfoToast = (
  message: string,
  options?: IThemeAwareToastOptions,
) => AppToast.info(message, options);

export const showWarningToast = (
  message: string,
  options?: IThemeAwareToastOptions,
) => AppToast.warning(message, options);

export const dismissToast = (toastId?: string) => AppToast.dismiss(toastId);

export const removeToast = (toastId?: string) => AppToast.remove(toastId);

export const showPromiseToast = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: unknown) => string);
  },
  options?: IThemeAwareToastOptions,
) => AppToast.promise(promise, messages, options);

export default AppToast;
