export const getColumnPlaceholder = (columns: string[]) => {
  let nums = [];
  for (let i = 1; i < columns.length + 1; i++) {
    nums.push(i);
  }
  return `$${nums.join(", $")}`;
};
