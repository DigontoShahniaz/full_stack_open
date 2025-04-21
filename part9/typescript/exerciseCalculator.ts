interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ParsedValues {
  dailyHours: number[];
  target: number;
}

const parseArgument = (args: string[]): ParsedValues => {
  if (args.length < 4) throw new Error('Not enough arguments. Please provide a target and daily exercise hours.');
  if (args.length > 4 && args.slice(3).length > 365) throw new Error('Too many arguments. Provide exercise hours for a realistic period.');

  const target = Number(args[2]);
  const dailyHours = args.slice(3).map((hour) => Number(hour));

  if (isNaN(target)) {
    throw new Error('Target value must be a valid number.');
  }

  if (dailyHours.some(isNaN)) {
    throw new Error('Daily exercise hours must all be valid numbers.');
  }

  return {
    target,
    dailyHours,
  };
};

export const calculateExercises = (dailyHours: number[], target: number): ExerciseResult => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter((day) => day > 0).length;
  const totalHours = dailyHours.reduce((sum, hours) => sum + hours, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = 'Great job, you met your target!';
  } else if (average >= target * 0.8) {
    rating = 2;
    ratingDescription = 'Not too bad, but could be better.';
  } else {
    rating = 1;
    ratingDescription = 'You need to work harder.';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};


if (require.main === module) {
  try {
    const { target, dailyHours } = parseArgument(process.argv);
    const result = calculateExercises(dailyHours, target);
    console.log('Exercise analysis:', result);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}

