import { useAppAuth } from "@/store/auth";
export const checkSinglePermission = (list: any) => {
  const appAuth = useAppAuth();
  if (!appAuth.getRoles) return true;

  return appAuth.getRoles.groups.includes(list);
};

export const checkPermission = (
  control: string,
  permission: string,
) => {
  const appAuth = useAppAuth();
  if (!appAuth.getRoles) return true;
  const found = appAuth.getRoles?.group_permissions[control]?.includes(permission);
  if (!found) return false;
  return true;
};
export const checkGroup = (name: string) => {
  const appAuth = useAppAuth();
  if (!appAuth.getRoles) return true;
  const found = appAuth.getRoles?.groups.find((group: any) => group === name);
  if (!found) return false;
  return true;
};

export const includesSome = (group1: any[], group2: any[]) => {
  if (!group2) return true;
  return group2.some((group: any) => group1.includes(group));
};

export const checkRootPermission = (lists: any[]) => {
  const appAuth = useAppAuth();
  if (!appAuth.getRoles) return true;
  return includesSome(appAuth.getRoles.groups, lists);
};


export const settings = ["countries",
  "cities",
  "settings",
  "pages",
  "blogs",
  "districts"];
export const Dashboard = [
  "Statistics",
  "mostSellingDays",
  "hourlySales",
  "numOfSales",
];


// [
//   "countries",
//   "blogs",
//   "districts",
//   "pages",
//   "cities",
//   "banks",
//   "provider_reviews",
//   "review_questions",
//   "cancel_reasons",
//   "shipping_companies",
//   "packages",
//   "deals",
//   "rates",
//   "order",
//   "sizes",
//   "users",
//   "providers",
//   "stories",
//   "products",
//   "features",
//   "story_themes",
//   "zones",
//   "sliders",
//   "facility-types",
//   "brands",
//   "categories",
//   "role",
//   "settings",
//   "contacts",
//   "admins"
// ]


// [


//   "admins",
//   "contacts",
//   "role",
//   "banks",


//   "categories",
//   "brands",
//   "blogs",
//   "provider_reviews",
//   "review_questions",
//   "cancel_reasons",
//   "shipping_companies",
//   "packages",
//   "deals",
//   "rates",
//   "order",
//   "sizes",
//   "users",
//   "providers",
//   "stories",
//   "products",
//   "features",
//   "story_themes",
//   "zones",
//   "sliders",
//   "facility-types",

// ]
