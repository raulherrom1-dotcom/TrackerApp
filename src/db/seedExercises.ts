import type { Exercise } from '../types'

const base = (id: string, name: string, muscleGroup: Exercise['muscleGroup']): Exercise => ({
  id,
  name,
  muscleGroup,
  isCustom: false,
})

export const seedExercises: Exercise[] = [
  // Pecho
  base('press-de-banca', 'Press de banca', 'Pecho'),
  base('press-banca-inclinado', 'Press de banca inclinado', 'Pecho'),
  base('press-banca-declinado', 'Press de banca declinado', 'Pecho'),
  base('press-mancuernas', 'Press con mancuernas', 'Pecho'),
  base('aperturas-mancuernas', 'Aperturas con mancuernas', 'Pecho'),
  base('fondos-paralelas', 'Fondos en paralelas', 'Pecho'),
  base('cruce-poleas', 'Cruce de poleas', 'Pecho'),
  base('flexiones', 'Flexiones de pecho', 'Pecho'),

  // Espalda
  base('dominadas', 'Dominadas', 'Espalda'),
  base('remo-con-barra', 'Remo con barra', 'Espalda'),
  base('remo-mancuerna', 'Remo con mancuerna', 'Espalda'),
  base('remo-polea-baja', 'Remo en polea baja', 'Espalda'),
  base('jalon-al-pecho', 'Jalón al pecho', 'Espalda'),
  base('peso-muerto', 'Peso muerto', 'Espalda'),
  base('hiperextensiones', 'Hiperextensiones', 'Espalda'),
  base('remo-en-maquina', 'Remo en máquina', 'Espalda'),

  // Pierna
  base('sentadilla', 'Sentadilla', 'Pierna'),
  base('prensa-de-piernas', 'Prensa de piernas', 'Pierna'),
  base('zancadas', 'Zancadas', 'Pierna'),
  base('peso-muerto-rumano', 'Peso muerto rumano', 'Pierna'),
  base('extension-cuadriceps', 'Extensión de cuádriceps', 'Pierna'),
  base('curl-femoral', 'Curl femoral', 'Pierna'),
  base('elevacion-de-talones', 'Elevación de talones (gemelos)', 'Pierna'),
  base('sentadilla-bulgara', 'Sentadilla búlgara', 'Pierna'),
  base('hip-thrust', 'Hip thrust', 'Pierna'),

  // Hombro
  base('press-militar', 'Press militar', 'Hombro'),
  base('press-hombros-mancuernas', 'Press de hombros con mancuernas', 'Hombro'),
  base('elevaciones-laterales', 'Elevaciones laterales', 'Hombro'),
  base('elevaciones-frontales', 'Elevaciones frontales', 'Hombro'),
  base('pajaros', 'Pájaros (deltoide posterior)', 'Hombro'),
  base('press-arnold', 'Press Arnold', 'Hombro'),
  base('encogimientos-trapecio', 'Encogimientos de trapecio', 'Hombro'),

  // Brazo
  base('curl-biceps-barra', 'Curl de bíceps con barra', 'Brazo'),
  base('curl-biceps-mancuernas', 'Curl de bíceps con mancuernas', 'Brazo'),
  base('curl-martillo', 'Curl martillo', 'Brazo'),
  base('press-frances', 'Press francés', 'Brazo'),
  base('extension-triceps-polea', 'Extensión de tríceps en polea', 'Brazo'),
  base('fondos-triceps', 'Fondos de tríceps', 'Brazo'),
  base('curl-concentrado', 'Curl concentrado', 'Brazo'),

  // Core
  base('plancha', 'Plancha', 'Core'),
  base('crunch-abdominal', 'Crunch abdominal', 'Core'),
  base('elevacion-piernas', 'Elevación de piernas', 'Core'),
  base('rueda-abdominal', 'Rueda abdominal', 'Core'),
  base('giro-ruso', 'Giro ruso', 'Core'),
  base('plancha-lateral', 'Plancha lateral', 'Core'),

  // Cardio
  base('cinta-de-correr', 'Cinta de correr', 'Cardio'),
  base('bicicleta-estatica', 'Bicicleta estática', 'Cardio'),
  base('remo-cardio', 'Remo (máquina de cardio)', 'Cardio'),
  base('eliptica', 'Elíptica', 'Cardio'),
  base('cuerda-para-saltar', 'Cuerda para saltar', 'Cardio'),
]
