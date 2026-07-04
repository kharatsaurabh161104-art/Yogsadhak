export interface Batch {
  id: string;
  time: string;
  location: string;
  type: "morning" | "evening";
  residentsOnly?: boolean;
  childrenOnly?: boolean;
}

export const BATCHES: Batch[] = [
  {
    id: "VS-MORNING",
    time: "06:00 AM – 07:00 AM",
    location: "Vrindavan Shrushti Club House",
    type: "morning",
    residentsOnly: true,
  },
  {
    id: "GURUKUL-MORNING",
    time: "07:10 AM – 08:00 AM",
    location: "GURUKUL IIT ACADEMY Narhe",
    type: "morning",
    residentsOnly: false,
  },
  {
    id: "VS-EVENING-CHILDREN",
    time: "05:00 PM – 06:00 PM",
    location: "Vrindavan Shrushti Club House",
    type: "evening",
    childrenOnly: true,
  },
  {
    id: "GURUKUL-EVENING",
    time: "07:00 PM – 08:00 PM",
    location: "GURUKUL IIT ACADEMY Narhe",
    type: "evening",
    residentsOnly: false,
  },
];

export function getBatchById(id: string): Batch | undefined {
  return BATCHES.find((b) => b.id === id);
}
