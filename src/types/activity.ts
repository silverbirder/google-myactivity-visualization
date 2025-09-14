export type LocationInfo = {
  name?: string;
  url?: string;
  source?: string;
};

export type Activity = {
  header: string;
  title: string;
  titleUrl: string;
  time: string;
  products: string[];
  product?: string;
  activityControls: string[];
  locationInfos?: string | null;
};
