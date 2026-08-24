/**
 * Local fallback content.
 * Used only if the backend API (server/) is not reachable, so the
 * front end always has something real to render out of the box.
 * Once the API is running and seeded, this file is ignored.
 */
window.__FALLBACK_PROJECTS__ = [
  {
    _id: "midnight-frames",
    slug: "midnight-frames",
    title: "Midnight Frames",
    category: "photography",
    year: 2026,
    location: "Lisbon, Portugal",
    description: "A late-night portrait series exploring how artificial light reshapes familiar faces.",
    creativeDirection: "Shot handheld on available light only — streetlamps, shopfronts, car headlights — to keep every frame honest and a little unpredictable.",
    coverImage: "https://picsum.photos/id/1005/1400/1000",
    order: 1,
    featured: true,
    gallery: [
      { type: "image", url: "https://picsum.photos/id/1005/1600/1100" },
      { type: "image", url: "https://picsum.photos/id/1011/1200/1600" },
      { type: "image", url: "https://picsum.photos/id/1027/1200/1600" },
      { type: "image", url: "https://picsum.photos/id/1025/1600/1100" }
    ]
  },
  {
    _id: "after-rain",
    slug: "after-rain",
    title: "After Rain",
    category: "videography",
    year: 2026,
    location: "Porto, Portugal",
    description: "A short film about the quiet twenty minutes a city takes to dry after a storm.",
    creativeDirection: "Built entirely around ambient sound and natural light — no score until the final thirty seconds.",
    coverImage: "https://picsum.photos/id/1040/1400/1000",
    order: 2,
    featured: true,
    gallery: [
      { type: "image", url: "https://picsum.photos/id/1040/1600/1100" },
      { type: "image", url: "https://picsum.photos/id/1043/1200/1600" },
      { type: "image", url: "https://picsum.photos/id/1044/1600/1100" }
    ]
  },
  {
    _id: "urban-silence",
    slug: "urban-silence",
    title: "Urban Silence",
    category: "photography",
    year: 2025,
    location: "Berlin, Germany",
    description: "Documentary photography looking at how people find stillness inside dense cities.",
    creativeDirection: "Long lens, long patience. Most frames were the result of waiting in one spot for over an hour.",
    coverImage: "https://picsum.photos/id/1062/1400/1000",
    order: 3,
    featured: true,
    gallery: [
      { type: "image", url: "https://picsum.photos/id/1062/1600/1100" },
      { type: "image", url: "https://picsum.photos/id/1074/1200/1600" },
      { type: "image", url: "https://picsum.photos/id/1084/1600/1100" }
    ]
  },
  {
    _id: "motion-identity",
    slug: "motion-identity",
    title: "Motion / Identity",
    category: "videography",
    year: 2026,
    location: "Remote",
    description: "Brand film and motion identity system for an independent skincare label.",
    creativeDirection: "Designed a modular shot language the client's team could reuse for future social content.",
    coverImage: "https://picsum.photos/id/1080/1400/1000",
    order: 4,
    featured: false,
    gallery: [
      { type: "image", url: "https://picsum.photos/id/1080/1600/1100" },
      { type: "image", url: "https://picsum.photos/id/1082/1200/1600" }
    ]
  },
  {
    _id: "fragments",
    slug: "fragments",
    title: "Fragments",
    category: "design",
    year: 2025,
    location: "Studio",
    description: "A poster and campaign series for a contemporary jazz festival.",
    creativeDirection: "Typography-led design built entirely from cropped fragments of the festival's own archive photography.",
    coverImage: "https://picsum.photos/id/1069/1400/1000",
    order: 5,
    featured: false,
    gallery: [
      { type: "image", url: "https://picsum.photos/id/1069/1600/1100" },
      { type: "image", url: "https://picsum.photos/id/1070/1200/1600" },
      { type: "image", url: "https://picsum.photos/id/1071/1200/1600" }
    ]
  },
  {
    _id: "showreel-2026",
    slug: "showreel-2026",
    title: "Showreel 2026",
    category: "editing",
    year: 2026,
    location: "Studio",
    description: "A cut of commercial, social and short-film editing work from the past year.",
    creativeDirection: "Edited to a single continuous rhythm — every cut lands on a beat, even across unrelated projects.",
    coverImage: "https://picsum.photos/id/1039/1400/1000",
    order: 6,
    featured: false,
    gallery: [
      { type: "image", url: "https://picsum.photos/id/1039/1600/1100" },
      { type: "image", url: "https://picsum.photos/id/1035/1600/1100" }
    ]
  }
];

window.__FALLBACK_TESTIMONIALS__ = [
  {
    quote: "Kai turned a two-line brief into a film we still send to new clients as our best example of who we are.",
    name: "Elena Marques",
    role: "Founder, Studio North",
    avatar: "https://picsum.photos/id/64/100/100"
  },
  {
    quote: "The portraits felt like us on a good day, not a studio's idea of us. That's rarer than it should be.",
    name: "Tomás Ribeiro",
    role: "Editorial Director, Linha",
    avatar: "https://picsum.photos/id/91/100/100"
  },
  {
    quote: "Fast, calm on set, and the kind of editing instinct you can't really teach.",
    name: "Priya Nadar",
    role: "Brand Lead, Solene",
    avatar: "https://picsum.photos/id/177/100/100"
  }
];
