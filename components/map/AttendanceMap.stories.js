import AttendanceMap from './AttendanceMap.vue'

export default {
  title: 'Map/AttendanceMap',
  component: AttendanceMap,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    zoom: { control: { type: 'range', min: 10, max: 16, step: 0.5 } },
  },
}

/** Default view centred on Southampton */
export const Default = {
  args: {
    dataUrl: '/data/southampton-attendance.json',
    center: [-1.4044, 50.9097],
    zoom: 12,
  },
}

/** Zoomed into central Southampton (SO14/SO15) */
export const CentralSouthampton = {
  args: {
    dataUrl: '/data/southampton-attendance.json',
    center: [-1.4041, 50.9025],
    zoom: 13.5,
  },
}

/** Zoomed into the SO16 / Shirley area */
export const Shirley = {
  args: {
    dataUrl: '/data/southampton-attendance.json',
    center: [-1.4333, 50.9220],
    zoom: 13.5,
  },
}
