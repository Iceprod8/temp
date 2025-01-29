export function formatEntries(entries) {
  const result = [];
  for (let i = 0; i < entries.length; i += 1) {
    const f = {};
    let label = entries[i][0];
    label = label.replace("_", " ");
    f.id = i;
    f.label = label[0].toUpperCase() + label.slice(1);
    const [name, value] = entries[i];
    f.name = name;
    f.value = value;
    if (f.name === "email") {
      f.size = "large";
    } else if (f.name === "gender") {
      f.size = "small";
    } else {
      f.size = "medium";
    }

    result.push(f);
  }
  return result;
}

export const setFieldSize = (size) =>
  size === "large"
    ? { width: "calc(75% - 50px)" }
    : size === "medium"
      ? { width: "calc(50% - 40px)" }
      : { width: "calc(25% - 20px)" };
