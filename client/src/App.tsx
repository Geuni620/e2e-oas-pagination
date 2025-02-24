import "./App.css";
import { DataTable } from "./components/data-table/data-table";
import { useState, useEffect } from "react";
import { getApiProducts } from "./api/product";
import { Product } from "./model";

const App = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let ignore = true;

    const fetchProducts = async () => {
      const {
        data: { data },
      } = await getApiProducts();

      if (!ignore) {
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
