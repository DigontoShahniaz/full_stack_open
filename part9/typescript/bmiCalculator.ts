interface values {
  height: number,
  weight: number
}


const parseArguments = (args: string[]): values => {
  if (args.length < 4) throw new Error('not enough arguments');
  if (args.length > 4) throw new Error('too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    };
  } else {
    throw new Error('provided values were not numbers');
  }
};

export const bmiCalculator = (weight: number, height: number) : string => {
  const bmi = weight / ((height / 100) ** 2);

  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi >= 18.5 && bmi < 25) {
    return 'Normal range';
  } else {
    return 'Overweight';
  }

};
if (require.main === module) {
  try {
    const { height, weight } = parseArguments(process.argv);
    const result = bmiCalculator(weight, height);
    console.log(`Height: ${height} cm, Weight: ${weight} kg`);
    console.log(`BMI Result: ${result}`);
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
   }
    console.log(errorMessage);
  };
}