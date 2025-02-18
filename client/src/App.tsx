import "./App.css";
import { DataTable } from "./components/data-table/data-table";
import { useState, useEffect } from "react";

const App = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let ignore = true;

    const fetchProducts = async () => {
      const response = await fetch("http://localhost:8787/api/products");
      const { data } = await response.json();
      if (ignore) {
        setProducts(data);
      }
    };

    fetchProducts();

    return () => {
      ignore = false;
    };
  }, []);

  return (
    <div>
      <DataTable data={products} />
    </div>
  );
};

export default App;
