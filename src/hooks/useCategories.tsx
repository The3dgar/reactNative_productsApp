import React, { useEffect, useState } from "react";
import productsApi from "../api/productsApi";
import {
  Categoria,
  CategoriesResponse,
} from "../interface/categoriesInterface";

export const useCategories = () => {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getCategories = async () => {
    const { data } = await productsApi.get<CategoriesResponse>("/categorias");
    setCategories(data.categorias);
    setIsLoading(false);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return {
    isLoading,
    categories,
  };
};
