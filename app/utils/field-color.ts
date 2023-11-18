type ColorMap = {
  [key: number]: string
}

export const getFieldColor = (field: number): string => {
  const colorMap: ColorMap = {
    1: '#FFF8E1',
    2: '#FFE082',
    3: '#FFCA28',
    4: '#FFA000',
    5: '#FF6F00'
  }
  return colorMap[field] ?? 'grey'
}
