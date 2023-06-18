import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function ContractBtns({ setValue, setText }) {
  const {
    state: { contract, accounts },
  } = useEth();
  const [inputValue, setInputValue] = useState("");
  const [inputText, setInputText] = useState("text");

  const handleInputChange = (e) => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setInputValue(e.target.value);
    }
  };
  const handleTextChange = (e) => {
    // if (/[a - zA - Z]/.test(e.target.value)) {
    setInputText(e.target.value);
    // }
  };

  const read = async () => {
    const value = await contract.methods.read().call({ from: accounts[0] });
    setValue(value);
  };

  const write = async (e) => {
    if (e.target.tagName === "INPUT") {
      return;
    }
    if (inputValue === "") {
      alert("Please enter a value to write.");
      return;
    }
    const newValue = parseInt(inputValue);
    await contract.methods.write(newValue).send({ from: accounts[0] });
  };

  const readText = async () => {
    const text = await contract.methods.greet().call({ from: accounts[0] });
    setText(text);
  };

  const writeText = async (e) => {
    if (e.target.tagName === "INPUT") {
      return;
    }
    if (inputText === "") {
      alert("Please enter a value to write.");
      return;
    }
    const newText = inputText;
    await contract.methods.setGreet(newText).send({ from: accounts[0] });
  };

  return (
    <div className="btns">
      <button onClick={read}>read()</button>

      <div onClick={write} className="input-btn">
        write(
        <input
          type="text"
          placeholder="uint"
          value={inputValue}
          onChange={handleInputChange}
        />
        )
      </div>

      <button onClick={readText}>readText()</button>

      <div onClick={writeText} className="input-btn">
        writeText(
        <input
          type="text"
          placeholder="string"
          value={inputText}
          onChange={handleTextChange}
        />
        )
      </div>
    </div>
  );
}

export default ContractBtns;
