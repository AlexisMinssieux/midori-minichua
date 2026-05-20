/* ================================================
   MIDORI MINICHUA — Catalogue produits
   Modifiez ce fichier pour ajouter/modifier vos créations
   ================================================ */

const PRODUCTS = [
  {
    id: 1,
    name: "Boucles d'oreilles Feuilles de Thé",
    category: "bijoux",
    price: 24.00,
    description: "Délicates boucles d'oreilles façonnées à la main, inspirées des feuilles de thé vert japonais. Métal doré, finition mate. Longueur : 3 cm.",
    color: "linear-gradient(135deg, #8BA888 0%, #C4D8C2 100%)",
    emoji: "🌿",
    badge: "Nouveau",
    inStock: true,
    featured: true
  },
  {
    id: 2,
    name: "Bracelet Shirobana",
    category: "bijoux",
    price: 18.00,
    description: "Bracelet délicat aux motifs floraux blanc. Chaque pièce est unique, réalisée à la main avec du fil de soie naturel et des perles en verre.",
    color: "linear-gradient(135deg, #D4A5B5 0%, #F0D0DC 100%)",
    emoji: "🌸",
    badge: null,
    inStock: true,
    featured: true
  },
  {
    id: 3,
    name: "Pochette Indigo Brodée",
    category: "accessoires",
    price: 35.00,
    description: "Pochette en tissu indigo ornée de broderies artisanales aux motifs traditionnels. Fermeture bouton en bois. Idéale pour ranger vos trésors.",
    color: "linear-gradient(135deg, #5A6E8A 0%, #8FAABF 100%)",
    emoji: "🎴",
    badge: "Populaire",
    inStock: true,
    featured: true
  },
  {
    id: 4,
    name: "Tote Bag Hanami",
    category: "accessoires",
    price: 28.00,
    description: "Tote bag en coton naturel illustré de cerisiers en fleurs. Sérigraphie artisanale à l'encre à base d'eau. Anses renforcées.",
    color: "linear-gradient(135deg, #C4A882 0%, #E8D5B0 100%)",
    emoji: "🌸",
    badge: null,
    inStock: true,
    featured: true
  },
  {
    id: 5,
    name: "Carnet Washi",
    category: "papeterie",
    price: 16.00,
    description: "Carnet à couverture en papier washi traditionnel japonais. Pages lignées crème, format A6 pratique. Reliure cousue à la main.",
    color: "linear-gradient(135deg, #E8C99A 0%, #F7E8CC 100%)",
    emoji: "📔",
    badge: null,
    inStock: true,
    featured: false
  },
  {
    id: 6,
    name: "Bougie Yuzu & Jasmin",
    category: "decoration",
    price: 22.00,
    description: "Bougie artisanale aux notes délicates de yuzu et jasmin. Cire végétale naturelle, mèche en coton. Contenant en verre recyclé. Durée : ~30h.",
    color: "linear-gradient(135deg, #A8D8A8 0%, #E0F5E0 100%)",
    emoji: "🕯️",
    badge: "Exclusivité",
    inStock: false,
    featured: false
  },
  {
    id: 7,
    name: "Épingle Émail Kimono",
    category: "bijoux",
    price: 12.00,
    description: "Épingle décorative en émail cloisonné inspirée des motifs de kimono traditionnel. Finition brillante, attache double sécurisée.",
    color: "linear-gradient(135deg, #A8C5D0 0%, #D0ECF8 100%)",
    emoji: "🎌",
    badge: null,
    inStock: true,
    featured: false
  },
  {
    id: 8,
    name: "Tenugui Bambou & Ondes",
    category: "decoration",
    price: 19.00,
    description: "Tissu tenugui teint à la main, motif ondes et bambou sur fond naturel. Polyvalent : foulard, décoration murale, emballage cadeau. 90×35 cm.",
    color: "linear-gradient(135deg, #8BAAB8 0%, #C2D5E0 100%)",
    emoji: "🎋",
    badge: null,
    inStock: true,
    featured: false
  }
];

const CATEGORIES = [
  { id: "all",        label: "Tout voir" },
  { id: "bijoux",     label: "Bijoux" },
  { id: "accessoires",label: "Accessoires" },
  { id: "decoration", label: "Décoration" },
  { id: "papeterie",  label: "Papeterie" }
];
