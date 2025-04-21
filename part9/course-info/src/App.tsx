interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescription extends CoursePartBase {
  description: string;
}

interface CoursePartSpecial extends CoursePartDescription {
  requirements: string[]; 
  kind: "special"
}

interface CoursePartBasic extends CoursePartDescription  {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

const Part = ({ courseParts } : { courseParts: CoursePart[] }) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  return (
    <div>
      {
        courseParts.map((coursePart) => {
          switch (coursePart.kind) {
            case "basic":
              return (
                <div key={coursePart.name}>
                  <h2>{coursePart.name} {coursePart.exerciseCount}</h2>
                  <p>{coursePart.description}</p>
                </div>
              )
            case "group":
              return (
                <div key={coursePart.name}>
                  <h2>{coursePart.name} {coursePart.exerciseCount}</h2>
                  <p>Group project count: {coursePart.groupProjectCount}</p>
                </div>
              )
            case "background":
              return (
                <div key={coursePart.name}>
                  <h2>{coursePart.name} {coursePart.exerciseCount}</h2>
                  <p>{coursePart.description}</p>
                  <p>Background material: <a href={coursePart.backgroundMaterial}>{coursePart.backgroundMaterial}</a></p>
                </div>
              )
            case "special":
              return (
                <div key={coursePart.name}>
                  <h2>{coursePart.name} {coursePart.exerciseCount}</h2>
                  <p>{coursePart.description}</p>
                  <p>Requirements: {coursePart.requirements.join(", ")}</p>
                </div>
              );
              
            default:
              return assertNever(coursePart);
          }
        }
        )
      }
    </div>
  )
}

const Header = ({ courseName } : { courseName: string}) => {
  return (
    <div>
      <h1>{courseName}</h1>
    </div>
  )
}


const Content = ({ courseParts } : { courseParts: CoursePart[] }) => {
  return (
    <div>
      <Part courseParts={courseParts} />
    </div>
  )
}

const Total = ({ totalExercises } : { totalExercises : number}) => {
  return (
    <div>
      <p>
        Number of exercises {totalExercises}
      </p>
    </div>
  )
}


const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    }
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total totalExercises={totalExercises} />
    </div>
  );
};

export default App;