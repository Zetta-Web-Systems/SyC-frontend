import type { MemberRiskFlag } from "@features/clinicalProfiles";

function daysAgo(days: number, hour = 10): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export const mockPainEvolutionRiskFlags: MemberRiskFlag[] = [
  {
    id: "mock-flag-shoulders",
    notes: "Tendinitis hombro derecho",
    isActive: true,
    riskFlag: {
      id: "rf-shoulders",
      name: "Tendinitis de hombro",
      affectedZones: ["deltoids"],
      isActive: true,
    },
    currentStatus: [
      { id: "s1", painLevel: 6, bodyZone: "deltoids", side: "right", createdAt: daysAgo(85) },
      { id: "s2", painLevel: 7, bodyZone: "deltoids", side: "right", createdAt: daysAgo(75) },
      { id: "s3", painLevel: 7, bodyZone: "deltoids", side: "right", createdAt: daysAgo(60) },
      { id: "s4", painLevel: 8, bodyZone: "deltoids", side: "right", createdAt: daysAgo(45) },
      { id: "s5", painLevel: 7, bodyZone: "deltoids", side: "right", createdAt: daysAgo(30) },
      { id: "s6", painLevel: 8, bodyZone: "deltoids", side: "right", createdAt: daysAgo(15) },
      { id: "s7", painLevel: 8, bodyZone: "deltoids", side: "right", createdAt: daysAgo(5) },
      { id: "s8", painLevel: 8, bodyZone: "deltoids", side: "right", createdAt: daysAgo(1) },
    ],
  },
  {
    id: "mock-flag-knees",
    notes: "No flexionar la rodilla a más de 45 grados",
    isActive: true,
    riskFlag: {
      id: "rf-knees",
      name: "Distensión de rodilla",
      affectedZones: ["knees"],
      isActive: true,
    },
    currentStatus: [
      { id: "k1", painLevel: 7, bodyZone: "knees", side: "left", createdAt: daysAgo(85) },
      { id: "k2", painLevel: 6, bodyZone: "knees", side: "left", createdAt: daysAgo(70) },
      { id: "k3", painLevel: 6, bodyZone: "knees", side: "left", createdAt: daysAgo(55) },
      { id: "k4", painLevel: 5, bodyZone: "knees", side: "left", createdAt: daysAgo(40) },
      { id: "k5", painLevel: 5, bodyZone: "knees", side: "left", createdAt: daysAgo(25) },
      { id: "k6", painLevel: 4, bodyZone: "knees", side: "left", createdAt: daysAgo(10) },
      { id: "k7", painLevel: 4, bodyZone: "knees", side: "left", createdAt: daysAgo(2) },
      { id: "kr1", painLevel: 5, bodyZone: "knees", side: "right", createdAt: daysAgo(80) },
      { id: "kr2", painLevel: 5, bodyZone: "knees", side: "right", createdAt: daysAgo(65) },
      { id: "kr3", painLevel: 6, bodyZone: "knees", side: "right", createdAt: daysAgo(50) },
      { id: "kr4", painLevel: 5, bodyZone: "knees", side: "right", createdAt: daysAgo(35) },
      { id: "kr5", painLevel: 4, bodyZone: "knees", side: "right", createdAt: daysAgo(20) },
      { id: "kr6", painLevel: 3, bodyZone: "knees", side: "right", createdAt: daysAgo(7) },
      { id: "kr7", painLevel: 3, bodyZone: "knees", side: "right", createdAt: daysAgo(1) },
    ],
  },
  {
    id: "mock-flag-lumbar",
    notes: "Lumbalgia crónica",
    isActive: true,
    riskFlag: {
      id: "rf-lumbar",
      name: "Lumbalgia",
      affectedZones: ["lower-back"],
      isActive: true,
    },
    currentStatus: [
      { id: "l1", painLevel: 3, bodyZone: "lower-back", side: "right", createdAt: daysAgo(85) },
      { id: "l2", painLevel: 3, bodyZone: "lower-back", side: "right", createdAt: daysAgo(70) },
      { id: "l3", painLevel: 2, bodyZone: "lower-back", side: "right", createdAt: daysAgo(55) },
      { id: "l4", painLevel: 2, bodyZone: "lower-back", side: "right", createdAt: daysAgo(40) },
      { id: "l5", painLevel: 3, bodyZone: "lower-back", side: "right", createdAt: daysAgo(25) },
      { id: "l6", painLevel: 2, bodyZone: "lower-back", side: "right", createdAt: daysAgo(12) },
      { id: "l7", painLevel: 2, bodyZone: "lower-back", side: "right", createdAt: daysAgo(3) },
    ],
  },
  {
    id: "mock-flag-wrist",
    notes: "Esguince de muñeca ya recuperado",
    isActive: false,
    riskFlag: {
      id: "rf-wrist",
      name: "Esguince de muñeca (resuelto)",
      affectedZones: ["hands"],
      isActive: true,
    },
    currentStatus: [
      { id: "w1", painLevel: 6, bodyZone: "hands", side: "left", createdAt: daysAgo(80) },
      { id: "w2", painLevel: 5, bodyZone: "hands", side: "left", createdAt: daysAgo(65) },
      { id: "w3", painLevel: 3, bodyZone: "hands", side: "left", createdAt: daysAgo(45) },
      { id: "w4", painLevel: 1, bodyZone: "hands", side: "left", createdAt: daysAgo(30) },
    ],
  },
];
