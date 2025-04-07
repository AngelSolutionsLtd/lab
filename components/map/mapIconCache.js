const iconCache = new Map();

const sizeMap = {
  sm: { width: 40, height: 46 },
  md: { width: 47, height: 53 },
  lg: { width: 52, height: 60 }
};

export function getMapIcon({ rollSize, balance, phase, hexColor }) {
  const cacheKey = `${rollSize}-${balance}-${phase}-${hexColor}`;

  if (iconCache.has(cacheKey)) {
    return iconCache.get(cacheKey);
  }

  const { width, height } = sizeMap[rollSize] || sizeMap.sm; 

  const icon = L.divIcon({
    className: 'custom-marker',
    html: createSvgMarker({ rollSize, balance, phase, hexColor }),
    iconSize: [width, height],
    iconAnchor: [width / 2, height],
    popupAnchor: [0, -height]
  });

  iconCache.set(cacheKey, icon);
  return icon;
}
