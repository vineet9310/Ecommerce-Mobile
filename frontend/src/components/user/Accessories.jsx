import React, { useEffect, useState } from "react";
import axios from "axios";

const Accessories = () => {
  const [accessories, setAccessories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/accessories")
      .then(res => setAccessories(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Phone Accessories</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
        {accessories.map(item => (
          <div key={item.id} style={{ border: "1px solid #eee", padding: "1rem", width: "200px" }}>
            <img src={item.image} alt={item.name} style={{ width: "100%", height: "120px", objectFit: "cover" }} />
            <h4>{item.name}</h4>
            <p>{item.description}</p>
            <b>Rs. {item.price}</b>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accessories;