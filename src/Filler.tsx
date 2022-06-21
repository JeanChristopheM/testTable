import React, { useState } from "react";

const Filler = () => {
  const [truc, setTruc] = useState(0);

  const increment = () => setTruc((old) => old + 1);
  return (
    <div style={{ backgroundColor: "#fefefe", height: "300px" }}>
      <p>{truc}</p>
      <button type="button" onClick={increment}>
        INCREMENT
      </button>
    </div>
  );
};

export default Filler;
