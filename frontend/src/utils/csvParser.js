export function parseCSV(csvText) {
  if (!csvText || !csvText.trim()) {
    throw new Error("CSV file is empty.");
  }

  const lines = csvText
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  if (lines.length < 2) {
    throw new Error("CSV must contain a header and at least one data row.");
  }

  const headers = lines[0]
    .split(",")
    .map((header) => header.trim());

  const requiredHeaders = [
    "Date",
    "Provider",
    "Service",
    "Region",
    "Usage",
    "Unit",
    "Cost",
  ];

  const missingHeaders = requiredHeaders.filter(
    (header) => !headers.includes(header)
  );

  if (missingHeaders.length > 0) {
    throw new Error(
      `Missing required columns: ${missingHeaders.join(", ")}`
    );
  }

  const data = lines.slice(1).map((line, index) => {
    const values = line.split(",").map((value) => value.trim());

    if (values.length !== headers.length) {
      throw new Error(
        `Invalid data on row ${index + 2}. Expected ${headers.length} columns.`
      );
    }

    const row = {};

    headers.forEach((header, columnIndex) => {
      row[header] = values[columnIndex];
    });

    row.Usage = Number(row.Usage);
    row.Cost = Number(row.Cost);

    if (Number.isNaN(row.Usage) || Number.isNaN(row.Cost)) {
      throw new Error(
        `Invalid numeric value on row ${index + 2}.`
      );
    }

    return row;
  });

  return data;
}