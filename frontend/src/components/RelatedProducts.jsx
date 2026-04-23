import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const RelatedProducts = ({ category, subCategory, currentProductId }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();

      productsCopy = productsCopy.filter(
        (item) =>
          category === item.category &&
          item.subCategory === subCategory &&
          item._id !== currentProductId,
      );

      setRelated(productsCopy.slice(0, 5));
    }
  }, [products, category, subCategory, currentProductId]);

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>

      {related.length === 0 ? (
        // empty related products
        <div className="border border-gray-200 rounded-md py-10 px-6 text-center text-gray-600">
          <p className="text-base font-medium text-gray-800">
            No related products
          </p>
          <p className="mt-2 text-sm">
            Check back later for similar items.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-4">
          {related.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
