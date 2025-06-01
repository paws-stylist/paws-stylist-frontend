'use client'
import React from "react";
import Hero from "./Hero";
import ProductCategories from "./ProductCategories";
import Products from "./Products";
import Services from "./Services";
import Reviews from "./Reviews";
import FAQ from "./FAQ";
import FeedingCollection from "./FeedingCollection";

const Homepage = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <ProductCategories />
      <FeedingCollection />
      {/* <Products /> */}
      <Services />
      <Products />
      <Reviews />
      <FAQ />
    </main>
  );
};

export default Homepage;
