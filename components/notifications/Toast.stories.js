import toastr from "../../Modules/toastr";

export default {
  title: 'Components/Notifications/Toast',
  tags: ['autodocs'],
  argTypes: {
    toastOptions: { control: 'select', options: ['success', 'error', 'info', 'warning'] },
    position: { control: 'select', options: ['top-right', 'top-left']  },
    timeout: { control: 'number' },
    closeButton: { control: 'boolean' },
    hideProgressBar: { control: 'boolean' },
    closeOnClick: { control: 'boolean' },
    pauseOnFocusLoss: { control: 'boolean' },
    pauseOnHover: { control: 'boolean' },
    draggable: { control: 'boolean' },
    draggablePercent: { control: 'number' },
    showCloseButtonOnHover: { control: 'boolean' },
    transition: { control: 'text' },
    maxToasts: { control: 'number' },
    newestOnTop: { control: 'boolean' },
  },
};

const messages = {
  success: 'Saved',
  error: 'Upload: Failed',
  warning: 'Warning',
  info: 'Working',
};

const Template = (args) => ({
  setup() {
    function showToast() {
      const { toastOptions, ...options } = args;
      toastr[toastOptions](messages[toastOptions], options);
    }

    function closeToast() {
      toastr.clear()
    }

    return { args, showToast, closeToast };
  },
  template: `
    <div style="min-height: 300px">
      <button class="btn btn--secondary mr-5" @click="showToast">Show Toast</button>
      <button class="btn btn--secondary" @click="closeToast">Close All</button>
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {
  toastOptions: 'success',
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