export type DestinationExperience = {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
};

export type Destination = {
  id: string;
  title: string;
  image: string;
  heading: string;
  description: string;
  details: string[];
  experiences: DestinationExperience[];
};

export const destinations: Destination[] = [
  {
    id: "arrival-plaza",
    title: "Arrival Plaza",
    image: "/images/destinations/arrival-plaza.jpg",
    heading: "Your journey begins at the heart of every destination.",
    description:
      "Discover welcoming spaces, helpful local guidance, and easy access to the experiences that make every journey memorable.",
    details: [
      "Find the welcome center for information and assistance.",
      "Explore excursions and activities suited to your interests.",
      "Follow convenient walking routes to nearby attractions.",
      "Reach popular destinations with simple transport options.",
    ],
    experiences: [
      {
        id: "aurea-spa",
        title: "Aurea Spa",
        category: "Relax",
        image: "/images/destinations/aurea-spa.jpg",
        description:
          "Take time to unwind and enjoy a relaxing wellness experience.",
      },
      {
        id: "snorkel-safari",
        title: "Snorkel Safari",
        category: "Discover",
        image: "/images/destinations/snorkel-safari.jpg",
        description:
          "Explore vibrant underwater scenery and discover marine life.",
      },
      {
        id: "springors-bar",
        title: "Springors Bar",
        category: "Taste",
        image: "/images/destinations/springors-bar.jpg",
        description:
          "Enjoy a memorable dining experience with fresh local flavors.",
      },
      {
        id: "great-lagoon",
        title: "Great Lagoon",
        category: "Explore",
        image: "/images/destinations/great-lagoon.jpg",
        description:
          "Discover beautiful lagoon views and peaceful surroundings.",
      },
    ],
  },
  {
    id: "aurea-spa",
    title: "Aurea Spa",
    image: "/images/destinations/aurea-spa.jpg",
    heading: "Find your moment of calm.",
    description:
      "Step away from the everyday and enjoy a relaxing escape designed around comfort, wellness, and rejuvenation.",
    details: [
      "Discover relaxing wellness experiences.",
      "Explore treatments and restorative activities.",
      "Enjoy a peaceful environment away from the crowds.",
      "Plan a refreshing break during your journey.",
    ],
    experiences: [
      {
        id: "arrival-plaza",
        title: "Arrival Plaza",
        category: "Discover",
        image: "/images/destinations/arrival-plaza.jpg",
        description: "Start exploring from the destination's main plaza.",
      },
      {
        id: "snorkel-safari",
        title: "Snorkel Safari",
        category: "Explore",
        image: "/images/destinations/snorkel-safari.jpg",
        description: "Explore underwater scenery and marine life.",
      },
      {
        id: "springors-bar",
        title: "Springors Bar",
        category: "Taste",
        image: "/images/destinations/springors-bar.jpg",
        description: "Enjoy fresh flavors and a memorable meal.",
      },
      {
        id: "great-lagoon",
        title: "Great Lagoon",
        category: "Relax",
        image: "/images/destinations/great-lagoon.jpg",
        description: "Take in the peaceful views around the lagoon.",
      },
    ],
  },
];
