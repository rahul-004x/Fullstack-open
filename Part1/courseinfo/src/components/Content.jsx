import Part from "./Part";

const Content = ({ parts }) => {
  console.log("parts", parts);
  return (
    <>
      {parts.map((part, index) => (
        <Part key={index} part={part.name} exercises={part.exercises} />
      ))}
    </>
  );
};

export default Content;