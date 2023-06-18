import { useRef, useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Contract({ value, text }) {
  const spanEle = useRef(null);
  const spanEleText = useRef(null);
  const [eventValue, setEventValue] = useState("");
  const [eventText, setEventText] = useState("text");
  const [oldEventsValue, setOldEventsValue] = useState([]);
  const [oldEventsText, setOldEventsText] = useState([]);

  const {
    state: { contract },
  } = useEth();

  useEffect(() => {
    spanEle.current.classList.add("flash");
    const flash = setTimeout(() => {
      spanEle.current.classList.remove("flash");
    }, 300);
    return () => {
      clearTimeout(flash);
    };
  }, [value]);

  useEffect(() => {
    spanEleText.current.classList.add("flash");
    const flash = setTimeout(() => {
      spanEleText.current.classList.remove("flash");
    }, 300);
    return () => {
      clearTimeout(flash);
    };
  }, [text]);

  useEffect(() => {
    (async () => {
      let oldEventsValue = await contract.getPastEvents("ValueChanged", {
        fromBlock: 0,
        toBlock: "latest",
      });
      let oldiesValue = [];
      oldEventsValue.forEach((event) => {
        oldiesValue.push(event.returnValues.newValue);
      });
      setOldEventsValue(oldiesValue);

      console.log("oldEventsValue", oldEventsValue);
      await contract.events
        .ValueChanged({ fromBlock: "earliest" })
        .on("data", (event) => {
          setEventValue(event.returnValues.newValue);
        })
        .on("error", console.error)
        .on("changed", (change) => {
          console.log("change", change);
        })
        .on("connected", (str) => {
          console.log("str", str);
        });
    })();

    (async () => {
      let oldEventsText = await contract.getPastEvents("TextChanged", {
        fromBlock: 0,
        toBlock: "latest",
      });
      let oldiesText = [];
      oldEventsText.forEach((event) => {
        oldiesText.push(event.returnValues.newText);
      });
      setOldEventsText(oldiesText);

      await contract.events
        .TextChanged({ fromBlock: "earliest" })
        .on("data", (event) => {
          setEventText(event.returnValues.newText);
        })
        .on("error", console.error)
        .on("changed", (change) => {
          console.log("change", change);
        })
        .on("connected", (str) => {
          console.log("str", str);
        });
    })();

    return () => {
      contract.events.ValueChanged().removeAllListeners();
      contract.events.TextChanged().removeAllListeners();
    };
  }, [contract]);

  return (
    <code>
      {`contract SimpleStorage {
  uint256 value = `}
      <span className="secondary-color" ref={spanEle}>
        <strong>{value}</strong>
      </span>
      {`;
      string text = `}
      <span className="secondary-color" ref={spanEleText}>
        <strong>{text}</strong>
      </span>
      {`;

  function read() public view returns (uint256) {
    return value;
  }

  function write(uint256 newValue) public {
    value = newValue;
  }
}
      
      ValueEvents arriving: `}{" "}
      {eventValue}{" "}
      {`
      oldEventsValue: `}{" "}
      {oldEventsValue.join(", ")}{" "}
      {`
      TextEvents arriving: `}{" "}
      {eventText}{" "}
      {`
      oldEventsText: `}{" "}
      {oldEventsText.join(", ")}
    </code>
  );
}

export default Contract;
