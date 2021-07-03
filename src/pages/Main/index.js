/* eslint-disable import/first */
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FiMaximize2 } from "react-icons/fi";
import { FaRegWindowMinimize } from "react-icons/fa";

const electron = window.electron;

import "./styles.css";

const regex = new RegExp("[0-9]");

function Main() {
  const [value, setValue] = useState("0");
  const [operation, setOperation] = useState("");
  const [preResult, setPreResult] = useState("");

  const [digits] = useState([
    { value: "%", label: "mod" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "/", label: "÷" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "*", label: "x" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "-", label: "-" },
    { value: "+/-", label: "+/-" },
    { value: "0", label: "0" },
    { value: "=", label: "=" },
    { value: "+", label: "+" },
  ]);

  useEffect(() => {
    const digitsGrid = document.getElementById("digits");

    if (digitsGrid) {
      while (digitsGrid.children.length % 4 > 0) {
        let newSpan = document.createElement("span");
        digitsGrid.insertBefore(newSpan, digitsGrid.firstChild);
      }
    }
  }, []);

  function increment(key) {
    if (!regex.test(key)) {
      if (key === "+/-") {
        var invertValue = Number(value) * -1;

        if (invertValue) setValue(invertValue);
      } else if (key === "=") {
        var operationTotal = operation + value;

        try {
          var result = eval(operationTotal);
          setValue(String(result));
          setOperation("");
          setPreResult("");
        } catch (err) {}
      } else {
        var preResultTotal = operation + value;

        try {
          setPreResult(String(eval(preResultTotal)));
        } catch (err) {}

        setOperation(operation + " " + value + " " + key);
        setValue("0");
      }

      return;
    }

    var preResultTotal = operation + key;

    try {
      setPreResult(String(eval(preResultTotal)));
    } catch (err) {}

    if (value === "0" || value === "") {
      setValue(String(key));
    } else {
      setValue(value + "" + key);
    }
  }

  function cleanValue() {
    setValue("0");
  }

  function cleanAll() {
    setValue("0");
    setPreResult("");
    setOperation("");
  }

  function closeWindow() {
    electron.remote.getCurrentWindow().close();
  }

  function minimazeWindow() {
    electron.remote.getCurrentWindow().minimize();
  }

  function maximazeWindow() {
    if (electron.remote.getCurrentWindow().isMaximized()) {
      electron.remote.getCurrentWindow().restore();
    } else {
      electron.remote.getCurrentWindow().maximize();
    }
  }

  return (
    <div className="main-page">
      <header>
        <label>Calculadora</label>

        <button id="minimaze-button" onClick={() => minimazeWindow()}>
          <FaRegWindowMinimize />
        </button>
        <button id="maximaze-button" onClick={() => maximazeWindow()}>
          <FiMaximize2 />
        </button>
        <button id="close-button" onClick={() => closeWindow()}>
          <IoMdClose />
        </button>
      </header>

      <label className="operation">{operation}</label>

      <label className="pre-result">{preResult}</label>

      <input
        className="visor"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => console.log(event.key)}
        type="number"
        disabled
      />

      <div className="digits" id="digits">
        <button onClick={() => cleanValue()}>CE</button>
        <button onClick={() => cleanAll()}>C</button>
        {digits.map((item) => (
          <button onClick={(event) => increment(item.value)}>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Main;
