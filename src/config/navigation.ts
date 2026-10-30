export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  {
    label: "Study Abroad",
    href: "/study-abroad/",
    children: [
      { label: "Study in Canada", href: "/study-abroad/canada/" },
      { label: "Study in the UK", href: "/study-abroad/uk/" },
      { label: "Study in Australia", href: "/study-abroad/australia/" },
      { label: "Study in the USA", href: "/study-abroad/usa/" },
    ],
  },
  { label: "Services", href: "/services/" },
  { label: "Destinations", href: "/destinations/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact/" },
  { label: "Legal & Policies", href: "/legal/policy-updates" },
];  
