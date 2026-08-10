export type DivisionTeam = { id: string; name: string; shortName: string; crestId: number; strength: number };

export const DIVISION_TEAMS: Record<string, DivisionTeam[]> = {
  "Liga Profesional": [
    ["river", "River Plate", "RIV", 3211, 93], ["racing", "Racing Club", "RAC", 3215, 88], ["lanus", "Lanús", "LAN", 3218, 84], ["boca", "Boca Juniors", "BOC", 3202, 91],
    ["independiente", "Independiente", "IND", 3209, 82], ["san_lorenzo", "San Lorenzo", "CAS", 3201, 81], ["velez", "Vélez Sarsfield", "VEL", 3208, 83], ["argentinos", "Argentinos Juniors", "ARG", 3216, 82],
    ["platense", "Platense", "PLA", 36837, 76], ["estudiantes", "Estudiantes LP", "EST", 3206, 86], ["gimnasia", "Gimnasia LP", "GEL", 3205, 78], ["central", "Rosario Central", "CEN", 3217, 83],
    ["newells", "Newell's Old Boys", "NOB", 3212, 77], ["talleres", "Talleres", "TAL", 3210, 84], ["belgrano", "Belgrano", "BEL", 3203, 84], ["defensa", "Defensa y Justicia", "DYJ", 36839, 79],
    ["banfield", "Banfield", "BAN", 3219, 72], ["godoy", "Godoy Cruz", "GOD", 6074, 78],
  ].map(([id,name,shortName,crestId,strength]) => ({ id, name, shortName, crestId, strength })) as DivisionTeam[],
  "Primera B": [
    ["acassuso", "Acassuso", "ACA", 112491, 54], ["argentino_q", "Argentino de Quilmes", "ARQ", 194523, 55], ["armenio", "Deportivo Armenio", "ARM", 93105, 57], ["brown_a", "Brown de Adrogué", "BRO", 107201, 58],
    ["comunicaciones", "Comunicaciones", "COM", 112501, 55], ["dock_sud", "Dock Sud", "DOC", 270405, 54], ["excursionistas", "Excursionistas", "EXC", 65672, 56], ["flandria", "Flandria", "FLA", 112505, 57],
    ["laferrere", "Deportivo Laferrere", "LAF", 228062, 54], ["merlo", "Deportivo Merlo", "MER", 36840, 55], ["sacachispas", "Sacachispas", "SAC", 184969, 52], ["san_martin_b", "San Martín de Burzaco", "SMB", 269780, 53],
    ["talleres_re", "Talleres (RE)", "TRE", 201162, 59], ["uai", "UAI Urquiza", "UAI", 112507, 56], ["villa_dalmine", "Villa Dálmine", "VDM", 112509, 56], ["villa_sc", "Villa San Carlos", "VSC", 107199, 55],
    ["los_andes", "Los Andes", "AND", 112497, 60], ["argentino_m", "Argentino de Merlo", "AME", 199311, 57],
  ].map(([id,name,shortName,crestId,strength]) => ({ id, name, shortName, crestId, strength })) as DivisionTeam[],
  "Primera Nacional": [
    ["atlanta", "Atlanta", "ATL", 53799, 62], ["chacarita", "Chacarita Juniors", "CHA", 3214, 64], ["quilmes", "Quilmes", "QUI", 4936, 67], ["ferro", "Ferro", "FER", 36841, 64],
    ["all_boys", "All Boys", "ALL", 36834, 60], ["almirante", "Almirante Brown", "ALM", 43740, 58], ["chicago", "Nueva Chicago", "CHI", 3200, 65], ["san_martin_t", "San Martín (T)", "SMT", 23950, 70],
    ["gimnasia_m", "Gimnasia (M)", "GIM", 188441, 68], ["madryn", "Deportivo Madryn", "MAD", 222120, 65], ["colon", "Colón", "COL", 3207, 72], ["patronato", "Patronato", "PAT", 43741, 67],
    ["temperley", "Temperley", "TEM", 112499, 62], ["moron", "Deportivo Morón", "MOR", 93109, 61], ["estudiantes_rc", "Estudiantes (RC)", "ERC", 266694, 64], ["gimnasia_j", "Gimnasia (J)", "GIJ", 5292, 63],
    ["mitre", "Mitre (SdE)", "MIT", 255425, 59], ["defensores", "Defensores de Belgrano", "DEF", 52215, 62],
  ].map(([id,name,shortName,crestId,strength]) => ({ id, name, shortName, crestId, strength })) as DivisionTeam[],
  "Federal A": [
    ["germinal", "Germinal", "GER", 464795, 48], ["sol_de_mayo", "Sol de Mayo", "SOL", 254166, 46], ["douglas", "Douglas Haig", "DOU", 76199, 55], ["olimpo", "Olimpo", "OLI", 3222, 61],
    ["villa_mitre", "Villa Mitre", "VIM", 226815, 59], ["cipolletti", "Cipolletti", "CIP", 255427, 53], ["santamarina", "Santamarina", "SAN", 165912, 52], ["rincon", "Deportivo Rincón", "RIN", 285745, 47],
    ["bolivar", "Ciudad de Bolívar", "BOL", 340432, 58], ["monte_maiz", "Argentino Monte Maíz", "AMM", 403460, 56], ["sportivo_b", "Sportivo Belgrano", "SPB", 65664, 56], ["juventud_sl", "Juventud Unida (SL)", "JUV", 273210, 52],
    ["central_norte", "Central Norte", "CNO", 255426, 57], ["sarmiento_r", "Sarmiento (R)", "SAR", 376888, 51], ["boca_unidos", "Boca Unidos", "BUN", 36835, 54], ["crucero", "Crucero del Norte", "CRU", 73364, 49],
    ["san_martin_f", "San Martín (F)", "SMF", 314629, 53], ["antoniana", "Juventud Antoniana", "JAN", 93519, 55],
  ].map(([id,name,shortName,crestId,strength]) => ({ id, name, shortName, crestId, strength })) as DivisionTeam[],
  "Primera C": [
    ["ituzaingo", "Ituzaingó", "ITU", 265447, 45], ["midland", "Ferrocarril Midland", "MID", 270344, 48], ["lamadrid", "General Lamadrid", "LAM", 266134, 43], ["berazategui", "Berazategui", "BER", 269781, 50],
    ["lujan", "Luján", "LUJ", 250840, 47], ["argentino_r", "Argentino de Rosario", "ARR", 266184, 44], ["central_c", "Central Córdoba (R)", "CCR", 211939, 49], ["espanol", "Deportivo Español", "ESP", 165914, 48],
    ["barracas", "Sportivo Barracas", "SBA", 200658, 45], ["claypole", "Claypole", "CLA", 266186, 47], ["real_pilar", "Real Pilar", "RPI", 266250, 53], ["jj_urquiza", "J. J. Urquiza", "JJU", 201161, 49],
    ["porvenir", "El Porvenir", "POR", 270343, 44], ["muniz", "Muñiz", "MUÑ", 266136, 42], ["alem", "Leandro N. Alem", "ALE", 254169, 46], ["yupanqui", "Yupanqui", "YUP", 266137, 41],
    ["cambaceres", "Cambaceres", "CAM", 248679, 45], ["victoriano", "Victoriano Arenas", "VIC", 266830, 43],
  ].map(([id,name,shortName,crestId,strength]) => ({ id, name, shortName, crestId, strength })) as DivisionTeam[],
};

export const NEXT_DIVISION: Record<string, string | undefined> = {
  "Primera C": "Primera B",
  "Primera B": "Primera Nacional",
  "Federal A": "Primera Nacional",
  "Primera Nacional": "Liga Profesional",
  "Liga Profesional": undefined,
};

export const DIVISION_TIER: Record<string, number> = { "Liga Profesional": 1, "Primera Nacional": 2, "Primera B": 3, "Federal A": 4, "Primera C": 5 };

export const crestUrl = (crestId: number) => `/crests/${crestId}.png`;
