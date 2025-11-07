// Practice quiz data for each class-exam combination

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation?: string;
  chapter: string;
}

export interface ChapterQuiz {
  chapterName: string;
  questions: QuizQuestion[];
}

export interface ClassExamQuizzes {
  chapters: ChapterQuiz[];
}

// Quiz data structure for all class-exam combinations
export const PREPOMETER_QUIZZES: Record<string, Record<string, ClassExamQuizzes>> = {
  '8': {
    'Board Exam': {
      chapters: [
        {
          chapterName: 'Mathematics - Algebra',
          questions: [
            {
              id: '8-board-math-1',
              question: 'What is the value of x in the equation 2x + 5 = 15?',
              options: [
                { id: 'a', text: '5', isCorrect: true },
                { id: 'b', text: '10', isCorrect: false },
                { id: 'c', text: '7', isCorrect: false },
                { id: 'd', text: '8', isCorrect: false },
              ],
              explanation: '2x + 5 = 15, so 2x = 10, therefore x = 5',
              chapter: 'Mathematics - Algebra',
            },
            {
              id: '8-board-math-2',
              question: 'Simplify: 3a + 2a - a',
              options: [
                { id: 'a', text: '4a', isCorrect: true },
                { id: 'b', text: '5a', isCorrect: false },
                { id: 'c', text: '6a', isCorrect: false },
                { id: 'd', text: '3a', isCorrect: false },
              ],
              explanation: '3a + 2a - a = (3 + 2 - 1)a = 4a',
              chapter: 'Mathematics - Algebra',
            },
            {
              id: '8-board-math-3',
              question: 'What is the coefficient of x in 5x + 3?',
              options: [
                { id: 'a', text: '5', isCorrect: true },
                { id: 'b', text: '3', isCorrect: false },
                { id: 'c', text: 'x', isCorrect: false },
                { id: 'd', text: '8', isCorrect: false },
              ],
              explanation: 'The coefficient is the number multiplied by the variable, which is 5',
              chapter: 'Mathematics - Algebra',
            },
            {
              id: '8-board-math-4',
              question: 'Solve: 3(x - 2) = 9',
              options: [
                { id: 'a', text: 'x = 5', isCorrect: true },
                { id: 'b', text: 'x = 3', isCorrect: false },
                { id: 'c', text: 'x = 7', isCorrect: false },
                { id: 'd', text: 'x = 1', isCorrect: false },
              ],
              explanation: '3(x - 2) = 9, so x - 2 = 3, therefore x = 5',
              chapter: 'Mathematics - Algebra',
            },
            {
              id: '8-board-math-5',
              question: 'What is the value of 2³?',
              options: [
                { id: 'a', text: '6', isCorrect: false },
                { id: 'b', text: '8', isCorrect: true },
                { id: 'c', text: '4', isCorrect: false },
                { id: 'd', text: '9', isCorrect: false },
              ],
              explanation: '2³ = 2 × 2 × 2 = 8',
              chapter: 'Mathematics - Algebra',
            },
          ].slice(0, 5),
        },
        {
          chapterName: 'Science - Force and Pressure',
          questions: [
            {
              id: '8-board-sci-1',
              question: 'What is the SI unit of force?',
              options: [
                { id: 'a', text: 'Newton', isCorrect: true },
                { id: 'b', text: 'Joule', isCorrect: false },
                { id: 'c', text: 'Watt', isCorrect: false },
                { id: 'd', text: 'Pascal', isCorrect: false },
              ],
              explanation: 'Force is measured in Newtons (N)',
              chapter: 'Science - Force and Pressure',
            },
            {
              id: '8-board-sci-2',
              question: 'What is pressure?',
              options: [
                { id: 'a', text: 'Force per unit area', isCorrect: true },
                { id: 'b', text: 'Force times area', isCorrect: false },
                { id: 'c', text: 'Mass per unit volume', isCorrect: false },
                { id: 'd', text: 'Distance per unit time', isCorrect: false },
              ],
              explanation: 'Pressure = Force / Area',
              chapter: 'Science - Force and Pressure',
            },
            {
              id: '8-board-sci-3',
              question: 'Which has more pressure: a sharp knife or a blunt knife?',
              options: [
                { id: 'a', text: 'Sharp knife', isCorrect: true },
                { id: 'b', text: 'Blunt knife', isCorrect: false },
                { id: 'c', text: 'Both have same', isCorrect: false },
                { id: 'd', text: 'Cannot determine', isCorrect: false },
              ],
              explanation: 'Sharp knife has smaller area, so more pressure for same force',
              chapter: 'Science - Force and Pressure',
            },
            {
              id: '8-board-sci-4',
              question: 'What happens to pressure when area increases?',
              options: [
                { id: 'a', text: 'Increases', isCorrect: false },
                { id: 'b', text: 'Decreases', isCorrect: true },
                { id: 'c', text: 'Remains same', isCorrect: false },
                { id: 'd', text: 'Becomes zero', isCorrect: false },
              ],
              explanation: 'Pressure is inversely proportional to area',
              chapter: 'Science - Force and Pressure',
            },
            {
              id: '8-board-sci-5',
              question: 'What is atmospheric pressure at sea level?',
              options: [
                { id: 'a', text: '101.3 kPa', isCorrect: true },
                { id: 'b', text: '50.6 kPa', isCorrect: false },
                { id: 'c', text: '202.6 kPa', isCorrect: false },
                { id: 'd', text: '75.9 kPa', isCorrect: false },
              ],
              explanation: 'Standard atmospheric pressure is approximately 101.3 kilopascals',
              chapter: 'Science - Force and Pressure',
            },
          ].slice(0, 5),
        },
      ],
    },
  },
  '11': {
    'JEE': {
      chapters: [
        {
          chapterName: 'Physics - Mechanics',
          questions: [
            {
              id: '11-jee-phy-1',
              question: 'A body is moving with constant velocity. What is the net force acting on it?',
              options: [
                { id: 'a', text: 'Zero', isCorrect: true },
                { id: 'b', text: 'Maximum', isCorrect: false },
                { id: 'c', text: 'Equal to weight', isCorrect: false },
                { id: 'd', text: 'Infinite', isCorrect: false },
              ],
              explanation: 'According to Newton\'s first law, constant velocity means zero net force',
              chapter: 'Physics - Mechanics',
            },
            {
              id: '11-jee-phy-2',
              question: 'What is the work done by a force F = 10N moving a body 5m in the direction of force?',
              options: [
                { id: 'a', text: '50 J', isCorrect: true },
                { id: 'b', text: '2 J', isCorrect: false },
                { id: 'c', text: '15 J', isCorrect: false },
                { id: 'd', text: '5 J', isCorrect: false },
              ],
              explanation: 'Work = Force × Displacement = 10N × 5m = 50 J',
              chapter: 'Physics - Mechanics',
            },
            {
              id: '11-jee-phy-3',
              question: 'A ball is thrown upward. At the highest point, what is its velocity?',
              options: [
                { id: 'a', text: 'Zero', isCorrect: true },
                { id: 'b', text: 'Maximum', isCorrect: false },
                { id: 'c', text: 'Equal to initial velocity', isCorrect: false },
                { id: 'd', text: 'Negative', isCorrect: false },
              ],
              explanation: 'At the highest point, vertical velocity becomes zero before the ball starts falling',
              chapter: 'Physics - Mechanics',
            },
            {
              id: '11-jee-phy-4',
              question: 'What is the formula for kinetic energy?',
              options: [
                { id: 'a', text: 'KE = ½mv²', isCorrect: true },
                { id: 'b', text: 'KE = mv²', isCorrect: false },
                { id: 'c', text: 'KE = 2mv²', isCorrect: false },
                { id: 'd', text: 'KE = mgh', isCorrect: false },
              ],
              explanation: 'Kinetic energy is given by KE = ½mv² where m is mass and v is velocity',
              chapter: 'Physics - Mechanics',
            },
            {
              id: '11-jee-phy-5',
              question: 'What is the unit of momentum?',
              options: [
                { id: 'a', text: 'kg m/s', isCorrect: true },
                { id: 'b', text: 'kg m/s²', isCorrect: false },
                { id: 'c', text: 'N m', isCorrect: false },
                { id: 'd', text: 'J/s', isCorrect: false },
              ],
              explanation: 'Momentum = mass × velocity, so unit is kg m/s',
              chapter: 'Physics - Mechanics',
            },
          ].slice(0, 5),
        },
        {
          chapterName: 'Chemistry - Organic Chemistry',
          questions: [
            {
              id: '11-jee-chem-1',
              question: 'What is the general formula for alkanes?',
              options: [
                { id: 'a', text: 'CnH2n+2', isCorrect: true },
                { id: 'b', text: 'CnH2n', isCorrect: false },
                { id: 'c', text: 'CnH2n-2', isCorrect: false },
                { id: 'd', text: 'CnHn', isCorrect: false },
              ],
              explanation: 'Alkanes are saturated hydrocarbons with formula CnH2n+2',
              chapter: 'Chemistry - Organic Chemistry',
            },
            {
              id: '11-jee-chem-2',
              question: 'What is the IUPAC name of CH₃CH₂CH₃?',
              options: [
                { id: 'a', text: 'Propane', isCorrect: true },
                { id: 'b', text: 'Ethane', isCorrect: false },
                { id: 'c', text: 'Butane', isCorrect: false },
                { id: 'd', text: 'Methane', isCorrect: false },
              ],
              explanation: 'Three carbon atoms in a chain makes it propane',
              chapter: 'Chemistry - Organic Chemistry',
            },
            {
              id: '11-jee-chem-3',
              question: 'What type of bond is present in alkenes?',
              options: [
                { id: 'a', text: 'Double bond', isCorrect: true },
                { id: 'b', text: 'Single bond', isCorrect: false },
                { id: 'c', text: 'Triple bond', isCorrect: false },
                { id: 'd', text: 'Ionic bond', isCorrect: false },
              ],
              explanation: 'Alkenes contain at least one carbon-carbon double bond',
              chapter: 'Chemistry - Organic Chemistry',
            },
            {
              id: '11-jee-chem-4',
              question: 'What is the functional group of alcohols?',
              options: [
                { id: 'a', text: '-OH', isCorrect: true },
                { id: 'b', text: '-COOH', isCorrect: false },
                { id: 'c', text: '-CHO', isCorrect: false },
                { id: 'd', text: '-NH₂', isCorrect: false },
              ],
              explanation: 'Alcohols contain the hydroxyl functional group (-OH)',
              chapter: 'Chemistry - Organic Chemistry',
            },
            {
              id: '11-jee-chem-5',
              question: 'What is the product of complete combustion of methane?',
              options: [
                { id: 'a', text: 'CO₂ and H₂O', isCorrect: true },
                { id: 'b', text: 'CO and H₂O', isCorrect: false },
                { id: 'c', text: 'C and H₂O', isCorrect: false },
                { id: 'd', text: 'CO₂ and H₂', isCorrect: false },
              ],
              explanation: 'CH₄ + 2O₂ → CO₂ + 2H₂O (complete combustion)',
              chapter: 'Chemistry - Organic Chemistry',
            },
          ].slice(0, 5),
        },
      ],
    },
    'NEET': {
      chapters: [
        {
          chapterName: 'Biology - Cell Structure',
          questions: [
            {
              id: '11-neet-bio-1',
              question: 'What is the powerhouse of the cell?',
              options: [
                { id: 'a', text: 'Mitochondria', isCorrect: true },
                { id: 'b', text: 'Nucleus', isCorrect: false },
                { id: 'c', text: 'Ribosome', isCorrect: false },
                { id: 'd', text: 'Golgi apparatus', isCorrect: false },
              ],
              explanation: 'Mitochondria produce ATP, the energy currency of the cell',
              chapter: 'Biology - Cell Structure',
            },
            {
              id: '11-neet-bio-2',
              question: 'Which organelle is responsible for protein synthesis?',
              options: [
                { id: 'a', text: 'Ribosome', isCorrect: true },
                { id: 'b', text: 'Mitochondria', isCorrect: false },
                { id: 'c', text: 'Lysosome', isCorrect: false },
                { id: 'd', text: 'Chloroplast', isCorrect: false },
              ],
              explanation: 'Ribosomes are the sites of protein synthesis',
              chapter: 'Biology - Cell Structure',
            },
            {
              id: '11-neet-bio-3',
              question: 'What is the function of the nucleus?',
              options: [
                { id: 'a', text: 'Control center of the cell', isCorrect: true },
                { id: 'b', text: 'Energy production', isCorrect: false },
                { id: 'c', text: 'Protein synthesis', isCorrect: false },
                { id: 'd', text: 'Waste removal', isCorrect: false },
              ],
              explanation: 'Nucleus contains DNA and controls cell activities',
              chapter: 'Biology - Cell Structure',
            },
            {
              id: '11-neet-bio-4',
              question: 'Which organelle is found only in plant cells?',
              options: [
                { id: 'a', text: 'Chloroplast', isCorrect: true },
                { id: 'b', text: 'Mitochondria', isCorrect: false },
                { id: 'c', text: 'Ribosome', isCorrect: false },
                { id: 'd', text: 'Nucleus', isCorrect: false },
              ],
              explanation: 'Chloroplasts are found only in plant cells for photosynthesis',
              chapter: 'Biology - Cell Structure',
            },
            {
              id: '11-neet-bio-5',
              question: 'What is the function of the cell membrane?',
              options: [
                { id: 'a', text: 'Controls what enters and exits', isCorrect: true },
                { id: 'b', text: 'Produces energy', isCorrect: false },
                { id: 'c', text: 'Synthesizes proteins', isCorrect: false },
                { id: 'd', text: 'Stores genetic material', isCorrect: false },
              ],
              explanation: 'Cell membrane is selectively permeable and controls transport',
              chapter: 'Biology - Cell Structure',
            },
          ].slice(0, 5),
        },
      ],
    },
  },
  '9': {
    'Board Exam': {
      chapters: [
        {
          chapterName: 'Mathematics - Number Systems',
          questions: [
            {
              id: '9-board-math-1',
              question: 'What is the value of √144?',
              options: [
                { id: 'a', text: '12', isCorrect: true },
                { id: 'b', text: '14', isCorrect: false },
                { id: 'c', text: '16', isCorrect: false },
                { id: 'd', text: '10', isCorrect: false },
              ],
              explanation: '12 × 12 = 144, so √144 = 12',
              chapter: 'Mathematics - Number Systems',
            },
            {
              id: '9-board-math-2',
              question: 'Which of the following is an irrational number?',
              options: [
                { id: 'a', text: '√2', isCorrect: true },
                { id: 'b', text: '3/4', isCorrect: false },
                { id: 'c', text: '0.5', isCorrect: false },
                { id: 'd', text: '4', isCorrect: false },
              ],
              explanation: '√2 cannot be expressed as a fraction, making it irrational',
              chapter: 'Mathematics - Number Systems',
            },
            {
              id: '9-board-math-3',
              question: 'What is the decimal form of 3/8?',
              options: [
                { id: 'a', text: '0.375', isCorrect: true },
                { id: 'b', text: '0.38', isCorrect: false },
                { id: 'c', text: '0.4', isCorrect: false },
                { id: 'd', text: '0.35', isCorrect: false },
              ],
              explanation: '3 ÷ 8 = 0.375',
              chapter: 'Mathematics - Number Systems',
            },
            {
              id: '9-board-math-4',
              question: 'What is the LCM of 12 and 18?',
              options: [
                { id: 'a', text: '36', isCorrect: true },
                { id: 'b', text: '24', isCorrect: false },
                { id: 'c', text: '54', isCorrect: false },
                { id: 'd', text: '72', isCorrect: false },
              ],
              explanation: 'Multiples of 12: 12, 24, 36... Multiples of 18: 18, 36... LCM = 36',
              chapter: 'Mathematics - Number Systems',
            },
            {
              id: '9-board-math-5',
              question: 'What is the HCF of 24 and 36?',
              options: [
                { id: 'a', text: '12', isCorrect: true },
                { id: 'b', text: '6', isCorrect: false },
                { id: 'c', text: '18', isCorrect: false },
                { id: 'd', text: '24', isCorrect: false },
              ],
              explanation: 'Factors of 24: 1,2,3,4,6,8,12,24. Factors of 36: 1,2,3,4,6,9,12,18,36. HCF = 12',
              chapter: 'Mathematics - Number Systems',
            },
          ].slice(0, 5),
        },
        {
          chapterName: 'Science - Motion',
          questions: [
            {
              id: '9-board-sci-1',
              question: 'What is the SI unit of speed?',
              options: [
                { id: 'a', text: 'm/s', isCorrect: true },
                { id: 'b', text: 'km/h', isCorrect: false },
                { id: 'c', text: 'm/s²', isCorrect: false },
                { id: 'd', text: 'N', isCorrect: false },
              ],
              explanation: 'Speed = Distance/Time, so unit is m/s (meters per second)',
              chapter: 'Science - Motion',
            },
            {
              id: '9-board-sci-2',
              question: 'What is acceleration?',
              options: [
                { id: 'a', text: 'Rate of change of velocity', isCorrect: true },
                { id: 'b', text: 'Rate of change of speed', isCorrect: false },
                { id: 'c', text: 'Rate of change of distance', isCorrect: false },
                { id: 'd', text: 'Rate of change of time', isCorrect: false },
              ],
              explanation: 'Acceleration is the rate of change of velocity with respect to time',
              chapter: 'Science - Motion',
            },
            {
              id: '9-board-sci-3',
              question: 'A car travels 100 km in 2 hours. What is its average speed?',
              options: [
                { id: 'a', text: '50 km/h', isCorrect: true },
                { id: 'b', text: '100 km/h', isCorrect: false },
                { id: 'c', text: '25 km/h', isCorrect: false },
                { id: 'd', text: '200 km/h', isCorrect: false },
              ],
              explanation: 'Average speed = Total distance / Total time = 100 km / 2 h = 50 km/h',
              chapter: 'Science - Motion',
            },
            {
              id: '9-board-sci-4',
              question: 'What is uniform motion?',
              options: [
                { id: 'a', text: 'Motion with constant velocity', isCorrect: true },
                { id: 'b', text: 'Motion with changing velocity', isCorrect: false },
                { id: 'c', text: 'Motion at rest', isCorrect: false },
                { id: 'd', text: 'Circular motion', isCorrect: false },
              ],
              explanation: 'Uniform motion is motion with constant velocity (no acceleration)',
              chapter: 'Science - Motion',
            },
            {
              id: '9-board-sci-5',
              question: 'What is the formula for distance in uniform motion?',
              options: [
                { id: 'a', text: 's = vt', isCorrect: true },
                { id: 'b', text: 's = v/t', isCorrect: false },
                { id: 'c', text: 's = v + t', isCorrect: false },
                { id: 'd', text: 's = v²t', isCorrect: false },
              ],
              explanation: 'Distance = velocity × time (s = vt)',
              chapter: 'Science - Motion',
            },
          ].slice(0, 5),
        },
      ],
    },
  },
  '10': {
    'Board Exam': {
      chapters: [
        {
          chapterName: 'Mathematics - Quadratic Equations',
          questions: [
            {
              id: '10-board-math-1',
              question: 'What is the standard form of a quadratic equation?',
              options: [
                { id: 'a', text: 'ax² + bx + c = 0', isCorrect: true },
                { id: 'b', text: 'ax + b = 0', isCorrect: false },
                { id: 'c', text: 'ax³ + bx² + c = 0', isCorrect: false },
                { id: 'd', text: 'a²x + b = 0', isCorrect: false },
              ],
              explanation: 'Standard form of quadratic equation is ax² + bx + c = 0 where a ≠ 0',
              chapter: 'Mathematics - Quadratic Equations',
            },
            {
              id: '10-board-math-2',
              question: 'What is the discriminant of x² - 5x + 6 = 0?',
              options: [
                { id: 'a', text: '1', isCorrect: true },
                { id: 'b', text: '25', isCorrect: false },
                { id: 'c', text: '0', isCorrect: false },
                { id: 'd', text: '-1', isCorrect: false },
              ],
              explanation: 'Discriminant = b² - 4ac = (-5)² - 4(1)(6) = 25 - 24 = 1',
              chapter: 'Mathematics - Quadratic Equations',
            },
            {
              id: '10-board-math-3',
              question: 'What are the roots of x² - 5x + 6 = 0?',
              options: [
                { id: 'a', text: '2 and 3', isCorrect: true },
                { id: 'b', text: '1 and 6', isCorrect: false },
                { id: 'c', text: '-2 and -3', isCorrect: false },
                { id: 'd', text: '5 and 1', isCorrect: false },
              ],
              explanation: 'x² - 5x + 6 = (x-2)(x-3) = 0, so roots are x = 2 and x = 3',
              chapter: 'Mathematics - Quadratic Equations',
            },
            {
              id: '10-board-math-4',
              question: 'What is the quadratic formula?',
              options: [
                { id: 'a', text: 'x = (-b ± √(b²-4ac)) / 2a', isCorrect: true },
                { id: 'b', text: 'x = (-b ± √(b²+4ac)) / 2a', isCorrect: false },
                { id: 'c', text: 'x = (b ± √(b²-4ac)) / 2a', isCorrect: false },
                { id: 'd', text: 'x = (-b ± √(4ac-b²)) / 2a', isCorrect: false },
              ],
              explanation: 'The quadratic formula is x = (-b ± √(b²-4ac)) / 2a',
              chapter: 'Mathematics - Quadratic Equations',
            },
            {
              id: '10-board-math-5',
              question: 'If discriminant > 0, how many real roots does the quadratic equation have?',
              options: [
                { id: 'a', text: '2 distinct real roots', isCorrect: true },
                { id: 'b', text: '1 real root', isCorrect: false },
                { id: 'c', text: 'No real roots', isCorrect: false },
                { id: 'd', text: 'Infinite roots', isCorrect: false },
              ],
              explanation: 'When discriminant > 0, the quadratic equation has 2 distinct real roots',
              chapter: 'Mathematics - Quadratic Equations',
            },
          ].slice(0, 5),
        },
        {
          chapterName: 'Science - Light - Reflection and Refraction',
          questions: [
            {
              id: '10-board-sci-1',
              question: 'What is the law of reflection?',
              options: [
                { id: 'a', text: 'Angle of incidence = Angle of reflection', isCorrect: true },
                { id: 'b', text: 'Angle of incidence > Angle of reflection', isCorrect: false },
                { id: 'c', text: 'Angle of incidence < Angle of reflection', isCorrect: false },
                { id: 'd', text: 'Angle of incidence = 90°', isCorrect: false },
              ],
              explanation: 'The angle of incidence equals the angle of reflection',
              chapter: 'Science - Light - Reflection and Refraction',
            },
            {
              id: '10-board-sci-2',
              question: 'What is the speed of light in vacuum?',
              options: [
                { id: 'a', text: '3 × 10⁸ m/s', isCorrect: true },
                { id: 'b', text: '3 × 10⁶ m/s', isCorrect: false },
                { id: 'c', text: '3 × 10¹⁰ m/s', isCorrect: false },
                { id: 'd', text: '3 × 10⁵ m/s', isCorrect: false },
              ],
              explanation: 'Speed of light in vacuum is approximately 3 × 10⁸ meters per second',
              chapter: 'Science - Light - Reflection and Refraction',
            },
            {
              id: '10-board-sci-3',
              question: 'What is refraction?',
              options: [
                { id: 'a', text: 'Bending of light when passing through different media', isCorrect: true },
                { id: 'b', text: 'Bouncing back of light', isCorrect: false },
                { id: 'c', text: 'Absorption of light', isCorrect: false },
                { id: 'd', text: 'Emission of light', isCorrect: false },
              ],
              explanation: 'Refraction is the bending of light when it passes from one medium to another',
              chapter: 'Science - Light - Reflection and Refraction',
            },
            {
              id: '10-board-sci-4',
              question: 'What is Snell\'s law?',
              options: [
                { id: 'a', text: 'n₁sin(i) = n₂sin(r)', isCorrect: true },
                { id: 'b', text: 'n₁sin(r) = n₂sin(i)', isCorrect: false },
                { id: 'c', text: 'n₁ + n₂ = sin(i) + sin(r)', isCorrect: false },
                { id: 'd', text: 'n₁/n₂ = sin(i)/sin(r)', isCorrect: false },
              ],
              explanation: 'Snell\'s law: n₁sin(i) = n₂sin(r) where n is refractive index',
              chapter: 'Science - Light - Reflection and Refraction',
            },
            {
              id: '10-board-sci-5',
              question: 'What is the refractive index of water?',
              options: [
                { id: 'a', text: 'Approximately 1.33', isCorrect: true },
                { id: 'b', text: '1.0', isCorrect: false },
                { id: 'c', text: '2.0', isCorrect: false },
                { id: 'd', text: '0.75', isCorrect: false },
              ],
              explanation: 'Refractive index of water is approximately 1.33',
              chapter: 'Science - Light - Reflection and Refraction',
            },
          ].slice(0, 5),
        },
      ],
    },
  },
  '8': {
    'UPSC': {
      chapters: [
        {
          chapterName: 'History - Ancient India Basics',
          questions: [
            { id: '8-upsc-hist-1', question: 'Which ancient Indian text is known as the oldest?', options: [{ id: 'a', text: 'Rigveda', isCorrect: true }, { id: 'b', text: 'Mahabharata', isCorrect: false }, { id: 'c', text: 'Ramayana', isCorrect: false }, { id: 'd', text: 'Upanishads', isCorrect: false }], explanation: 'Rigveda is the oldest of the four Vedas', chapter: 'History - Ancient India Basics' },
            { id: '8-upsc-hist-2', question: 'Who was the founder of the Mauryan Empire?', options: [{ id: 'a', text: 'Chandragupta Maurya', isCorrect: true }, { id: 'b', text: 'Ashoka', isCorrect: false }, { id: 'c', text: 'Bindusara', isCorrect: false }, { id: 'd', text: 'Samudragupta', isCorrect: false }], explanation: 'Chandragupta Maurya founded the Mauryan Empire around 321 BCE', chapter: 'History - Ancient India Basics' },
            { id: '8-upsc-hist-3', question: 'Which river is considered most sacred in India?', options: [{ id: 'a', text: 'Ganga', isCorrect: true }, { id: 'b', text: 'Yamuna', isCorrect: false }, { id: 'c', text: 'Saraswati', isCorrect: false }, { id: 'd', text: 'Indus', isCorrect: false }], explanation: 'Ganga (Ganges) is considered the most sacred river in India', chapter: 'History - Ancient India Basics' },
            { id: '8-upsc-hist-4', question: 'What is the capital of India?', options: [{ id: 'a', text: 'New Delhi', isCorrect: true }, { id: 'b', text: 'Mumbai', isCorrect: false }, { id: 'c', text: 'Kolkata', isCorrect: false }, { id: 'd', text: 'Chennai', isCorrect: false }], explanation: 'New Delhi is the capital of India', chapter: 'History - Ancient India Basics' },
            { id: '8-upsc-hist-5', question: 'How many union territories are there in India?', options: [{ id: 'a', text: '8', isCorrect: true }, { id: 'b', text: '7', isCorrect: false }, { id: 'c', text: '9', isCorrect: false }, { id: 'd', text: '6', isCorrect: false }], explanation: 'India has 8 union territories', chapter: 'History - Ancient India Basics' },
          ].slice(0, 5),
        },
      ],
    },
    'SSC': {
      chapters: [
        {
          chapterName: 'General Knowledge - India Basics',
          questions: [
            { id: '8-ssc-gk-1', question: 'What is the national flower of India?', options: [{ id: 'a', text: 'Lotus', isCorrect: true }, { id: 'b', text: 'Rose', isCorrect: false }, { id: 'c', text: 'Sunflower', isCorrect: false }, { id: 'd', text: 'Marigold', isCorrect: false }], explanation: 'Lotus is the national flower of India', chapter: 'General Knowledge - India Basics' },
            { id: '8-ssc-gk-2', question: 'What is the national bird of India?', options: [{ id: 'a', text: 'Peacock', isCorrect: true }, { id: 'b', text: 'Eagle', isCorrect: false }, { id: 'c', text: 'Parrot', isCorrect: false }, { id: 'd', text: 'Sparrow', isCorrect: false }], explanation: 'Peacock is the national bird of India', chapter: 'General Knowledge - India Basics' },
            { id: '8-ssc-gk-3', question: 'What is the national tree of India?', options: [{ id: 'a', text: 'Banyan Tree', isCorrect: true }, { id: 'b', text: 'Neem Tree', isCorrect: false }, { id: 'c', text: 'Mango Tree', isCorrect: false }, { id: 'd', text: 'Coconut Tree', isCorrect: false }], explanation: 'Banyan Tree is the national tree of India', chapter: 'General Knowledge - India Basics' },
            { id: '8-ssc-gk-4', question: 'What is the national anthem of India?', options: [{ id: 'a', text: 'Jana Gana Mana', isCorrect: true }, { id: 'b', text: 'Vande Mataram', isCorrect: false }, { id: 'c', text: 'Sare Jahan Se Accha', isCorrect: false }, { id: 'd', text: 'Maa Tujhe Salaam', isCorrect: false }], explanation: 'Jana Gana Mana is the national anthem of India', chapter: 'General Knowledge - India Basics' },
            { id: '8-ssc-gk-5', question: 'What is the national sport of India?', options: [{ id: 'a', text: 'Hockey', isCorrect: true }, { id: 'b', text: 'Cricket', isCorrect: false }, { id: 'c', text: 'Football', isCorrect: false }, { id: 'd', text: 'Tennis', isCorrect: false }], explanation: 'Hockey is the national sport of India', chapter: 'General Knowledge - India Basics' },
          ].slice(0, 5),
        },
      ],
    },
    'CAT': {
      chapters: [
        {
          chapterName: 'Quantitative Aptitude - Basics',
          questions: [
            { id: '8-cat-qa-1', question: 'What is 10% of 100?', options: [{ id: 'a', text: '10', isCorrect: true }, { id: 'b', text: '20', isCorrect: false }, { id: 'c', text: '5', isCorrect: false }, { id: 'd', text: '15', isCorrect: false }], explanation: '10% of 100 = (10/100) × 100 = 10', chapter: 'Quantitative Aptitude - Basics' },
            { id: '8-cat-qa-2', question: 'What is 2 + 2 × 2?', options: [{ id: 'a', text: '6', isCorrect: true }, { id: 'b', text: '8', isCorrect: false }, { id: 'c', text: '4', isCorrect: false }, { id: 'd', text: '10', isCorrect: false }], explanation: 'Following order of operations: 2 + (2 × 2) = 2 + 4 = 6', chapter: 'Quantitative Aptitude - Basics' },
            { id: '8-cat-qa-3', question: 'What is the value of 5²?', options: [{ id: 'a', text: '25', isCorrect: true }, { id: 'b', text: '10', isCorrect: false }, { id: 'c', text: '15', isCorrect: false }, { id: 'd', text: '20', isCorrect: false }], explanation: '5² = 5 × 5 = 25', chapter: 'Quantitative Aptitude - Basics' },
            { id: '8-cat-qa-4', question: 'What is 20 ÷ 4?', options: [{ id: 'a', text: '5', isCorrect: true }, { id: 'b', text: '4', isCorrect: false }, { id: 'c', text: '6', isCorrect: false }, { id: 'd', text: '8', isCorrect: false }], explanation: '20 ÷ 4 = 5', chapter: 'Quantitative Aptitude - Basics' },
            { id: '8-cat-qa-5', question: 'What is 3 × 7?', options: [{ id: 'a', text: '21', isCorrect: true }, { id: 'b', text: '18', isCorrect: false }, { id: 'c', text: '24', isCorrect: false }, { id: 'd', text: '28', isCorrect: false }], explanation: '3 × 7 = 21', chapter: 'Quantitative Aptitude - Basics' },
          ].slice(0, 5),
        },
      ],
    },
    'CLAT': {
      chapters: [
        {
          chapterName: 'Legal Reasoning - Introduction',
          questions: [
            { id: '8-clat-lr-1', question: 'What is the minimum age to vote in India?', options: [{ id: 'a', text: '18 years', isCorrect: true }, { id: 'b', text: '16 years', isCorrect: false }, { id: 'c', text: '21 years', isCorrect: false }, { id: 'd', text: '25 years', isCorrect: false }], explanation: 'The minimum voting age in India is 18 years', chapter: 'Legal Reasoning - Introduction' },
            { id: '8-clat-lr-2', question: 'What is the full form of PIL?', options: [{ id: 'a', text: 'Public Interest Litigation', isCorrect: true }, { id: 'b', text: 'Public Information Law', isCorrect: false }, { id: 'c', text: 'Private Interest Litigation', isCorrect: false }, { id: 'd', text: 'Public Interest Law', isCorrect: false }], explanation: 'PIL stands for Public Interest Litigation', chapter: 'Legal Reasoning - Introduction' },
            { id: '8-clat-lr-3', question: 'How many judges are there in the Supreme Court of India?', options: [{ id: 'a', text: '34', isCorrect: true }, { id: 'b', text: '30', isCorrect: false }, { id: 'c', text: '35', isCorrect: false }, { id: 'd', text: '40', isCorrect: false }], explanation: 'The Supreme Court of India has 34 judges including the Chief Justice', chapter: 'Legal Reasoning - Introduction' },
            { id: '8-clat-lr-4', question: 'What is the term of office of the President of India?', options: [{ id: 'a', text: '5 years', isCorrect: true }, { id: 'b', text: '4 years', isCorrect: false }, { id: 'c', text: '6 years', isCorrect: false }, { id: 'd', text: '7 years', isCorrect: false }], explanation: 'The President of India holds office for 5 years', chapter: 'Legal Reasoning - Introduction' },
            { id: '8-clat-lr-5', question: 'Who appoints the Chief Justice of India?', options: [{ id: 'a', text: 'President of India', isCorrect: true }, { id: 'b', text: 'Prime Minister', isCorrect: false }, { id: 'c', text: 'Parliament', isCorrect: false }, { id: 'd', text: 'Supreme Court', isCorrect: false }], explanation: 'The President of India appoints the Chief Justice of India', chapter: 'Legal Reasoning - Introduction' },
          ].slice(0, 5),
        },
      ],
    },
  },
  '9': {
    'UPSC': {
      chapters: [
        {
          chapterName: 'History - Ancient Civilizations',
          questions: [
            { id: '9-upsc-hist-1', question: 'Which dynasty built the Taj Mahal?', options: [{ id: 'a', text: 'Mughal', isCorrect: true }, { id: 'b', text: 'Mauryan', isCorrect: false }, { id: 'c', text: 'Gupta', isCorrect: false }, { id: 'd', text: 'Chola', isCorrect: false }], explanation: 'The Taj Mahal was built by Mughal Emperor Shah Jahan', chapter: 'History - Ancient Civilizations' },
            { id: '9-upsc-hist-2', question: 'Who was the first woman Prime Minister of India?', options: [{ id: 'a', text: 'Indira Gandhi', isCorrect: true }, { id: 'b', text: 'Sonia Gandhi', isCorrect: false }, { id: 'c', text: 'Pratibha Patil', isCorrect: false }, { id: 'd', text: 'Sarojini Naidu', isCorrect: false }], explanation: 'Indira Gandhi was the first woman Prime Minister of India', chapter: 'History - Ancient Civilizations' },
            { id: '9-upsc-hist-3', question: 'When was the Battle of Plassey fought?', options: [{ id: 'a', text: '1757', isCorrect: true }, { id: 'b', text: '1857', isCorrect: false }, { id: 'c', text: '1764', isCorrect: false }, { id: 'd', text: '1747', isCorrect: false }], explanation: 'The Battle of Plassey was fought in 1757', chapter: 'History - Ancient Civilizations' },
            { id: '9-upsc-hist-4', question: 'Who wrote the Indian Constitution?', options: [{ id: 'a', text: 'Dr. B.R. Ambedkar', isCorrect: true }, { id: 'b', text: 'Jawaharlal Nehru', isCorrect: false }, { id: 'c', text: 'Mahatma Gandhi', isCorrect: false }, { id: 'd', text: 'Sardar Patel', isCorrect: false }], explanation: 'Dr. B.R. Ambedkar was the chairman of the Drafting Committee', chapter: 'History - Ancient Civilizations' },
            { id: '9-upsc-hist-5', question: 'What is the length of the Indian coastline?', options: [{ id: 'a', text: 'Approximately 7,500 km', isCorrect: true }, { id: 'b', text: '5,000 km', isCorrect: false }, { id: 'c', text: '10,000 km', isCorrect: false }, { id: 'd', text: '6,000 km', isCorrect: false }], explanation: 'India has a coastline of approximately 7,500 km', chapter: 'History - Ancient Civilizations' },
          ].slice(0, 5),
        },
      ],
    },
    'SSC': {
      chapters: [
        {
          chapterName: 'General Knowledge - Basics',
          questions: [
            { id: '9-ssc-gk-1', question: 'What is the largest state in India by area?', options: [{ id: 'a', text: 'Rajasthan', isCorrect: true }, { id: 'b', text: 'Madhya Pradesh', isCorrect: false }, { id: 'c', text: 'Maharashtra', isCorrect: false }, { id: 'd', text: 'Uttar Pradesh', isCorrect: false }], explanation: 'Rajasthan is the largest state in India by area', chapter: 'General Knowledge - Basics' },
            { id: '9-ssc-gk-2', question: 'What is the smallest state in India by area?', options: [{ id: 'a', text: 'Goa', isCorrect: true }, { id: 'b', text: 'Sikkim', isCorrect: false }, { id: 'c', text: 'Tripura', isCorrect: false }, { id: 'd', text: 'Mizoram', isCorrect: false }], explanation: 'Goa is the smallest state in India by area', chapter: 'General Knowledge - Basics' },
            { id: '9-ssc-gk-3', question: 'What is the highest mountain peak in India?', options: [{ id: 'a', text: 'Kanchenjunga', isCorrect: true }, { id: 'b', text: 'Mount Everest', isCorrect: false }, { id: 'c', text: 'Nanda Devi', isCorrect: false }, { id: 'd', text: 'Kamet', isCorrect: false }], explanation: 'Kanchenjunga is the highest peak in India', chapter: 'General Knowledge - Basics' },
            { id: '9-ssc-gk-4', question: 'Which is the longest river in India?', options: [{ id: 'a', text: 'Ganga', isCorrect: true }, { id: 'b', text: 'Yamuna', isCorrect: false }, { id: 'c', text: 'Godavari', isCorrect: false }, { id: 'd', text: 'Brahmaputra', isCorrect: false }], explanation: 'Ganga is the longest river in India', chapter: 'General Knowledge - Basics' },
            { id: '9-ssc-gk-5', question: 'What is the official language of India?', options: [{ id: 'a', text: 'Hindi and English', isCorrect: true }, { id: 'b', text: 'Hindi only', isCorrect: false }, { id: 'c', text: 'English only', isCorrect: false }, { id: 'd', text: 'Sanskrit', isCorrect: false }], explanation: 'Hindi and English are the official languages of India', chapter: 'General Knowledge - Basics' },
          ].slice(0, 5),
        },
      ],
    },
    'CAT': {
      chapters: [
        {
          chapterName: 'Quantitative Aptitude - Fundamentals',
          questions: [
            { id: '9-cat-qa-1', question: 'What is 15% of 200?', options: [{ id: 'a', text: '30', isCorrect: true }, { id: 'b', text: '25', isCorrect: false }, { id: 'c', text: '35', isCorrect: false }, { id: 'd', text: '40', isCorrect: false }], explanation: '15% of 200 = (15/100) × 200 = 30', chapter: 'Quantitative Aptitude - Fundamentals' },
            { id: '9-cat-qa-2', question: 'What is the square of 9?', options: [{ id: 'a', text: '81', isCorrect: true }, { id: 'b', text: '72', isCorrect: false }, { id: 'c', text: '90', isCorrect: false }, { id: 'd', text: '64', isCorrect: false }], explanation: '9² = 9 × 9 = 81', chapter: 'Quantitative Aptitude - Fundamentals' },
            { id: '9-cat-qa-3', question: 'What is 100 ÷ 5?', options: [{ id: 'a', text: '20', isCorrect: true }, { id: 'b', text: '15', isCorrect: false }, { id: 'c', text: '25', isCorrect: false }, { id: 'd', text: '10', isCorrect: false }], explanation: '100 ÷ 5 = 20', chapter: 'Quantitative Aptitude - Fundamentals' },
            { id: '9-cat-qa-4', question: 'What is 12 × 8?', options: [{ id: 'a', text: '96', isCorrect: true }, { id: 'b', text: '84', isCorrect: false }, { id: 'c', text: '108', isCorrect: false }, { id: 'd', text: '88', isCorrect: false }], explanation: '12 × 8 = 96', chapter: 'Quantitative Aptitude - Fundamentals' },
            { id: '9-cat-qa-5', question: 'What is 50 - 25?', options: [{ id: 'a', text: '25', isCorrect: true }, { id: 'b', text: '30', isCorrect: false }, { id: 'c', text: '20', isCorrect: false }, { id: 'd', text: '35', isCorrect: false }], explanation: '50 - 25 = 25', chapter: 'Quantitative Aptitude - Fundamentals' },
          ].slice(0, 5),
        },
      ],
    },
    'CLAT': {
      chapters: [
        {
          chapterName: 'Legal Reasoning - Introduction',
          questions: [
            { id: '9-clat-lr-1', question: 'What is the minimum age to become a Member of Parliament?', options: [{ id: 'a', text: '25 years', isCorrect: true }, { id: 'b', text: '21 years', isCorrect: false }, { id: 'c', text: '30 years', isCorrect: false }, { id: 'd', text: '35 years', isCorrect: false }], explanation: 'The minimum age to become a Member of Parliament is 25 years', chapter: 'Legal Reasoning - Introduction' },
            { id: '9-clat-lr-2', question: 'How many houses are there in the Indian Parliament?', options: [{ id: 'a', text: '2', isCorrect: true }, { id: 'b', text: '1', isCorrect: false }, { id: 'c', text: '3', isCorrect: false }, { id: 'd', text: '4', isCorrect: false }], explanation: 'Indian Parliament has 2 houses: Lok Sabha and Rajya Sabha', chapter: 'Legal Reasoning - Introduction' },
            { id: '9-clat-lr-3', question: 'What is the term of Lok Sabha?', options: [{ id: 'a', text: '5 years', isCorrect: true }, { id: 'b', text: '4 years', isCorrect: false }, { id: 'c', text: '6 years', isCorrect: false }, { id: 'd', text: '3 years', isCorrect: false }], explanation: 'Lok Sabha has a term of 5 years', chapter: 'Legal Reasoning - Introduction' },
            { id: '9-clat-lr-4', question: 'Who is the head of the Indian government?', options: [{ id: 'a', text: 'Prime Minister', isCorrect: true }, { id: 'b', text: 'President', isCorrect: false }, { id: 'c', text: 'Chief Justice', isCorrect: false }, { id: 'd', text: 'Speaker', isCorrect: false }], explanation: 'Prime Minister is the head of the Indian government', chapter: 'Legal Reasoning - Introduction' },
            { id: '9-clat-lr-5', question: 'What is the full form of RTI?', options: [{ id: 'a', text: 'Right to Information', isCorrect: true }, { id: 'b', text: 'Right to Information Act', isCorrect: false }, { id: 'c', text: 'Right to Inquiry', isCorrect: false }, { id: 'd', text: 'Right to Investigation', isCorrect: false }], explanation: 'RTI stands for Right to Information', chapter: 'Legal Reasoning - Introduction' },
          ].slice(0, 5),
        },
      ],
    },
  },
  '10': {
    'UPSC': {
      chapters: [
        {
          chapterName: 'History - Medieval India',
          questions: [
            { id: '10-upsc-hist-1', question: 'Who was the first Mughal Emperor?', options: [{ id: 'a', text: 'Babur', isCorrect: true }, { id: 'b', text: 'Akbar', isCorrect: false }, { id: 'c', text: 'Humayun', isCorrect: false }, { id: 'd', text: 'Aurangzeb', isCorrect: false }], explanation: 'Babur was the first Mughal Emperor who established the Mughal Empire in India', chapter: 'History - Medieval India' },
            { id: '10-upsc-hist-2', question: 'When did the Battle of Panipat take place?', options: [{ id: 'a', text: '1526', isCorrect: true }, { id: 'b', text: '1556', isCorrect: false }, { id: 'c', text: '1761', isCorrect: false }, { id: 'd', text: '1857', isCorrect: false }], explanation: 'The First Battle of Panipat took place in 1526', chapter: 'History - Medieval India' },
            { id: '10-upsc-hist-3', question: 'Who built the Red Fort?', options: [{ id: 'a', text: 'Shah Jahan', isCorrect: true }, { id: 'b', text: 'Akbar', isCorrect: false }, { id: 'c', text: 'Aurangzeb', isCorrect: false }, { id: 'd', text: 'Jahangir', isCorrect: false }], explanation: 'Shah Jahan built the Red Fort in Delhi', chapter: 'History - Medieval India' },
            { id: '10-upsc-hist-4', question: 'Which empire ruled South India for the longest period?', options: [{ id: 'a', text: 'Chola Empire', isCorrect: true }, { id: 'b', text: 'Pallava Empire', isCorrect: false }, { id: 'c', text: 'Pandya Empire', isCorrect: false }, { id: 'd', text: 'Vijayanagara Empire', isCorrect: false }], explanation: 'The Chola Empire ruled South India for the longest period', chapter: 'History - Medieval India' },
            { id: '10-upsc-hist-5', question: 'Who was known as the Nightingale of India?', options: [{ id: 'a', text: 'Sarojini Naidu', isCorrect: true }, { id: 'b', text: 'Indira Gandhi', isCorrect: false }, { id: 'c', text: 'Mother Teresa', isCorrect: false }, { id: 'd', text: 'Rani Lakshmibai', isCorrect: false }], explanation: 'Sarojini Naidu was known as the Nightingale of India', chapter: 'History - Medieval India' },
          ].slice(0, 5),
        },
      ],
    },
    'SSC': {
      chapters: [
        {
          chapterName: 'General Knowledge - India',
          questions: [
            { id: '10-ssc-gk-1', question: 'What is the total number of districts in India?', options: [{ id: 'a', text: 'Approximately 750', isCorrect: true }, { id: 'b', text: '600', isCorrect: false }, { id: 'c', text: '800', isCorrect: false }, { id: 'd', text: '900', isCorrect: false }], explanation: 'India has approximately 750 districts', chapter: 'General Knowledge - India' },
            { id: '10-ssc-gk-2', question: 'Which state has the highest population?', options: [{ id: 'a', text: 'Uttar Pradesh', isCorrect: true }, { id: 'b', text: 'Maharashtra', isCorrect: false }, { id: 'c', text: 'Bihar', isCorrect: false }, { id: 'd', text: 'West Bengal', isCorrect: false }], explanation: 'Uttar Pradesh has the highest population in India', chapter: 'General Knowledge - India' },
            { id: '10-ssc-gk-3', question: 'What is the literacy rate of India (approximately)?', options: [{ id: 'a', text: '77%', isCorrect: true }, { id: 'b', text: '65%', isCorrect: false }, { id: 'c', text: '85%', isCorrect: false }, { id: 'd', text: '70%', isCorrect: false }], explanation: 'India\'s literacy rate is approximately 77%', chapter: 'General Knowledge - India' },
            { id: '10-ssc-gk-4', question: 'Which is the most populous city in India?', options: [{ id: 'a', text: 'Mumbai', isCorrect: true }, { id: 'b', text: 'Delhi', isCorrect: false }, { id: 'c', text: 'Kolkata', isCorrect: false }, { id: 'd', text: 'Chennai', isCorrect: false }], explanation: 'Mumbai is the most populous city in India', chapter: 'General Knowledge - India' },
            { id: '10-ssc-gk-5', question: 'What is the time difference between IST and GMT?', options: [{ id: 'a', text: '+5:30 hours', isCorrect: true }, { id: 'b', text: '+5:00 hours', isCorrect: false }, { id: 'c', text: '+6:00 hours', isCorrect: false }, { id: 'd', text: '+4:30 hours', isCorrect: false }], explanation: 'IST is 5 hours 30 minutes ahead of GMT', chapter: 'General Knowledge - India' },
          ].slice(0, 5),
        },
      ],
    },
    'CAT': {
      chapters: [
        {
          chapterName: 'Quantitative Aptitude - Number Systems',
          questions: [
            { id: '10-cat-qa-1', question: 'What is the LCM of 6 and 8?', options: [{ id: 'a', text: '24', isCorrect: true }, { id: 'b', text: '12', isCorrect: false }, { id: 'c', text: '48', isCorrect: false }, { id: 'd', text: '18', isCorrect: false }], explanation: 'LCM of 6 and 8 = 24', chapter: 'Quantitative Aptitude - Number Systems' },
            { id: '10-cat-qa-2', question: 'What is the HCF of 18 and 24?', options: [{ id: 'a', text: '6', isCorrect: true }, { id: 'b', text: '8', isCorrect: false }, { id: 'c', text: '12', isCorrect: false }, { id: 'd', text: '4', isCorrect: false }], explanation: 'HCF of 18 and 24 = 6', chapter: 'Quantitative Aptitude - Number Systems' },
            { id: '10-cat-qa-3', question: 'What is 0.5 as a fraction?', options: [{ id: 'a', text: '1/2', isCorrect: true }, { id: 'b', text: '1/4', isCorrect: false }, { id: 'c', text: '2/3', isCorrect: false }, { id: 'd', text: '3/4', isCorrect: false }], explanation: '0.5 = 1/2', chapter: 'Quantitative Aptitude - Number Systems' },
            { id: '10-cat-qa-4', question: 'What is the value of 4³?', options: [{ id: 'a', text: '64', isCorrect: true }, { id: 'b', text: '16', isCorrect: false }, { id: 'c', text: '32', isCorrect: false }, { id: 'd', text: '48', isCorrect: false }], explanation: '4³ = 4 × 4 × 4 = 64', chapter: 'Quantitative Aptitude - Number Systems' },
            { id: '10-cat-qa-5', question: 'What is √36?', options: [{ id: 'a', text: '6', isCorrect: true }, { id: 'b', text: '4', isCorrect: false }, { id: 'c', text: '8', isCorrect: false }, { id: 'd', text: '9', isCorrect: false }], explanation: '6 × 6 = 36, so √36 = 6', chapter: 'Quantitative Aptitude - Number Systems' },
          ].slice(0, 5),
        },
      ],
    },
    'CLAT': {
      chapters: [
        {
          chapterName: 'Legal Reasoning - Basics',
          questions: [
            { id: '10-clat-lr-1', question: 'What is the minimum age to become the Prime Minister?', options: [{ id: 'a', text: '25 years', isCorrect: true }, { id: 'b', text: '30 years', isCorrect: false }, { id: 'c', text: '35 years', isCorrect: false }, { id: 'd', text: '40 years', isCorrect: false }], explanation: 'The minimum age to become Prime Minister is 25 years', chapter: 'Legal Reasoning - Basics' },
            { id: '10-clat-lr-2', question: 'How many fundamental duties are there in the Indian Constitution?', options: [{ id: 'a', text: '11', isCorrect: true }, { id: 'b', text: '10', isCorrect: false }, { id: 'c', text: '12', isCorrect: false }, { id: 'd', text: '9', isCorrect: false }], explanation: 'There are 11 fundamental duties in the Indian Constitution', chapter: 'Legal Reasoning - Basics' },
            { id: '10-clat-lr-3', question: 'What is the term of Rajya Sabha members?', options: [{ id: 'a', text: '6 years', isCorrect: true }, { id: 'b', text: '5 years', isCorrect: false }, { id: 'c', text: '4 years', isCorrect: false }, { id: 'd', text: '7 years', isCorrect: false }], explanation: 'Rajya Sabha members have a term of 6 years', chapter: 'Legal Reasoning - Basics' },
            { id: '10-clat-lr-4', question: 'Who can dissolve the Lok Sabha?', options: [{ id: 'a', text: 'President', isCorrect: true }, { id: 'b', text: 'Prime Minister', isCorrect: false }, { id: 'c', text: 'Speaker', isCorrect: false }, { id: 'd', text: 'Chief Justice', isCorrect: false }], explanation: 'The President can dissolve the Lok Sabha', chapter: 'Legal Reasoning - Basics' },
            { id: '10-clat-lr-5', question: 'What is the full form of FIR?', options: [{ id: 'a', text: 'First Information Report', isCorrect: true }, { id: 'b', text: 'First Investigation Report', isCorrect: false }, { id: 'c', text: 'First Inquiry Report', isCorrect: false }, { id: 'd', text: 'First Incident Report', isCorrect: false }], explanation: 'FIR stands for First Information Report', chapter: 'Legal Reasoning - Basics' },
          ].slice(0, 5),
        },
      ],
    },
  },
  '11': {
    'UPSC': {
      chapters: [
        {
          chapterName: 'History - Ancient India',
          questions: [
            { id: '11-upsc-hist-1', question: 'Which ancient university was located in Nalanda?', options: [{ id: 'a', text: 'Nalanda University', isCorrect: true }, { id: 'b', text: 'Taxila University', isCorrect: false }, { id: 'c', text: 'Vikramshila University', isCorrect: false }, { id: 'd', text: 'Takshashila University', isCorrect: false }], explanation: 'Nalanda University was an ancient center of learning in Bihar', chapter: 'History - Ancient India' },
            { id: '11-upsc-hist-2', question: 'Who wrote the Arthashastra?', options: [{ id: 'a', text: 'Chanakya (Kautilya)', isCorrect: true }, { id: 'b', text: 'Kalidas', isCorrect: false }, { id: 'c', text: 'Panini', isCorrect: false }, { id: 'd', text: 'Aryabhata', isCorrect: false }], explanation: 'Chanakya (also known as Kautilya) wrote the Arthashastra', chapter: 'History - Ancient India' },
            { id: '11-upsc-hist-3', question: 'Which Mauryan emperor converted to Buddhism?', options: [{ id: 'a', text: 'Ashoka', isCorrect: true }, { id: 'b', text: 'Chandragupta Maurya', isCorrect: false }, { id: 'c', text: 'Bindusara', isCorrect: false }, { id: 'd', text: 'Samudragupta', isCorrect: false }], explanation: 'Emperor Ashoka converted to Buddhism after the Kalinga War', chapter: 'History - Ancient India' },
            { id: '11-upsc-hist-4', question: 'What is the period of the Gupta Empire known as?', options: [{ id: 'a', text: 'Golden Age of India', isCorrect: true }, { id: 'b', text: 'Silver Age', isCorrect: false }, { id: 'c', text: 'Bronze Age', isCorrect: false }, { id: 'd', text: 'Iron Age', isCorrect: false }], explanation: 'The Gupta period is known as the Golden Age of India', chapter: 'History - Ancient India' },
            { id: '11-upsc-hist-5', question: 'Who was the founder of the Gupta Empire?', options: [{ id: 'a', text: 'Chandragupta I', isCorrect: true }, { id: 'b', text: 'Samudragupta', isCorrect: false }, { id: 'c', text: 'Chandragupta II', isCorrect: false }, { id: 'd', text: 'Skandagupta', isCorrect: false }], explanation: 'Chandragupta I was the founder of the Gupta Empire', chapter: 'History - Ancient India' },
          ].slice(0, 5),
        },
      ],
    },
    'SSC': {
      chapters: [
        {
          chapterName: 'General Knowledge - Static GK',
          questions: [
            { id: '11-ssc-gk-1', question: 'What is the total number of languages recognized in the 8th Schedule?', options: [{ id: 'a', text: '22', isCorrect: true }, { id: 'b', text: '20', isCorrect: false }, { id: 'c', text: '24', isCorrect: false }, { id: 'd', text: '18', isCorrect: false }], explanation: 'There are 22 languages recognized in the 8th Schedule of the Constitution', chapter: 'General Knowledge - Static GK' },
            { id: '11-ssc-gk-2', question: 'Which is the largest desert in India?', options: [{ id: 'a', text: 'Thar Desert', isCorrect: true }, { id: 'b', text: 'Rann of Kutch', isCorrect: false }, { id: 'c', text: 'Ladakh Desert', isCorrect: false }, { id: 'd', text: 'Cold Desert', isCorrect: false }], explanation: 'Thar Desert is the largest desert in India', chapter: 'General Knowledge - Static GK' },
            { id: '11-ssc-gk-3', question: 'What is the highest waterfall in India?', options: [{ id: 'a', text: 'Kunchikal Falls', isCorrect: true }, { id: 'b', text: 'Jog Falls', isCorrect: false }, { id: 'c', text: 'Dudhsagar Falls', isCorrect: false }, { id: 'd', text: 'Athirappilly Falls', isCorrect: false }], explanation: 'Kunchikal Falls in Karnataka is the highest waterfall in India', chapter: 'General Knowledge - Static GK' },
            { id: '11-ssc-gk-4', question: 'Which state produces the most rice in India?', options: [{ id: 'a', text: 'West Bengal', isCorrect: true }, { id: 'b', text: 'Punjab', isCorrect: false }, { id: 'c', text: 'Uttar Pradesh', isCorrect: false }, { id: 'd', text: 'Andhra Pradesh', isCorrect: false }], explanation: 'West Bengal is the largest rice-producing state in India', chapter: 'General Knowledge - Static GK' },
            { id: '11-ssc-gk-5', question: 'What is the national calendar of India?', options: [{ id: 'a', text: 'Saka Calendar', isCorrect: true }, { id: 'b', text: 'Vikram Samvat', isCorrect: false }, { id: 'c', text: 'Gregorian Calendar', isCorrect: false }, { id: 'd', text: 'Hijri Calendar', isCorrect: false }], explanation: 'Saka Calendar is the national calendar of India', chapter: 'General Knowledge - Static GK' },
          ].slice(0, 5),
        },
      ],
    },
    'CAT': {
      chapters: [
        {
          chapterName: 'Quantitative Aptitude - Basics',
          questions: [
            { id: '11-cat-qa-1', question: 'What is 20% of 150?', options: [{ id: 'a', text: '30', isCorrect: true }, { id: 'b', text: '25', isCorrect: false }, { id: 'c', text: '35', isCorrect: false }, { id: 'd', text: '40', isCorrect: false }], explanation: '20% of 150 = (20/100) × 150 = 30', chapter: 'Quantitative Aptitude - Basics' },
            { id: '11-cat-qa-2', question: 'What is the value of 7² + 3²?', options: [{ id: 'a', text: '58', isCorrect: true }, { id: 'b', text: '56', isCorrect: false }, { id: 'c', text: '60', isCorrect: false }, { id: 'd', text: '52', isCorrect: false }], explanation: '7² + 3² = 49 + 9 = 58', chapter: 'Quantitative Aptitude - Basics' },
            { id: '11-cat-qa-3', question: 'What is 144 ÷ 12?', options: [{ id: 'a', text: '12', isCorrect: true }, { id: 'b', text: '10', isCorrect: false }, { id: 'c', text: '14', isCorrect: false }, { id: 'd', text: '16', isCorrect: false }], explanation: '144 ÷ 12 = 12', chapter: 'Quantitative Aptitude - Basics' },
            { id: '11-cat-qa-4', question: 'What is the average of 10, 20, and 30?', options: [{ id: 'a', text: '20', isCorrect: true }, { id: 'b', text: '15', isCorrect: false }, { id: 'c', text: '25', isCorrect: false }, { id: 'd', text: '18', isCorrect: false }], explanation: 'Average = (10 + 20 + 30) / 3 = 60 / 3 = 20', chapter: 'Quantitative Aptitude - Basics' },
            { id: '11-cat-qa-5', question: 'What is 8 × 7?', options: [{ id: 'a', text: '56', isCorrect: true }, { id: 'b', text: '48', isCorrect: false }, { id: 'c', text: '64', isCorrect: false }, { id: 'd', text: '54', isCorrect: false }], explanation: '8 × 7 = 56', chapter: 'Quantitative Aptitude - Basics' },
          ].slice(0, 5),
        },
      ],
    },
    'CLAT': {
      chapters: [
        {
          chapterName: 'Legal Reasoning - Introduction',
          questions: [
            { id: '11-clat-lr-1', question: 'What is the maximum strength of Lok Sabha?', options: [{ id: 'a', text: '552', isCorrect: true }, { id: 'b', text: '545', isCorrect: false }, { id: 'c', text: '550', isCorrect: false }, { id: 'd', text: '560', isCorrect: false }], explanation: 'The maximum strength of Lok Sabha is 552 members', chapter: 'Legal Reasoning - Introduction' },
            { id: '11-clat-lr-2', question: 'What is the maximum strength of Rajya Sabha?', options: [{ id: 'a', text: '250', isCorrect: true }, { id: 'b', text: '245', isCorrect: false }, { id: 'c', text: '255', isCorrect: false }, { id: 'd', text: '260', isCorrect: false }], explanation: 'The maximum strength of Rajya Sabha is 250 members', chapter: 'Legal Reasoning - Introduction' },
            { id: '11-clat-lr-3', question: 'Who is the guardian of the Indian Constitution?', options: [{ id: 'a', text: 'Supreme Court', isCorrect: true }, { id: 'b', text: 'President', isCorrect: false }, { id: 'c', text: 'Prime Minister', isCorrect: false }, { id: 'd', text: 'Parliament', isCorrect: false }], explanation: 'Supreme Court is the guardian of the Indian Constitution', chapter: 'Legal Reasoning - Introduction' },
            { id: '11-clat-lr-4', question: 'What is the retirement age of Supreme Court judges?', options: [{ id: 'a', text: '65 years', isCorrect: true }, { id: 'b', text: '60 years', isCorrect: false }, { id: 'c', text: '70 years', isCorrect: false }, { id: 'd', text: '62 years', isCorrect: false }], explanation: 'Supreme Court judges retire at the age of 65 years', chapter: 'Legal Reasoning - Introduction' },
            { id: '11-clat-lr-5', question: 'What is the full form of PIL?', options: [{ id: 'a', text: 'Public Interest Litigation', isCorrect: true }, { id: 'b', text: 'Private Interest Litigation', isCorrect: false }, { id: 'c', text: 'Public Information Law', isCorrect: false }, { id: 'd', text: 'Public Interest Law', isCorrect: false }], explanation: 'PIL stands for Public Interest Litigation', chapter: 'Legal Reasoning - Introduction' },
          ].slice(0, 5),
        },
      ],
    },
  },
  '12': {
    'JEE': {
      chapters: [
        {
          chapterName: 'Mathematics - Calculus',
          questions: [
            {
              id: '12-jee-math-1',
              question: 'What is the derivative of x²?',
              options: [
                { id: 'a', text: '2x', isCorrect: true },
                { id: 'b', text: 'x', isCorrect: false },
                { id: 'c', text: 'x²', isCorrect: false },
                { id: 'd', text: '2x²', isCorrect: false },
              ],
              explanation: 'd/dx(x²) = 2x using power rule',
              chapter: 'Mathematics - Calculus',
            },
            {
              id: '12-jee-math-2',
              question: 'What is the integral of 2x?',
              options: [
                { id: 'a', text: 'x² + C', isCorrect: true },
                { id: 'b', text: '2x + C', isCorrect: false },
                { id: 'c', text: 'x + C', isCorrect: false },
                { id: 'd', text: '2x² + C', isCorrect: false },
              ],
              explanation: '∫2x dx = 2(x²/2) + C = x² + C',
              chapter: 'Mathematics - Calculus',
            },
            {
              id: '12-jee-math-3',
              question: 'What is lim(x→0) sin(x)/x?',
              options: [
                { id: 'a', text: '1', isCorrect: true },
                { id: 'b', text: '0', isCorrect: false },
                { id: 'c', text: '∞', isCorrect: false },
                { id: 'd', text: 'Undefined', isCorrect: false },
              ],
              explanation: 'This is a fundamental limit: lim(x→0) sin(x)/x = 1',
              chapter: 'Mathematics - Calculus',
            },
            {
              id: '12-jee-math-4',
              question: 'What is the derivative of eˣ?',
              options: [
                { id: 'a', text: 'eˣ', isCorrect: true },
                { id: 'b', text: 'xeˣ', isCorrect: false },
                { id: 'c', text: 'eˣ/x', isCorrect: false },
                { id: 'd', text: 'ln(x)', isCorrect: false },
              ],
              explanation: 'd/dx(eˣ) = eˣ (unique property of exponential function)',
              chapter: 'Mathematics - Calculus',
            },
            {
              id: '12-jee-math-5',
              question: 'What is the derivative of ln(x)?',
              options: [
                { id: 'a', text: '1/x', isCorrect: true },
                { id: 'b', text: 'x', isCorrect: false },
                { id: 'c', text: '1/x²', isCorrect: false },
                { id: 'd', text: 'ln(x)', isCorrect: false },
              ],
              explanation: 'd/dx(ln(x)) = 1/x',
              chapter: 'Mathematics - Calculus',
            },
          ].slice(0, 5),
        },
      ],
    },
    'NEET': {
      chapters: [
        {
          chapterName: 'Biology - Human Physiology',
          questions: [
            {
              id: '12-neet-bio-1',
              question: 'Which blood group is known as universal donor?',
              options: [
                { id: 'a', text: 'O negative', isCorrect: true },
                { id: 'b', text: 'AB positive', isCorrect: false },
                { id: 'c', text: 'A positive', isCorrect: false },
                { id: 'd', text: 'B negative', isCorrect: false },
              ],
              explanation: 'O negative blood has no antigens, making it safe for all recipients',
              chapter: 'Biology - Human Physiology',
            },
            {
              id: '12-neet-bio-2',
              question: 'What is the function of hemoglobin?',
              options: [
                { id: 'a', text: 'Transport oxygen', isCorrect: true },
                { id: 'b', text: 'Fight infection', isCorrect: false },
                { id: 'c', text: 'Clot blood', isCorrect: false },
                { id: 'd', text: 'Produce antibodies', isCorrect: false },
              ],
              explanation: 'Hemoglobin in red blood cells carries oxygen from lungs to tissues',
              chapter: 'Biology - Human Physiology',
            },
            {
              id: '12-neet-bio-3',
              question: 'Where does digestion of proteins begin?',
              options: [
                { id: 'a', text: 'Stomach', isCorrect: true },
                { id: 'b', text: 'Mouth', isCorrect: false },
                { id: 'c', text: 'Small intestine', isCorrect: false },
                { id: 'd', text: 'Esophagus', isCorrect: false },
              ],
              explanation: 'Protein digestion begins in the stomach with pepsin enzyme',
              chapter: 'Biology - Human Physiology',
            },
            {
              id: '12-neet-bio-4',
              question: 'What is the normal pH of human blood?',
              options: [
                { id: 'a', text: '7.4', isCorrect: true },
                { id: 'b', text: '6.4', isCorrect: false },
                { id: 'c', text: '8.4', isCorrect: false },
                { id: 'd', text: '5.4', isCorrect: false },
              ],
              explanation: 'Human blood maintains a slightly alkaline pH of approximately 7.4',
              chapter: 'Biology - Human Physiology',
            },
            {
              id: '12-neet-bio-5',
              question: 'Which hormone regulates blood sugar levels?',
              options: [
                { id: 'a', text: 'Insulin', isCorrect: true },
                { id: 'b', text: 'Adrenaline', isCorrect: false },
                { id: 'c', text: 'Thyroxine', isCorrect: false },
                { id: 'd', text: 'Estrogen', isCorrect: false },
              ],
              explanation: 'Insulin, produced by pancreas, regulates blood glucose levels',
              chapter: 'Biology - Human Physiology',
            },
          ].slice(0, 5),
            },
          ],
        },
    'UPSC': {
      chapters: [
        {
          chapterName: 'History - Modern India',
          questions: [
            {
              id: '12-upsc-hist-1',
              question: 'Who was the first Governor-General of India?',
              options: [
                { id: 'a', text: 'Warren Hastings', isCorrect: true },
                { id: 'b', text: 'Lord Cornwallis', isCorrect: false },
                { id: 'c', text: 'Lord Wellesley', isCorrect: false },
                { id: 'd', text: 'Lord Dalhousie', isCorrect: false },
              ],
              explanation: 'Warren Hastings was the first Governor-General of India from 1773-1785',
              chapter: 'History - Modern India',
            },
            {
              id: '12-upsc-hist-2',
              question: 'When did the Indian National Congress form?',
              options: [
                { id: 'a', text: '1885', isCorrect: true },
                { id: 'b', text: '1857', isCorrect: false },
                { id: 'c', text: '1905', isCorrect: false },
                { id: 'd', text: '1947', isCorrect: false },
              ],
              explanation: 'Indian National Congress was formed in 1885 by A.O. Hume',
              chapter: 'History - Modern India',
            },
            {
              id: '12-upsc-hist-3',
              question: 'Who led the Dandi March?',
              options: [
                { id: 'a', text: 'Mahatma Gandhi', isCorrect: true },
                { id: 'b', text: 'Jawaharlal Nehru', isCorrect: false },
                { id: 'c', text: 'Subhash Chandra Bose', isCorrect: false },
                { id: 'd', text: 'Bhagat Singh', isCorrect: false },
              ],
              explanation: 'Mahatma Gandhi led the Dandi March in 1930 as part of the Salt Satyagraha',
              chapter: 'History - Modern India',
            },
            {
              id: '12-upsc-hist-4',
              question: 'When did India gain independence?',
              options: [
                { id: 'a', text: 'August 15, 1947', isCorrect: true },
                { id: 'b', text: 'January 26, 1950', isCorrect: false },
                { id: 'c', text: 'August 15, 1948', isCorrect: false },
                { id: 'd', text: 'January 15, 1947', isCorrect: false },
              ],
              explanation: 'India gained independence on August 15, 1947',
              chapter: 'History - Modern India',
            },
            {
              id: '12-upsc-hist-5',
              question: 'Who was known as the Iron Man of India?',
              options: [
                { id: 'a', text: 'Sardar Vallabhbhai Patel', isCorrect: true },
                { id: 'b', text: 'Jawaharlal Nehru', isCorrect: false },
                { id: 'c', text: 'Subhash Chandra Bose', isCorrect: false },
                { id: 'd', text: 'Bhagat Singh', isCorrect: false },
              ],
              explanation: 'Sardar Vallabhbhai Patel was known as the Iron Man of India for his role in unification',
              chapter: 'History - Modern India',
            },
          ].slice(0, 5),
        },
      ],
    },
    'SSC': {
      chapters: [
        {
          chapterName: 'General Knowledge - Current Affairs',
          questions: [
            {
              id: '12-ssc-gk-1',
              question: 'What is the capital of India?',
              options: [
                { id: 'a', text: 'New Delhi', isCorrect: true },
                { id: 'b', text: 'Mumbai', isCorrect: false },
                { id: 'c', text: 'Kolkata', isCorrect: false },
                { id: 'd', text: 'Chennai', isCorrect: false },
              ],
              explanation: 'New Delhi is the capital of India',
              chapter: 'General Knowledge - Current Affairs',
            },
            {
              id: '12-ssc-gk-2',
              question: 'How many states are there in India?',
              options: [
                { id: 'a', text: '28', isCorrect: true },
                { id: 'b', text: '29', isCorrect: false },
                { id: 'c', text: '27', isCorrect: false },
                { id: 'd', text: '30', isCorrect: false },
              ],
              explanation: 'India has 28 states and 8 union territories',
              chapter: 'General Knowledge - Current Affairs',
            },
            {
              id: '12-ssc-gk-3',
              question: 'What is the currency of India?',
              options: [
                { id: 'a', text: 'Indian Rupee', isCorrect: true },
                { id: 'b', text: 'Dollar', isCorrect: false },
                { id: 'c', text: 'Euro', isCorrect: false },
                { id: 'd', text: 'Yen', isCorrect: false },
              ],
              explanation: 'Indian Rupee (INR) is the official currency of India',
              chapter: 'General Knowledge - Current Affairs',
            },
            {
              id: '12-ssc-gk-4',
              question: 'Who is the current President of India?',
              options: [
                { id: 'a', text: 'Droupadi Murmu', isCorrect: true },
                { id: 'b', text: 'Ram Nath Kovind', isCorrect: false },
                { id: 'c', text: 'Pranab Mukherjee', isCorrect: false },
                { id: 'd', text: 'A.P.J. Abdul Kalam', isCorrect: false },
              ],
              explanation: 'Droupadi Murmu is the current President of India (as of 2024)',
              chapter: 'General Knowledge - Current Affairs',
            },
            {
              id: '12-ssc-gk-5',
              question: 'What is the national animal of India?',
              options: [
                { id: 'a', text: 'Tiger', isCorrect: true },
                { id: 'b', text: 'Lion', isCorrect: false },
                { id: 'c', text: 'Elephant', isCorrect: false },
                { id: 'd', text: 'Peacock', isCorrect: false },
              ],
              explanation: 'Tiger is the national animal of India',
              chapter: 'General Knowledge - Current Affairs',
            },
          ].slice(0, 5),
        },
      ],
    },
    'CAT': {
      chapters: [
        {
          chapterName: 'Quantitative Aptitude - Algebra',
          questions: [
            {
              id: '12-cat-qa-1',
              question: 'If x + y = 10 and x - y = 4, what is the value of x?',
              options: [
                { id: 'a', text: '7', isCorrect: true },
                { id: 'b', text: '6', isCorrect: false },
                { id: 'c', text: '5', isCorrect: false },
                { id: 'd', text: '8', isCorrect: false },
              ],
              explanation: 'Adding both equations: 2x = 14, so x = 7',
              chapter: 'Quantitative Aptitude - Algebra',
            },
            {
              id: '12-cat-qa-2',
              question: 'What is 25% of 200?',
              options: [
                { id: 'a', text: '50', isCorrect: true },
                { id: 'b', text: '40', isCorrect: false },
                { id: 'c', text: '60', isCorrect: false },
                { id: 'd', text: '75', isCorrect: false },
              ],
              explanation: '25% of 200 = (25/100) × 200 = 50',
              chapter: 'Quantitative Aptitude - Algebra',
            },
            {
              id: '12-cat-qa-3',
              question: 'If a train travels 120 km in 2 hours, what is its speed?',
              options: [
                { id: 'a', text: '60 km/h', isCorrect: true },
                { id: 'b', text: '50 km/h', isCorrect: false },
                { id: 'c', text: '70 km/h', isCorrect: false },
                { id: 'd', text: '80 km/h', isCorrect: false },
              ],
              explanation: 'Speed = Distance/Time = 120 km / 2 h = 60 km/h',
              chapter: 'Quantitative Aptitude - Algebra',
            },
            {
              id: '12-cat-qa-4',
              question: 'What is the square root of 144?',
              options: [
                { id: 'a', text: '12', isCorrect: true },
                { id: 'b', text: '14', isCorrect: false },
                { id: 'c', text: '10', isCorrect: false },
                { id: 'd', text: '16', isCorrect: false },
              ],
              explanation: '12 × 12 = 144, so √144 = 12',
              chapter: 'Quantitative Aptitude - Algebra',
            },
            {
              id: '12-cat-qa-5',
              question: 'If 3x = 15, what is the value of x?',
              options: [
                { id: 'a', text: '5', isCorrect: true },
                { id: 'b', text: '3', isCorrect: false },
                { id: 'c', text: '12', isCorrect: false },
                { id: 'd', text: '18', isCorrect: false },
              ],
              explanation: '3x = 15, so x = 15/3 = 5',
              chapter: 'Quantitative Aptitude - Algebra',
            },
          ].slice(0, 5),
        },
      ],
    },
    'CLAT': {
      chapters: [
        {
          chapterName: 'Legal Reasoning - Constitutional Law',
          questions: [
            {
              id: '12-clat-lr-1',
              question: 'How many articles are there in the Indian Constitution?',
              options: [
                { id: 'a', text: '395', isCorrect: true },
                { id: 'b', text: '400', isCorrect: false },
                { id: 'c', text: '390', isCorrect: false },
                { id: 'd', text: '405', isCorrect: false },
              ],
              explanation: 'The Indian Constitution originally had 395 articles',
              chapter: 'Legal Reasoning - Constitutional Law',
            },
            {
              id: '12-clat-lr-2',
              question: 'Who is known as the Father of the Indian Constitution?',
              options: [
                { id: 'a', text: 'Dr. B.R. Ambedkar', isCorrect: true },
                { id: 'b', text: 'Jawaharlal Nehru', isCorrect: false },
                { id: 'c', text: 'Mahatma Gandhi', isCorrect: false },
                { id: 'd', text: 'Sardar Patel', isCorrect: false },
              ],
              explanation: 'Dr. B.R. Ambedkar is known as the Father of the Indian Constitution',
              chapter: 'Legal Reasoning - Constitutional Law',
            },
            {
              id: '12-clat-lr-3',
              question: 'When was the Indian Constitution adopted?',
              options: [
                { id: 'a', text: 'November 26, 1949', isCorrect: true },
                { id: 'b', text: 'January 26, 1950', isCorrect: false },
                { id: 'c', text: 'August 15, 1947', isCorrect: false },
                { id: 'd', text: 'January 15, 1949', isCorrect: false },
              ],
              explanation: 'The Constitution was adopted on November 26, 1949 and came into effect on January 26, 1950',
              chapter: 'Legal Reasoning - Constitutional Law',
            },
            {
              id: '12-clat-lr-4',
              question: 'What is the minimum age to become the President of India?',
              options: [
                { id: 'a', text: '35 years', isCorrect: true },
                { id: 'b', text: '30 years', isCorrect: false },
                { id: 'c', text: '40 years', isCorrect: false },
                { id: 'd', text: '25 years', isCorrect: false },
              ],
              explanation: 'The minimum age to become President of India is 35 years',
              chapter: 'Legal Reasoning - Constitutional Law',
            },
            {
              id: '12-clat-lr-5',
              question: 'How many fundamental rights are guaranteed by the Indian Constitution?',
              options: [
                { id: 'a', text: '6', isCorrect: true },
                { id: 'b', text: '7', isCorrect: false },
                { id: 'c', text: '5', isCorrect: false },
                { id: 'd', text: '8', isCorrect: false },
              ],
              explanation: 'The Indian Constitution guarantees 6 fundamental rights',
              chapter: 'Legal Reasoning - Constitutional Law',
            },
          ].slice(0, 5),
        },
      ],
    },
  },
};

// Helper function to get quizzes for a class-exam combination
export function getQuizzesForClassExam(selectedClass: string, selectedExam: string): ClassExamQuizzes | null {
  const classQuizzes = PREPOMETER_QUIZZES[selectedClass];
  if (!classQuizzes) return null;
  
  const examQuizzes = classQuizzes[selectedExam];
  return examQuizzes || null;
}

