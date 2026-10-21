export type NavigationItem = {
  label: string;
  href: string;
  children?: NavigationItem[];
};

export type Destination = {
  name: string;
  countryCode: string;
  description: string;
  image: string;
  href: string;
};

export type Service = {
  title: string;
  description: string;
  icon: string;
  href: string;
};
