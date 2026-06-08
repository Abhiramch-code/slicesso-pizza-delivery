import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../store/slices/cartSlice';
import api from '../../services/api';

const Menu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await api.get('/menu');
        setMenuItems(response.data.menuItems);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️' },
    { id: 'pizza', name: 'Pizzas', icon: '🍕' },
    { id: 'side', name: 'Sides', icon: '🍟' },
    { id: 'drink', name: 'Drinks', icon: '🥤' },
    { id: 'dessert', name: 'Desserts', icon: '🍰' },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (item) => {
    if (item.category === 'pizza') {
      // For pizzas, add with ingredients for customization
      dispatch(addToCart({
        ...item.ingredients,
        quantity: 1,
        price: item.price,
        name: item.name,
        isMenuItem: true,
        menuItemId: item._id,
      }));
    } else {
      // For sides, drinks, desserts - add as simple item
      dispatch(addToCart({
        name: item.name,
        quantity: 1,
        price: item.price,
        category: item.category,
        isMenuItem: true,
        menuItemId: item._id,
      }));
    }
    navigate('/cart');
  };

  const handleCustomize = (item) => {
    // Navigate to pizza builder with pre-selected ingredients
    navigate('/pizza-builder', { 
      state: { 
        preSelected: item.ingredients,
        menuItemId: item._id,
        menuItemName: item.name,
      } 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-on-surface-variant">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 w-full pb-32">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-on-surface">Our Menu</h1>
        <p className="text-on-surface-variant max-w-2xl mx-auto">
          Explore our delicious selection of handcrafted pizzas, crispy sides, refreshing drinks, and decadent desserts.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              selectedCategory === category.id
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-white/60 text-on-surface hover:bg-surface-variant border border-outline-variant/30'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="bg-white/60 backdrop-blur-md rounded-3xl overflow-hidden shadow-sm border border-outline-variant/30 hover:border-primary/30 transition-all group"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop';
                }}
              />
              {item.isPopular && (
                <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                  🔥 Popular
                </div>
              )}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-on-surface">
                {item.preparationTime} min
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
              <div>
                <h3 className="text-xl font-bold text-on-surface">{item.name}</h3>
                <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{item.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-2xl font-black text-primary">₹{item.price}</span>
                <div className="flex gap-2">
                  {item.category === 'pizza' && (
                    <button
                      onClick={() => handleCustomize(item)}
                      className="px-4 py-2 bg-surface-variant text-on-surface rounded-xl font-semibold text-sm hover:bg-surface-variant-hover transition-colors"
                    >
                      Customize
                    </button>
                  )}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="px-4 py-2 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <span className="text-6xl opacity-50">🍽️</span>
          <p className="text-on-surface-variant mt-4 font-medium">No items found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default Menu;
