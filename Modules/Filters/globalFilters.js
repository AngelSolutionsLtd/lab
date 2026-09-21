import getTerminology from 'VueSrcPath/Modules/Filters/Terminology';
import moment from "moment";

const registerGlobalFilters = (app, store) => {
  app.config.globalProperties.$filters = {
    terminology(original) {
      return getTerminology(original, store.getters.terminology);
    },
    formatDateToString(value) {
      if (!value) return '';
      const date = new Date(value);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure month is two digits
      const day = String(date.getDate()).padStart(2, '0'); // Ensure day is two digits
      return `${year}-${month}-${day}`;
    },
    formatDateTime(value) {
      return value ? moment(String(value)).format('DD/MM/YYYY HH:mm') : "";
    },
    formatDateFullYear(value) {
      return value ? moment(String(value)).format('DD/MM/YYYY') : "";
    },
    formatDate2Year(value) {
      return value ? moment(String(value)).format('DD/MM/YY') : "";
    },
    formatTime(value) {
      return value ? moment(String(value)).format("HH:mm") : "";
    }
  }
}

export default registerGlobalFilters;