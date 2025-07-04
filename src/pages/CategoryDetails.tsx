
import React from 'react';
import { useParams } from 'react-router-dom';
import ServiceCategories from './ServiceCategories';

export default function CategoryDetails() {
  const { categoryId } = useParams();
  return <ServiceCategories />;
}
