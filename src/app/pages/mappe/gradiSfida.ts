export interface StatisticheGradoSfida {
  gradoSfida: string;
  bonusCompetenza: number;
  classeArmatura: number;
  puntiFerita: number;
  bonusAttacco: number;
  danniRound: number;
  dadiDanni: number;
  classeDifficolta_tiriSalvezza: number;
}

export const statisticheGradoSfida: StatisticheGradoSfida[] = [
  {
    gradoSfida: "0",
    bonusCompetenza: +2,
    classeArmatura: 12,
    puntiFerita: 4, // Arrotondato per eccesso da 3.5
    bonusAttacco: 2,
    danniRound: 1, // Arrotondato per eccesso da 0.5
    dadiDanni: 0,
    classeDifficolta_tiriSalvezza: 13
  },
  {
    gradoSfida: "1/8",
    bonusCompetenza: +2,
    classeArmatura: 13,
    puntiFerita: 21,
    bonusAttacco: 3,
    danniRound: 3, // Arrotondato per eccesso da 2.5
    dadiDanni: 1,
    classeDifficolta_tiriSalvezza: 13
  },
  {
    gradoSfida: "1/4",
    bonusCompetenza: +2,
    classeArmatura: 13,
    puntiFerita: 43, // Arrotondato per eccesso da 42.5
    bonusAttacco: 3,
    danniRound: 5, // Arrotondato per eccesso da 4.5
    dadiDanni: 2,
    classeDifficolta_tiriSalvezza: 13
  },
  {
    gradoSfida: "1/2",
    bonusCompetenza: +2,
    classeArmatura: 13,
    puntiFerita: 60,
    bonusAttacco: 3,
    danniRound: 8, // Arrotondato per eccesso da 7
    dadiDanni: 2,
    classeDifficolta_tiriSalvezza: 13
  },
  {
    gradoSfida: "1",
    bonusCompetenza: +2,
    classeArmatura: 13,
    puntiFerita: 78,
    bonusAttacco: 3,
    danniRound: 12, // Arrotondato per eccesso da 11.5
    dadiDanni: 2,
    classeDifficolta_tiriSalvezza: 13
  },
  {
    gradoSfida: "2",
    bonusCompetenza: +2,
    classeArmatura: 13,
    puntiFerita: 93,
    bonusAttacco: 3,
    danniRound: 18, // Arrotondato per eccesso da 17.5
    dadiDanni: 2,
    classeDifficolta_tiriSalvezza: 13
  },
  {
    gradoSfida: "3",
    bonusCompetenza: +2,
    classeArmatura: 13,
    puntiFerita: 108,
    bonusAttacco: 4,
    danniRound: 24, // Arrotondato per eccesso da 23.5
    dadiDanni: 3,
    classeDifficolta_tiriSalvezza: 13
  },
  {
    gradoSfida: "4",
    bonusCompetenza: +2,
    classeArmatura: 14,
    puntiFerita: 123,
    bonusAttacco: 5,
    danniRound: 30, // Arrotondato per eccesso da 29.5
    dadiDanni: 4,
    classeDifficolta_tiriSalvezza: 14
  },
  {
    gradoSfida: "5",
    bonusCompetenza: +3,
    classeArmatura: 15,
    puntiFerita: 138,
    bonusAttacco: 6,
    danniRound: 36, // Arrotondato per eccesso da 35.5
    dadiDanni: 6,
    classeDifficolta_tiriSalvezza: 15
  },
  {
    gradoSfida: "6",
    bonusCompetenza: +3,
    classeArmatura: 15,
    puntiFerita: 153,
    bonusAttacco: 6,
    danniRound: 42, // Arrotondato per eccesso da 41.5
    dadiDanni: 6,
    classeDifficolta_tiriSalvezza: 15
  },
  {
    gradoSfida: "7",
    bonusCompetenza: +3,
    classeArmatura: 15,
    puntiFerita: 168,
    bonusAttacco: 6,
    danniRound: 48, // Arrotondato per eccesso da 47.5
    dadiDanni: 5,
    classeDifficolta_tiriSalvezza: 15
  },
  {
    gradoSfida: "8",
    bonusCompetenza: +3,
    classeArmatura: 16,
    puntiFerita: 183,
    bonusAttacco: 7,
    danniRound: 54, // Arrotondato per eccesso da 53.5
    dadiDanni: 6,
    classeDifficolta_tiriSalvezza: 16
  },
  {
    gradoSfida: "9",
    bonusCompetenza: +4,
    classeArmatura: 16,
    puntiFerita: 198,
    bonusAttacco: 7,
    danniRound: 60, // Arrotondato per eccesso da 59.5
    dadiDanni: 6,
    classeDifficolta_tiriSalvezza: 16
  },
  {
    gradoSfida: "10",
    bonusCompetenza: +4,
    classeArmatura: 17,
    puntiFerita: 213,
    bonusAttacco: 7,
    danniRound: 66, // Arrotondato per eccesso da 65.5
    dadiDanni: 7,
    classeDifficolta_tiriSalvezza: 16
  },
  {
    gradoSfida: "11",
    bonusCompetenza: +4,
    classeArmatura: 17,
    puntiFerita: 228,
    bonusAttacco: 8,
    danniRound: 72, // Arrotondato per eccesso da 71.5
    dadiDanni: 7,
    classeDifficolta_tiriSalvezza: 17
  },
  {
    gradoSfida: "12",
    bonusCompetenza: +4,
    classeArmatura: 17,
    puntiFerita: 243,
    bonusAttacco: 9,
    danniRound: 78, // Arrotondato per eccesso da 77.5
    dadiDanni: 8,
    classeDifficolta_tiriSalvezza: 17
  },
  {
    gradoSfida: "13",
    bonusCompetenza: +5,
    classeArmatura: 18,
    puntiFerita: 258,
    bonusAttacco: 9,
    danniRound: 84, // Arrotondato per eccesso da 83.5
    dadiDanni: 8,
    classeDifficolta_tiriSalvezza: 18
  },
  {
    gradoSfida: "14",
    bonusCompetenza: +5,
    classeArmatura: 18,
    puntiFerita: 273,
    bonusAttacco: 9,
    danniRound: 90, // Arrotondato per eccesso da 89.5
    dadiDanni: 9,
    classeDifficolta_tiriSalvezza: 18
  },
  {
    gradoSfida: "15",
    bonusCompetenza: +5,
    classeArmatura: 18,
    puntiFerita: 288,
    bonusAttacco: 9,
    danniRound: 96, // Arrotondato per eccesso da 95.5
    dadiDanni: 9,
    classeDifficolta_tiriSalvezza: 18
  },
  {
    gradoSfida: "16",
    bonusCompetenza: +5,
    classeArmatura: 18,
    puntiFerita: 303,
    bonusAttacco: 9,
    danniRound: 102, // Arrotondato per eccesso da 101.5
    dadiDanni: 10,
    classeDifficolta_tiriSalvezza: 18
  },
  {
    gradoSfida: "17",
    bonusCompetenza: +6,
    classeArmatura: 19,
    puntiFerita: 318,
    bonusAttacco: 10,
    danniRound: 108, // Arrotondato per eccesso da 107.5
    dadiDanni: 10,
    classeDifficolta_tiriSalvezza: 19
  },
  {
    gradoSfida: "18",
    bonusCompetenza: +6,
    classeArmatura: 19,
    puntiFerita: 333,
    bonusAttacco: 10,
    danniRound: 114, // Arrotondato per eccesso da 113.5
    dadiDanni: 11,
    classeDifficolta_tiriSalvezza: 19
  },
  {
    gradoSfida: "19",
    bonusCompetenza: +6,
    classeArmatura: 19,
    puntiFerita: 348,
    bonusAttacco: 10,
    danniRound: 120, // Arrotondato per eccesso da 119.5
    dadiDanni: 11,
    classeDifficolta_tiriSalvezza: 19
  },
  {
    gradoSfida: "20",
    bonusCompetenza: +6,
    classeArmatura: 19,
    puntiFerita: 378,
    bonusAttacco: 10,
    danniRound: 132, // Arrotondato per eccesso da 131.5
    dadiDanni: 12,
    classeDifficolta_tiriSalvezza: 19
  },
  {
    gradoSfida: "21",
    bonusCompetenza: +7,
    classeArmatura: 19,
    puntiFerita: 423,
    bonusAttacco: 11,
    danniRound: 150, // Arrotondato per eccesso da 149.5
    dadiDanni: 14,
    classeDifficolta_tiriSalvezza: 20
  },
  {
    gradoSfida: "22",
    bonusCompetenza: +7,
    classeArmatura: 19,
    puntiFerita: 468,
    bonusAttacco: 11,
    danniRound: 168, // Arrotondato per eccesso da 167.5
    dadiDanni: 15,
    classeDifficolta_tiriSalvezza: 20
  },
  {
    gradoSfida: "23",
    bonusCompetenza: +7,
    classeArmatura: 19,
    puntiFerita: 513,
    bonusAttacco: 11,
    danniRound: 185, // Arrotondato per eccesso da 184.5
    dadiDanni: 16,
    classeDifficolta_tiriSalvezza: 20
  },
  {
    gradoSfida: "24",
    bonusCompetenza: +7,
    classeArmatura: 19,
    puntiFerita: 558,
    bonusAttacco: 12,
    danniRound: 204, // Arrotondato per eccesso da 203.5
    dadiDanni: 18,
    classeDifficolta_tiriSalvezza: 21
  },
  {
    gradoSfida: "25",
    bonusCompetenza: +8,
    classeArmatura: 19,
    puntiFerita: 603,
    bonusAttacco: 12,
    danniRound: 222, // Arrotondato per eccesso da 221.5
    dadiDanni: 20,
    classeDifficolta_tiriSalvezza: 21
  },
  {
    gradoSfida: "26",
    bonusCompetenza: +8,
    classeArmatura: 19,
    puntiFerita: 648,
    bonusAttacco: 12,
    danniRound: 240, // Arrotondato per eccesso da 239.5
    dadiDanni: 21,
    classeDifficolta_tiriSalvezza: 21
  },
  {
    gradoSfida: "27",
    bonusCompetenza: +8,
    classeArmatura: 19,
    puntiFerita: 693,
    bonusAttacco: 13,
    danniRound: 258, // Arrotondato per eccesso da 257.5
    dadiDanni: 23,
    classeDifficolta_tiriSalvezza: 22
  },
  {
    gradoSfida: "28",
    bonusCompetenza: +8,
    classeArmatura: 19,
    puntiFerita: 738,
    bonusAttacco: 13,
    danniRound: 276, // Arrotondato per eccesso da 275.5
    dadiDanni: 24,
    classeDifficolta_tiriSalvezza: 22
  },
  {
    gradoSfida: "29",
    bonusCompetenza: +9,
    classeArmatura: 19,
    puntiFerita: 783,
    bonusAttacco: 13,
    danniRound: 294, // Arrotondato per eccesso da 293.5
    dadiDanni: 26,
    classeDifficolta_tiriSalvezza: 22
  },
  {
    gradoSfida: "30",
    bonusCompetenza: +9,
    classeArmatura: 19,
    puntiFerita: 828,
    bonusAttacco: 14,
    danniRound: 312, // Arrotondato per eccesso da 311.5
    dadiDanni: 27,
    classeDifficolta_tiriSalvezza: 23
  }
] as const;
