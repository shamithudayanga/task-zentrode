'use client'

import Image from "next/image";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
};

type ProductsResponse = {
  products: Product[];
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("https://dummyjson.com/products?limit=10")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Products request failed (${response.status})`);
        }
        return response.json() as Promise<ProductsResponse>;
      })
      .then((result) => {
        if (!cancelled) setProducts(result.products);
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load products",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (products.length === 0) return <p>No products found.</p>;

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 font-sans dark:bg-black sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-zinc-900"
            >
              <Image
                className="h-56 w-full object-cover"
                src={product.thumbnail}
                alt={product.title}
                width={400}
                height={224}
              />
              <div className="space-y-3 p-5">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {product.title}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  {product.description}
                </p>
                <p className="font-semibold text-zinc-900 dark:text-white">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
