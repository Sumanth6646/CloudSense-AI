export const currency = "USD";

export const currencySymbol = "$";

export const monthlyCost = [
  { month: "Jan", cost: 12000 },
  { month: "Feb", cost: 13500 },
  { month: "Mar", cost: 14200 },
  { month: "Apr", cost: 15150 },
  { month: "May", cost: 16446 },
  { month: "Jun", cost: 18420 },
];

export const serviceCost = [
  { name: "EC2", value: 7368 },
  { name: "S3", value: 4605 },
  { name: "RDS", value: 3684 },
  { name: "Lambda", value: 2763 },
];

export const dashboardSummary = {
  totalCost: 18420,
  monthlyGrowth: 12,
  forecast: 20500,
  estimatedSavings: 2850,
  activeAnomalies: 7,
};

export const budgetData = {
  budget: 20000,
  spent: 18420,
};

export const dashboardInsights = [
  {
    title: "Cloud spending increased by 12%",
    description:
      "Current spending is higher than the previous month, mainly due to increased compute usage.",
    type: "warning",
  },
  {
    title: "Compute resources are the largest cost driver",
    description:
      "EC2 currently represents approximately 40% of the total cloud spending.",
    type: "info",
  },
  {
    title: "Potential savings identified",
    description:
      "Optimization opportunities could reduce monthly cloud spending by approximately $2,850.",
    type: "success",
  },
];

export const anomalies = [
  {
    date: "30 Jul 2026",
    service: "Amazon EC2",
    cost: 620,
    severity: "Critical",
    status: "Open",
  },
  {
    date: "29 Jul 2026",
    service: "Amazon S3",
    cost: 245,
    severity: "Medium",
    status: "Investigating",
  },
  {
    date: "28 Jul 2026",
    service: "Azure Virtual Machine",
    cost: 980,
    severity: "Critical",
    status: "Open",
  },
  {
    date: "27 Jul 2026",
    service: "AWS Lambda",
    cost: 65,
    severity: "Low",
    status: "Resolved",
  },
  {
    date: "26 Jul 2026",
    service: "Google Cloud Storage",
    cost: 430,
    severity: "High",
    status: "Open",
  },
];

export const recommendations = [
  {
    title: "Rightsize EC2 instances",
    description: "Reduce compute capacity on underutilized instances.",
    savings: 850,
    priority: "High",
  },
  {
    title: "Delete unattached EBS volumes",
    description: "Remove storage volumes that are no longer connected to resources.",
    savings: 230,
    priority: "Medium",
  },
  {
    title: "Enable Auto Scaling",
    description: "Automatically adjust compute capacity based on demand.",
    savings: 420,
    priority: "Medium",
  },
  {
    title: "Move infrequent data to Glacier",
    description: "Move rarely accessed data to lower-cost storage.",
    savings: 310,
    priority: "Low",
  },
];