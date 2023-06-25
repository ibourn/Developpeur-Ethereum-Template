"use client";
import { React, useState, useEffect } from "react";
import Link from "next/link";

const jeu = () => {
  const [number, setNumber] = useState(0);

  const increment = () => {
    setNumber(number + 1);
  };
  const decrement = () => {
    setNumber(number - 1);
  };

  useEffect(() => {
    console.log("useEffect");

    return () => {
      console.log("useEffect cleanup");
    };
  }, [number]);

  useEffect(() => {
    console.log("useEffect sans dependance");

    return () => {
      console.log("useEffect cleanup sans dependance");
    };
  }, []);
  //fragment => pour avoir un enfant unique

  return (
    <>
      <button onClick={() => increment()}>+</button>
      <div>{number}</div>
      <button onClick={() => decrement()}>-</button>
      <Link href="/"> Home </Link>
    </>
  );
};

export default jeu;
