import { useToast } from 'vue-toastification';

const defaultOptions = {
    position: 'top-right',
    timeout: 5000,
    closeButton: false,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    transition: 'Vue-Toastification__fade',
    maxToasts: 5,
    newestOnTop: true,
};

// Prevents toasts of the same type from appearing simultaneously, discarding duplicates
export function filterBeforeCreate(toast, toasts) {
  if (toasts.some(t => t.type === toast.type && t.content === toast.content)) {
    // Returning false discards the toast
    return false;
  }
  // You can modify the toast if you want
  return toast;
}

let toastInstance = null;

export function registerToast(toast) {
  toastInstance = toast;
}

function showToast(type, message, maybeOptionsOrTitle) {
    const toast = toastInstance || useToast();
    // const toast = useToast(); 
    // runtime injection from vue-toastification

    const isOptions = maybeOptionsOrTitle && typeof maybeOptionsOrTitle === 'object';
    const title = isOptions ? undefined : maybeOptionsOrTitle;
    const overrideOptions = isOptions ? maybeOptionsOrTitle : {};

    const finalMessage = title ? `${title}: ${message}` : message;

    // Returned so callers can hold the id and later pass it to `remove`
    return toast[type](finalMessage, { ...defaultOptions, ...overrideOptions });
}

// const toast = useToast(); // single instance for clear/remove methods
const defaultToast = toastInstance || useToast();

export default {
    success: (msg, optsOrTitle) => showToast('success', msg, optsOrTitle),
    error: (msg, optsOrTitle) => showToast('error', msg, optsOrTitle),
    info: (msg, optsOrTitle) => showToast('info', msg, optsOrTitle),
    warning: (msg, optsOrTitle) => showToast('warning', msg, optsOrTitle),
    clear: () => defaultToast.clear(),
    remove: (toastId) => defaultToast.dismiss(toastId),
};
