interface BmiValues {
  value1: number;
  value2: number;
}

const parseArgument = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    };
  } else {
    throw new Error('Provided values are not numbers');
  }
};

export const calculateBmi = (value1: number, value2: number): string => {
  const heightM = value1 / 100;
  const range: number = value2 / (heightM * heightM);
  if (range < 18.5) {
    return "Underweight";
  } else if (range >= 18.5 && range < 24.9) {
    return "Normal weight";
  } else if (range >= 25 && range < 29.9) {
    return "Overweight";
  } else {
    return "Obesity";
  }
};

if (require.main === module) {
  try {
    const { value1, value2 } = parseArgument(process.argv);
    console.log(calculateBmi(value1, value2));
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log('Error:', e.message);
    } else {
      console.log('Unknown error');
    }
  }
}