
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { useProductData } from "@/hooks/useProductData";

const EcommerceShop = () => {
  const { products, categories, isLoading } = useProductData();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [view, setView] = useState("grid");
  
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return b.featured ? 1 : -1; // Featured items first
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Shop Hero Section */}
        <div className="bg-muted py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Shop Quality Products</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Browse our selection of high-quality products from trusted providers
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/categories">Browse Services</Link>
                </Button>
                <Button size="lg" variant="outline">
                  Become a Seller
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Shop Content */}
        <div className="container mx-auto px-4 py-10">
          {/* Shop Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="w-full md:w-auto">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
              
              <Tabs value={view} onValueChange={setView} className="hidden md:block">
                <TabsList>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button 
              variant={selectedCategory === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button 
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
          
          {/* Product Grid/List */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
              <Button onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className={
              view === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
                : "flex flex-col gap-4"
            }>
              {sortedProducts.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  layout={view as "grid" | "list"}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EcommerceShop;
