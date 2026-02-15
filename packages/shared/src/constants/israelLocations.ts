export enum IsraelArea {
  NORTH = 'NORTH',
  HAIFA = 'HAIFA',
  CENTER = 'CENTER',
  TEL_AVIV = 'TEL_AVIV',
  JERUSALEM = 'JERUSALEM',
  SOUTH = 'SOUTH',
  JUDEA_SAMARIA = 'JUDEA_SAMARIA',
  SHARON = 'SHARON',
  SHFELA = 'SHFELA',
}

export const israelAreaLabels: Record<IsraelArea, string> = {
  [IsraelArea.NORTH]: 'צפון',
  [IsraelArea.HAIFA]: 'חיפה',
  [IsraelArea.CENTER]: 'מרכז',
  [IsraelArea.TEL_AVIV]: 'תל אביב',
  [IsraelArea.JERUSALEM]: 'ירושלים',
  [IsraelArea.SOUTH]: 'דרום',
  [IsraelArea.JUDEA_SAMARIA]: 'יהודה ושומרון',
  [IsraelArea.SHARON]: 'שרון',
  [IsraelArea.SHFELA]: 'שפלה',
};
