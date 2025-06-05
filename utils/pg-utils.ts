export const getColumnPlaceholder = (
  columns: string[],
  jsonbArr: number[] = []
) => {
  let nums = [];
  for (let i = 1; i < columns.length + 1; i++) {
    if (jsonbArr.some((v) => v === i)) {
      nums.push(`${i}::jsonb[]`);
    } else nums.push(i);
  }
  return `$${nums.join(", $")}`;
};

export const getFieldPlaceholder = (
  fields: string[],
  countFrom: number = 2,
  jsonbArr: number[] = []
) => {
  let items = [];

  for (let i = 1; i < fields.length + 1; i++) {
    if (jsonbArr.some((v) => v === i)) {
      items.push(`${fields[i - 1]} = $${i + countFrom}::jsonb[]`);
    } else items.push(`${fields[i - 1]} = $${i + countFrom}`);
  }
  return items.join(", ");
};
