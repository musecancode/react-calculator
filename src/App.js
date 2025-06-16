import "./index.css";
import { useState } from "react";
import { evaluate } from "mathjs";

export default function App() {
  return (
    <div className="App">
      <Calculator />
    </div>
  );
}

function Calculator() {
  const [displayInput, setDisplayInput] = useState("");

  const [result, setResult] = useState("");

  const handleClick = (value) => {
    if (result && ["+", "-", "*", "/"].includes(value) && displayInput === "") {
      setDisplayInput(result + value);
      setResult("");
    } else if (result && displayInput === "") {
      setDisplayInput(value);
      setResult("");
    } else {
      setDisplayInput((prev) => prev + value);
      setResult("");
    }
  };

  const handleSqrt = () => {
    setDisplayInput((prev) => prev + "√");

    setResult("");
  };

  const handleBackspace = () => {
    setDisplayInput((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setDisplayInput("");
    setResult("");
  };

  const handleCalculate = () => {
    try {
      let expr = "";
      for (let i = 0; i < displayInput.length; i++) {
        if (displayInput[i] === "√") {
          if (displayInput[i + 1] === "(") {
            expr += "sqrt";
          } else {
            expr += "sqrt(";
            i++;
            while (i < displayInput.length && /[\d.]/.test(displayInput[i])) {
              expr += displayInput[i];
              i++;
            }
            expr += ")";
            i--;
          }
        } else {
          expr += displayInput[i];
        }
      }

      const res = evaluate(expr);
      setResult(res.toString());
      setDisplayInput("");
    } catch {
      setResult("Error");
      setDisplayInput("");
    }
  };

  return (
    <div className="calculator">
      <h2>CALCULATOR</h2>
      <Display value={displayInput || result || ""} />
      <ButtonPanel
        onClick={handleClick}
        onClear={handleClear}
        onCalculate={handleCalculate}
        onBackspace={handleBackspace}
        onSqrt={handleSqrt}
      />
    </div>
  );
}

function ButtonPanel({ onClick, onClear, onCalculate, onBackspace, onSqrt }) {
  const buttons = [
    "C",
    "(",
    ")",
    "Del",
    "7",
    "8",
    "9",
    "/",
    "4",
    "5",
    "6",
    "*",
    "1",
    "2",
    "3",
    "-",
    "√",
    "0",
    ".",
    "+",
  ];

  return (
    <div className="buttons">
      {buttons.map((label) => (
        <Button
          key={label}
          label={label}
          onClick={
            label === "C"
              ? onClear
              : label === "Del"
              ? onBackspace
              : label === "√"
              ? onSqrt
              : onClick
          }
        />
      ))}
      <Button label="=" onClick={onCalculate} className="equal" />
    </div>
  );
}

function Button({ label, onClick, className = "" }) {
  return (
    <button className={className} onClick={() => onClick(label)}>
      {label}
    </button>
  );
}

function Display({ value }) {
  return <div className="display">{value}</div>;
}
