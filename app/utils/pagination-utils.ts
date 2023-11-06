export const formatOrderBy = (sortBy: { key: string; order: string }[]) => {
  const order = sortBy.map((item) => {
    return `${item.key}:${item.order}`
  })
  return order.join(',')
}
