interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (dailyHours: number[], target: number): ExerciseResult => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter(day => day > 0).length;
  const totalHours = dailyHours.reduce((acc, curr) => acc + curr, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = 'excellent';
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating = 1;
    ratingDescription = 'needs improvement';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

if (require.main === module) {
  const parseArguments = (args: string[]): { target: number, dailyHours: number[] } => {
    if (args.length < 4) throw new Error('Not enough arguments');
    const target = Number(args[2]);
    const dailyHours = args.slice(3).map(arg => Number(arg));
    if (isNaN(target) || dailyHours.some(isNaN)) {
      throw new Error('Provided values were not numbers!');
    }
    return { target, dailyHours };
  };

  try {
    const { target, dailyHours } = parseArguments(process.argv);
    console.log(calculateExercises(dailyHours, target));
  } catch (error: unknown) {
      let errorMessage = 'Something went wrong: ';
      if (error instanceof Error) {
        errorMessage += error.message;
      }
      console.log(errorMessage);
  }
}