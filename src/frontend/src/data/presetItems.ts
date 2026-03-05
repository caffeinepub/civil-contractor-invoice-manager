export interface PresetItem {
  description: string;
  unit: string;
  rate: number;
}

export const PRESET_ITEMS: PresetItem[] = [
  // Flooring
  { description: "Floor Tiling (Ceramic)", unit: "sq ft", rate: 45 },
  { description: "Floor Tiling (Vitrified)", unit: "sq ft", rate: 65 },
  { description: "Floor Tiling (Marble)", unit: "sq ft", rate: 120 },
  { description: "Floor Tiling (Granite)", unit: "sq ft", rate: 110 },
  { description: "Mosaic Flooring", unit: "sq ft", rate: 35 },
  { description: "Kota Stone Flooring", unit: "sq ft", rate: 40 },
  // Wall Work
  { description: "Wall Tiling (Bathroom)", unit: "sq ft", rate: 55 },
  { description: "Wall Tiling (Kitchen)", unit: "sq ft", rate: 50 },
  { description: "Wall Plastering (Internal)", unit: "sq ft", rate: 18 },
  { description: "Wall Plastering (External)", unit: "sq ft", rate: 22 },
  { description: "Wall Putty Application", unit: "sq ft", rate: 12 },
  // Painting
  { description: "Interior Painting (Emulsion)", unit: "sq ft", rate: 15 },
  { description: "Exterior Painting", unit: "sq ft", rate: 20 },
  { description: "Enamel Paint (Woodwork)", unit: "sq ft", rate: 25 },
  { description: "Texture Paint", unit: "sq ft", rate: 30 },
  // Waterproofing
  { description: "Waterproofing (Terrace)", unit: "sq ft", rate: 35 },
  { description: "Waterproofing (Bathroom)", unit: "sq ft", rate: 40 },
  { description: "Waterproofing (External Wall)", unit: "sq ft", rate: 28 },
  // Plumbing
  { description: "CPVC Pipe (1/2 inch)", unit: "running ft", rate: 80 },
  { description: "CPVC Pipe (3/4 inch)", unit: "running ft", rate: 110 },
  { description: "PVC Drainage Pipe (4 inch)", unit: "running ft", rate: 95 },
  { description: "Wash Basin Installation", unit: "units", rate: 1200 },
  { description: "WC (Commode) Installation", unit: "units", rate: 1800 },
  { description: "Shower Installation", unit: "units", rate: 800 },
  { description: "Tap/Faucet Installation", unit: "units", rate: 350 },
  // Electrical
  { description: "Electrical Wiring (Copper)", unit: "running ft", rate: 45 },
  { description: "Switch Board Installation", unit: "units", rate: 650 },
  { description: "Fan Point Wiring", unit: "units", rate: 350 },
  { description: "Light Point Wiring", unit: "units", rate: 280 },
  { description: "AC Point Wiring", unit: "units", rate: 900 },
  { description: "MCB Board Installation", unit: "units", rate: 2500 },
  // Carpentry
  { description: "Door Frame (Teak Wood)", unit: "units", rate: 4500 },
  { description: "Door Shutter (Flush)", unit: "units", rate: 3500 },
  { description: "Window Frame with Glass", unit: "units", rate: 3800 },
  { description: "Wooden Cupboard (per sq ft)", unit: "sq ft", rate: 850 },
  {
    description: "Kitchen Cabinet (per running ft)",
    unit: "running ft",
    rate: 1800,
  },
  { description: "False Ceiling (Gypsum Board)", unit: "sq ft", rate: 75 },
  { description: "False Ceiling (POP)", unit: "sq ft", rate: 55 },
  // Masonry
  { description: "Brick Masonry (9 inch wall)", unit: "sq ft", rate: 28 },
  { description: "Brick Masonry (4.5 inch wall)", unit: "sq ft", rate: 18 },
  { description: "RCC Slab Work", unit: "sq ft", rate: 180 },
  { description: "Column Construction", unit: "units", rate: 8500 },
  { description: "Beam Construction", unit: "running ft", rate: 950 },
  // Miscellaneous
  { description: "Grills/Railings (MS)", unit: "sq ft", rate: 150 },
  { description: "Grills/Railings (SS)", unit: "sq ft", rate: 280 },
  { description: "Staircase (per step)", unit: "units", rate: 2200 },
  { description: "Site Cleaning & Debris Removal", unit: "units", rate: 5000 },
  { description: "Labour Charges (General)", unit: "units", rate: 600 },
];
