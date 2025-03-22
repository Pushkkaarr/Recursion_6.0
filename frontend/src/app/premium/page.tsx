"use client";

import { useState } from "react";
import { 
  Layers,
  ShoppingCart, 
  X, 
  CheckCircle, 
  Plus, 
  Minus, 
  CreditCard,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Course data with actual images
const courses = [
  { id: "1", title: "Web Development", price: 7999, image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2400&auto=format&fit=crop" },
  { id: "2", title: "Data Science", price: 11999, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2400&auto=format&fit=crop" },
  { id: "3", title: "UI/UX Design", price: 9999, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2400&auto=format&fit=crop" },
];

const recommendedPackages = [
  { id: "r1", title: "Starter Pack", courses: ["Web Development"], price: 7999, image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2400&auto=format&fit=crop" },
  { id: "r2", title: "Pro Pack", courses: ["Web Development", "UI/UX Design"], price: 15999, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2400&auto=format&fit=crop" },
];

const comboPackages = [
  { id: "c1", title: "Full Stack Combo", courses: ["Web Development", "Data Science"], price: 17999, image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2400&auto=format&fit=crop" },
  { id: "c2", title: "Designer Combo", courses: ["UI/UX Design", "Data Science"], price: 19999, image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2400&auto=format&fit=crop" },
];

const saleCourses = [
  { id: "s1", title: "Python Basics", originalPrice: 6999, salePrice: 4999, image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=2400&auto=format&fit=crop" },
  { id: "s2", title: "Graphic Design", originalPrice: 9499, salePrice: 6499, image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2400&auto=format&fit=crop" },
];
interface CartItem {
  id: string;
  title: string;
  price: number;
  extras?: { videos: boolean; notes: boolean };
}

export default function PremiumPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customPackage, setCustomPackage] = useState({
    course: "",
    videos: false,
    notes: false,
  });
  const [showCart, setShowCart] = useState(false);

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => {
    let price = item.price;
    if (item.extras) {
      if (item.extras.videos) price += 1599;
      if (item.extras.notes) price += 1199;
    }
    return sum + price;
  }, 0);

  // Add custom package to cart
  const addCustomToCart = () => {
    if (!customPackage.course) {
      toast.error("Please select a course for your custom package.");
      return;
    }
    const course = courses.find(c => c.title === customPackage.course);
    if (!course) return;
    const cartItem: CartItem = {
      id: `${course.id}-${Date.now()}`,
      title: course.title,
      price: course.price,
      extras: { videos: customPackage.videos, notes: customPackage.notes },
    };
    setCart([...cart, cartItem]);
    setCustomPackage({ course: "", videos: false, notes: false });
    toast.success("Custom package added to cart!");
  };

  // Add pre-defined package or sale course to cart
  const addToCart = (title: string, price: number, id: string) => {
    setCart([...cart, { id, title, price }]);
    toast.success(`${title} added to cart!`);
  };

  // Remove item from cart
  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
    toast.success("Item removed from cart!");
  };

  // Mock payment gateway
  const handlePayment = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    toast.success(`Payment of ₹${totalPrice.toLocaleString()} processed successfully!`);
    setCart([]);
    setShowCart(false);
  };

  // Function to format price in INR with comma separators
  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="w-full px-6 py-8 mx-auto max-w-6xl space-y-12 animate-in fade-in duration-500">
      <Card className="border border-border/40 shadow-lg bg-card/80 backdrop-blur-md rounded-xl overflow-hidden">
        <CardHeader className="pb-6 bg-gradient-to-r from-stone-100 to-slate-100">
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="px-4 py-1 text-sm bg-primary/10 text-primary font-semibold rounded-full shadow-sm">
              Premium Subscriptions
            </Badge>
          </div>
          <CardTitle className="text-4xl mt-4 font-extrabold text-gray-900 tracking-tight">Elevate Your Learning Experience</CardTitle>
          <CardDescription className="text-lg text-gray-700 mt-2">
            Curated courses designed for the modern professional. Select from our premium offerings or customize your journey.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 pb-12 space-y-16">
          {/* Custom Package Section */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Plus size={24} className="text-emerald-700" /> Craft Your Learning Path
            </h2>
            <Card className="border border-border/30 bg-background/70 shadow-md rounded-xl hover:shadow-lg transition-all">
              <CardContent className="pt-8 space-y-8">
                <div>
                  <Label className="text-xl font-semibold text-gray-800">Select Your Course</Label>
                  <select
                    value={customPackage.course}
                    onChange={(e) => setCustomPackage({ ...customPackage, course: e.target.value })}
                    className="mt-3 w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                  >
                    <option value="">Choose a course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.title}>{course.title} - {formatPrice(course.price)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="videos"
                      checked={customPackage.videos}
                      onCheckedChange={(checked) => setCustomPackage({ ...customPackage, videos: !!checked })}
                      className="h-5 w-5 border-2"
                    />
                    <Label htmlFor="videos" className="text-lg text-gray-700 font-medium">Include Premium Videos <span className="text-emerald-700">(+₹1,599)</span></Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="notes"
                      checked={customPackage.notes}
                      onCheckedChange={(checked) => setCustomPackage({ ...customPackage, notes: !!checked })}
                      className="h-5 w-5 border-2"
                    />
                    <Label htmlFor="notes" className="text-lg text-gray-700 font-medium">Include Study Materials <span className="text-emerald-700">(+₹1,199)</span></Label>
                  </div>
                </div>
                <Button 
                  onClick={addCustomToCart} 
                  className="w-full bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white text-lg py-6 rounded-lg shadow-md"
                >
                  <Plus size={20} className="mr-2" /> Add to Cart
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Recommended Premium Cards */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <CheckCircle size={24} className="text-emerald-700" /> Curated Premium Collections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {recommendedPackages.map(pkg => (
                <Card key={pkg.id} className="border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="w-full overflow-hidden">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={pkg.image} 
                          alt={pkg.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" 
                        />
                      </AspectRatio>
                    </div>
                    <Badge className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full shadow-md z-10">
                      Recommended
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-6 pb-4">
                    <CardTitle className="text-xl font-semibold text-gray-800">{pkg.title}</CardTitle>
                    <CardDescription className="text-gray-600 mt-2 text-base">{pkg.courses.join(", ")}</CardDescription>
                    <p className="text-2xl font-bold text-emerald-700 mt-3">{formatPrice(pkg.price)}</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => addToCart(pkg.title, pkg.price, pkg.id)} 
                      variant="outline" 
                      className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-lg py-6"
                    >
                      <ShoppingCart size={20} className="mr-2" /> Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          {/* Combo Cards */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Layers size={24} className="text-amber-700" /> Exclusive Combinations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {comboPackages.map(pkg => (
                <Card key={pkg.id} className="border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="w-full overflow-hidden">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={pkg.image} 
                          alt={pkg.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" 
                        />
                      </AspectRatio>
                    </div>
                    <Badge className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full shadow-md z-10">
                      Best Value
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-6 pb-4">
                    <CardTitle className="text-xl font-semibold text-gray-800">{pkg.title}</CardTitle>
                    <CardDescription className="text-gray-600 mt-2 text-base">{pkg.courses.join(", ")}</CardDescription>
                    <p className="text-2xl font-bold text-emerald-700 mt-3">{formatPrice(pkg.price)}</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => addToCart(pkg.title, pkg.price, pkg.id)} 
                      variant="outline" 
                      className="w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-lg py-6"
                    >
                      <ShoppingCart size={20} className="mr-2" /> Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          {/* Sale Course Cards */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Tag size={24} className="text-rose-600" /> Limited Time Offers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {saleCourses.map(course => (
                <Card key={course.id} className="border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden relative">
                  <CardHeader className="p-0">
                    <div className="w-full overflow-hidden">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" 
                        />
                      </AspectRatio>
                    </div>
                    <Badge className="absolute top-3 right-3 bg-rose-600 text-white px-3 py-1 rounded-full shadow-md z-10">
                      {Math.round(((course.originalPrice - course.salePrice) / course.originalPrice) * 100)}% OFF
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-6 pb-4">
                    <CardTitle className="text-xl font-semibold text-gray-800">{course.title}</CardTitle>
                    <div className="mt-2">
                      <span className="text-gray-500 line-through text-lg">{formatPrice(course.originalPrice)}</span>
                      <span className="text-2xl font-bold text-rose-600 ml-3">{formatPrice(course.salePrice)}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => addToCart(course.title, course.salePrice, course.id)} 
                      variant="outline" 
                      className="w-full border-rose-500 text-rose-600 hover:bg-rose-50 text-lg py-6"
                    >
                      <ShoppingCart size={20} className="mr-2" /> Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          {/* Cart Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <ShoppingCart size={24} className="text-emerald-700" /> Your Selection
              </h2>
              <Button 
                onClick={() => setShowCart(!showCart)} 
                variant="outline" 
                className="text-lg border-gray-300 hover:bg-gray-100"
              >
                {showCart ? <X size={20} /> : <ShoppingCart size={20} />} {showCart ? "Hide Cart" : "View Cart"} ({cart.length})
              </Button>
            </div>
            {showCart && (
              <Card className="border border-border/30 shadow-lg rounded-xl overflow-hidden">
                <CardContent className="pt-8 space-y-6">
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart size={60} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-600 text-lg text-center">Your cart is empty</p>
                      <p className="text-gray-500 mt-2">Begin your learning journey today</p>
                    </div>
                  ) : (
                    <>
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center border-b border-gray-200 pb-4">
                          <div>
                            <p className="font-semibold text-gray-800 text-lg">{item.title}</p>
                            {item.extras && (
                              <p className="text-sm text-gray-600 mt-1">
                                {item.extras.videos && "Premium Videos (+₹1,599) "} 
                                {item.extras.notes && "Study Materials (+₹1,199)"}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-6">
                            <p className="text-emerald-700 font-bold text-xl">
                              {formatPrice(item.price + (item.extras?.videos ? 1599 : 0) + (item.extras?.notes ? 1199 : 0))}
                            </p>
                            <Button 
                              variant="ghost" 
                              onClick={() => removeFromCart(item.id)} 
                              className="text-rose-600 hover:text-rose-800"
                            >
                              <Minus size={20} />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Separator />
                      <div className="flex justify-between items-center pt-6">
                        <p className="text-xl font-semibold text-gray-800">Total:</p>
                        <p className="text-2xl font-bold text-emerald-700">{formatPrice(totalPrice)}</p>
                      </div>
                      <Button 
                        onClick={handlePayment} 
                        className="w-full bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white text-lg py-6 rounded-lg shadow-md"
                      >
                        <CreditCard size={20} className="mr-2" /> Complete Purchase ({formatPrice(totalPrice)})
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}