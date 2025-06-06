
import { useNavigate } from "react-router-dom"
import { serviceCategories, getFeaturedCategories, getAfricanCategories, getGlobalCategories } from "@/data/serviceCategories"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ServiceCategories() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("featured");
  
  const handleCategoryClick = (categoryId: string) => {
    console.log("Navigating to category:", categoryId);
    navigate(`/categories?category=${encodeURIComponent(categoryId)}`);
  };

  const featuredCategories = getFeaturedCategories();
  const africanCategories = getAfricanCategories();
  const globalCategories = getGlobalCategories();

  const renderCategories = (categories: typeof serviceCategories) => (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {categories.map((category) => {
        const IconComponent = category.icon;
        return (
          <div 
            key={category.id} 
            className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer group"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className={`p-3 rounded-full mb-4 transition-colors group-hover:scale-110 ${category.color}`}>
              <IconComponent className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-1 text-center text-gray-900 dark:text-white">{category.name}</h3>
            <p className="text-sm text-center text-gray-600 dark:text-gray-300 line-clamp-2">{category.description}</p>
            {category.region === 'Africa' && (
              <span className="mt-2 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full">
                Africa
              </span>
            )}
            {category.featured && (
              <span className="mt-2 px-2 py-1 bg-servie text-white text-xs rounded-full">
                Popular
              </span>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <section id="services" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
              Explore Our Service Categories
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Browse through our comprehensive range of services including specialized African market solutions
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 max-w-md mx-auto">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="african">African Focus</TabsTrigger>
            <TabsTrigger value="all">All Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured" className="space-y-6">
            <h3 className="text-2xl font-semibold text-center mb-6">Most Popular Services</h3>
            {renderCategories(featuredCategories)}
          </TabsContent>
          
          <TabsContent value="african" className="space-y-6">
            <h3 className="text-2xl font-semibold text-center mb-6">African Market Solutions</h3>
            {renderCategories(africanCategories)}
          </TabsContent>
          
          <TabsContent value="all" className="space-y-6">
            <h3 className="text-2xl font-semibold text-center mb-6">All Service Categories</h3>
            {renderCategories(serviceCategories)}
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
          <Button 
            onClick={() => navigate('/categories')}
            className="bg-servie hover:bg-servie-600 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            View All Services
          </Button>
        </div>
      </div>
    </section>
  )
}
