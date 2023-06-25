//ici sera page de route /contact
"use client";
//rafce
import React from "react";
import { useThemeContext } from "../context/theme";

const contact = () => {
  const { color, setColor } = useThemeContext();
  return (
    <>
      <h1 style={{ color: color }}>contact</h1>
      <div>contact</div>
      <button onClick={() => setColor("red")}>red</button>
      <button onClick={() => setColor("blue")}>blue</button>
      <button onClick={() => setColor("white")}>white</button>
      <button onClick={() => setColor("lemon")}>lemon</button>
    </>
  );
};

export default contact;
