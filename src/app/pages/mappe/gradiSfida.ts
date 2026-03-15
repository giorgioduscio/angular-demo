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
    classeArmatura: 12, // "<13" è interpretato come 12
    puntiFerita: 3.5, // Media tra 1 e 6
    bonusAttacco: 2, // "<+3" è interpretato come +2
    danniRound: 0.5, // Media tra 0 e 1
    dadiDanni: 0, // Nessun dado
    classeDifficolta_tiriSalvezza: 13
  },
  {
    gradoSfida: "1/8",
    bonusCompetenza: +2,
    classeArmatura: 13,
    puntiFerita: 21, // Media tra 7 e 35
    bonusAttacco: 3,
    danniRound: 2.5, // Media tra 2 e 3
    dadiDanni: 1, // Minimo di d4
    classeDifficolta_tiriSalvezza: 13
  },
  {
    gradoSfida: "1/4",
    bonusCompetenza: +2,
    classeArmatura: 13,
    puntiFerita: 42.5, // Media tra 36 e 49
    bonusAttacco: 3,
    danniRound: 4.5, // Media tra 4 e 5
    dadiDanni: 2, // Minimo di d4+1
    classeDifficolta_tiriSalvezza: 13
  },
  {
    gradoSfida: "1/2",
    bonusCompetenza: +2,
    classeArmatura: 13,
    puntiFerita: 60, // Media tra 50 e 70
    bonusAttacco: 3,
    danniRound: 7, // Media tra 6 e 8
    dadiDanni: 2, // Minimo di d6+1
    classeDifficolta_tiriSalvezza: 13
  },
  {
    gradoSfida: "1",
    bonusCompetenza: +2,
    classeArmatura: 13,
    puntiFerita: 78, // Media tra 71 e 85
    bonusAttacco: 3,
    danniRound: 11.5, // Media tra 9 e 14
    dadiDanni: 2, // Minimo di d12+1
    classeDifficolta_tiriSalvezza: 13
  },
  {
    gradoSfida: "2",
    bonusCompetenza: +2,
    classeArmatura: 13,
    puntiFerita: 93, // Media tra 86 e 100
    bonusAttacco: 3,
    danniRound: 17.5, // Media tra 15 e 20
    dadiDanni: 2, // Minimo di 2d10
    classeDifficolta_tiriSalvezza: 13
  },
  {
    gradoSfida: "3",
    bonusCompetenza: +2,
    classeArmatura: 13,
    puntiFerita: 108, // Media tra 101 e 115
    bonusAttacco: 4,
    danniRound: 23.5, // Media tra 21 e 26
    dadiDanni: 3, // Minimo di 2d12
    classeDifficolta_tiriSalvezza: 13
  },
  {
    gradoSfida: "4",
    bonusCompetenza: +2,
    classeArmatura: 14,
    puntiFerita: 123, // Media tra 116 e 130
    bonusAttacco: 5,
    danniRound: 29.5, // Media tra 27 e 32
    dadiDanni: 4, // Minimo di 3d10+1
    classeDifficolta_tiriSalvezza: 14
  },
  {
    gradoSfida: "5",
    bonusCompetenza: +3,
    classeArmatura: 15,
    puntiFerita: 138, // Media tra 131 e 145
    bonusAttacco: 6,
    danniRound: 35.5, // Media tra 33 e 38
    dadiDanni: 6, // Minimo di 3d12+3
    classeDifficolta_tiriSalvezza: 15
  },
  {
    gradoSfida: "6",
    bonusCompetenza: +3,
    classeArmatura: 15,
    puntiFerita: 153, // Media tra 146 e 160
    bonusAttacco: 6,
    danniRound: 41.5, // Media tra 39 e 44
    dadiDanni: 6, // Minimo di 3d12+3
    classeDifficolta_tiriSalvezza: 15
  },
  {
    gradoSfida: "7",
    bonusCompetenza: +3,
    classeArmatura: 15,
    puntiFerita: 168, // Media tra 161 e 175
    bonusAttacco: 6,
    danniRound: 47.5, // Media tra 45 e 50
    dadiDanni: 5, // Minimo di 4d12
    classeDifficolta_tiriSalvezza: 15
  },
  {
    gradoSfida: "8",
    bonusCompetenza: +3,
    classeArmatura: 16,
    puntiFerita: 183, // Media tra 176 e 190
    bonusAttacco: 7,
    danniRound: 53.5, // Media tra 51 e 56
    dadiDanni: 6, // Minimo di 4d12+5
    classeDifficolta_tiriSalvezza: 16
  },
  {
    gradoSfida: "9",
    bonusCompetenza: +4,
    classeArmatura: 16,
    puntiFerita: 198, // Media tra 191 e 205
    bonusAttacco: 7,
    danniRound: 59.5, // Media tra 57 e 62
    dadiDanni: 6, // Minimo di 5d12
    classeDifficolta_tiriSalvezza: 16
  },
  {
    gradoSfida: "10",
    bonusCompetenza: +4,
    classeArmatura: 17,
    puntiFerita: 213, // Media tra 206 e 220
    bonusAttacco: 7,
    danniRound: 65.5, // Media tra 63 e 68
    dadiDanni: 7, // Minimo di 5d12+5
    classeDifficolta_tiriSalvezza: 16
  },
  {
    gradoSfida: "11",
    bonusCompetenza: +4,
    classeArmatura: 17,
    puntiFerita: 228, // Media tra 221 e 235
    bonusAttacco: 8,
    danniRound: 71.5, // Media tra 69 e 74
    dadiDanni: 7, // Minimo di 6d12
    classeDifficolta_tiriSalvezza: 17
  },
  {
    gradoSfida: "12",
    bonusCompetenza: +4,
    classeArmatura: 17,
    puntiFerita: 243, // Media tra 236 e 250
    bonusAttacco: 9,
    danniRound: 77.5, // Media tra 75 e 80
    dadiDanni: 8, // Minimo di 6d12+5
    classeDifficolta_tiriSalvezza: 17
  },
  {
    gradoSfida: "13",
    bonusCompetenza: +5,
    classeArmatura: 18,
    puntiFerita: 258, // Media tra 251 e 265
    bonusAttacco: 9,
    danniRound: 83.5, // Media tra 81 e 86
    dadiDanni: 8, // Minimo di 7d12
    classeDifficolta_tiriSalvezza: 18
  },
  {
    gradoSfida: "14",
    bonusCompetenza: +5,
    classeArmatura: 18,
    puntiFerita: 273, // Media tra 266 e 280
    bonusAttacco: 9,
    danniRound: 89.5, // Media tra 87 e 92
    dadiDanni: 9, // Minimo di 7d12+5
    classeDifficolta_tiriSalvezza: 18
  },
  {
    gradoSfida: "15",
    bonusCompetenza: +5,
    classeArmatura: 18,
    puntiFerita: 288, // Media tra 281 e 295
    bonusAttacco: 9,
    danniRound: 95.5, // Media tra 93 e 98
    dadiDanni: 9, // Minimo di 8d12
    classeDifficolta_tiriSalvezza: 18
  },
  {
    gradoSfida: "16",
    bonusCompetenza: +5,
    classeArmatura: 18,
    puntiFerita: 303, // Media tra 296 e 310
    bonusAttacco: 9,
    danniRound: 101.5, // Media tra 99 e 104
    dadiDanni: 10, // Minimo di 8d12+5
    classeDifficolta_tiriSalvezza: 18
  },
  {
    gradoSfida: "17",
    bonusCompetenza: +6,
    classeArmatura: 19,
    puntiFerita: 318, // Media tra 311 e 325
    bonusAttacco: 10,
    danniRound: 107.5, // Media tra 105 e 110
    dadiDanni: 10, // Minimo di 9d12
    classeDifficolta_tiriSalvezza: 19
  },
  {
    gradoSfida: "18",
    bonusCompetenza: +6,
    classeArmatura: 19,
    puntiFerita: 333, // Media tra 326 e 340
    bonusAttacco: 10,
    danniRound: 113.5, // Media tra 111 e 116
    dadiDanni: 11, // Minimo di 9d12+5
    classeDifficolta_tiriSalvezza: 19
  },
  {
    gradoSfida: "19",
    bonusCompetenza: +6,
    classeArmatura: 19,
    puntiFerita: 348, // Media tra 341 e 355
    bonusAttacco: 10,
    danniRound: 119.5, // Media tra 117 e 122
    dadiDanni: 11, // Minimo di 10d12
    classeDifficolta_tiriSalvezza: 19
  },
  {
    gradoSfida: "20",
    bonusCompetenza: +6,
    classeArmatura: 19,
    puntiFerita: 378, // Media tra 356 e 400
    bonusAttacco: 10,
    danniRound: 131.5, // Media tra 123 e 140
    dadiDanni: 12, // Minimo di 11d12
    classeDifficolta_tiriSalvezza: 19
  },
  {
    gradoSfida: "21",
    bonusCompetenza: +7,
    classeArmatura: 19,
    puntiFerita: 423, // Media tra 401 e 445
    bonusAttacco: 11,
    danniRound: 149.5, // Media tra 141 e 158
    dadiDanni: 14, // Minimo di 13d12
    classeDifficolta_tiriSalvezza: 20
  },
  {
    gradoSfida: "22",
    bonusCompetenza: +7,
    classeArmatura: 19,
    puntiFerita: 468, // Media tra 446 e 490
    bonusAttacco: 11,
    danniRound: 167.5, // Media tra 159 e 176
    dadiDanni: 15, // Minimo di 14d12
    classeDifficolta_tiriSalvezza: 20
  },
  {
    gradoSfida: "23",
    bonusCompetenza: +7,
    classeArmatura: 19,
    puntiFerita: 513, // Media tra 491 e 535
    bonusAttacco: 11,
    danniRound: 184.5, // Media tra 177 e 194
    dadiDanni: 16, // Minimo di 15d12
    classeDifficolta_tiriSalvezza: 20
  },
  {
    gradoSfida: "24",
    bonusCompetenza: +7,
    classeArmatura: 19,
    puntiFerita: 558, // Media tra 536 e 580
    bonusAttacco: 12,
    danniRound: 203.5, // Media tra 195 e 212
    dadiDanni: 18, // Minimo di 17d12+5
    classeDifficolta_tiriSalvezza: 21
  },
  {
    gradoSfida: "25",
    bonusCompetenza: +8,
    classeArmatura: 19,
    puntiFerita: 603, // Media tra 581 e 625
    bonusAttacco: 12,
    danniRound: 221.5, // Media tra 213 e 230
    dadiDanni: 20, // Minimo di 19d12
    classeDifficolta_tiriSalvezza: 21
  },
  {
    gradoSfida: "26",
    bonusCompetenza: +8,
    classeArmatura: 19,
    puntiFerita: 648, // Media tra 626 e 670
    bonusAttacco: 12,
    danniRound: 239.5, // Media tra 231 e 248
    dadiDanni: 21, // Minimo di 20d12
    classeDifficolta_tiriSalvezza: 21
  },
  {
    gradoSfida: "27",
    bonusCompetenza: +8,
    classeArmatura: 19,
    puntiFerita: 693, // Media tra 671 e 715
    bonusAttacco: 13,
    danniRound: 257.5, // Media tra 249 e 266
    dadiDanni: 23, // Minimo di 22d12
    classeDifficolta_tiriSalvezza: 22
  },
  {
    gradoSfida: "28",
    bonusCompetenza: +8,
    classeArmatura: 19,
    puntiFerita: 738, // Media tra 716 e 760
    bonusAttacco: 13,
    danniRound: 275.5, // Media tra 267 e 284
    dadiDanni: 24, // Minimo di 23d12+5
    classeDifficolta_tiriSalvezza: 22
  },
  {
    gradoSfida: "29",
    bonusCompetenza: +9,
    classeArmatura: 19,
    puntiFerita: 783, // Media tra 761 e 805
    bonusAttacco: 13,
    danniRound: 293.5, // Media tra 285 e 302
    dadiDanni: 26, // Minimo di 25d12
    classeDifficolta_tiriSalvezza: 22
  },
  {
    gradoSfida: "30",
    bonusCompetenza: +9,
    classeArmatura: 19,
    puntiFerita: 828, // Media tra 806 e 850
    bonusAttacco: 14,
    danniRound: 311.5, // Media tra 303 e 320
    dadiDanni: 27, // Minimo di 26d12+3
    classeDifficolta_tiriSalvezza: 23
  }
] as const;

