interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartWithDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartWithDescription {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartWithDescription {
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartSpecial extends CoursePartWithDescription {
  requirements: string[];
  kind: "special";
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhadled descriminited union member: ${JSON.stringify(value)} `
  )
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

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

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case "basic":
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p>{part.description}</p>
        </div>
      );
    case "group":
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p>Group projects: {part.groupProjectCount}</p>
        </div>
      );
    case "background":
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p>{part.description}</p>
          <p>Background material: <a href={part.backgroundMaterial}>{part.backgroundMaterial}</a></p>
        </div>
      );
    case "special":
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p>{part.description}</p>
          <p>Requirements: {part.requirements.join(", ")}</p>
        </div>
      );
    default:
      return assertNever(part);
  }
};

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => (
  <div>
    {courseParts.map(part => (
      <Part key={part.name} part={part} />
    ))}
  </div>
);

const Header = ({ name }: { name: string }) => (
  <h1>{name}</h1>
);

const Total = ({ courseParts }: { courseParts: CoursePart[] }) => (
  <p>
    Number of exercises{" "}
    {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
  </p>
);

const courseName = "Half Stack application development";

const App = () => {
  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  )
};

export default App;