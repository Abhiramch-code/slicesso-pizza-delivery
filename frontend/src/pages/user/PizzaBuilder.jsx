import { useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../../store/slices/cartSlice';
import api from '../../services/api';
import { toppingSVGs } from '../../components/pizza/PizzaToppingSVG';

const steps = [
  { 
    title: "Select Your Crust", 
    sub: "The foundation of every great pizza.",
    options: [
      { name: "Thin Crust", price: 200, sub: "Crispy, light, and traditional." },
      { name: "Thick Crust", price: 250, sub: "Thick, buttery crust with high edges." },
      { name: "Stuffed Crust", price: 300, sub: "Mozzarella filled outer ring." },
      { name: "Cheese Burst", price: 350, sub: "Overflowing with cheese." },
      { name: "Whole Wheat", price: 220, sub: "Healthy alternative." }
    ],
    type: 'radio',
    key: 'base'
  },
  { 
    title: "Choose Your Sauce", 
    sub: "Bold flavors to complement your toppings.",
    options: [
      { name: "Tomato Basil", price: 30, sub: "Sun-ripened San Marzano tomatoes." },
      { name: "BBQ", price: 40, sub: "Sweet and smoky." },
      { name: "Pesto", price: 50, sub: "Fresh basil and pine nut blend." },
      { name: "Garlic Parmesan", price: 45, sub: "Rich garlic parmesan base." },
      { name: "Arrabbiata", price: 35, sub: "Spicy kick." }
    ],
    type: 'radio',
    key: 'sauce'
  },
  { 
    title: "Extra Cheese?", 
    sub: "Select your favorite dairy options.",
    options: [
      { name: "Mozzarella", price: 60, sub: "Fresh, melty perfection." },
      { name: "Cheddar", price: 70, sub: "Sharp and tangy." },
      { name: "Parmesan", price: 80, sub: "Aged and salty." },
      { name: "Mixed", price: 90, sub: "Best of all worlds." }
    ],
    type: 'radio',
    key: 'cheese'
  },
  { 
    title: "Prime Veggies", 
    sub: "Fresh from the farm.",
    options: [
      { name: "Onion", price: 20 },
      { name: "Capsicum", price: 20 },
      { name: "Tomato", price: 15 },
      { name: "Mushroom", price: 30 },
      { name: "Corn", price: 20 },
      { name: "Olive", price: 35 },
      { name: "Jalapeno", price: 25 },
      { name: "Paneer", price: 50 }
    ],
    type: 'checkbox',
    key: 'veggies'
  },
  { 
    title: "Premium Meat", 
    sub: "For the carnivores.",
    options: [
      { name: "Chicken", price: 60 },
      { name: "Pepperoni", price: 70 },
      { name: "Sausage", price: 65 },
      { name: "Bacon", price: 75 }
    ],
    type: 'checkbox',
    key: 'meat'
  },
  { 
    title: "Review & Order", 
    sub: "Looks delicious! Ready to add to cart?",
    type: 'review'
  }
];

const PizzaBuilder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({
    base: "Thin Crust",
    sauce: "Tomato Basil",
    cheese: "Mozzarella",
    veggies: [],
    meat: [],
    quantity: 1
  });

  // Handle pre-selected ingredients from menu
  useEffect(() => {
    if (location.state?.preSelected) {
      setSelections(prev => ({
        ...prev,
        base: location.state.preSelected.base || prev.base,
        sauce: location.state.preSelected.sauce || prev.sauce,
        cheese: location.state.preSelected.cheese || prev.cheese,
        veggies: location.state.preSelected.veggies || [],
        meat: location.state.preSelected.meat || [],
      }));
    }
  }, [location.state]);
  
  const totalPrice = useMemo(() => {
    let total = 0;
    const baseOpt = steps[0].options.find(o => o.name === selections.base);
    if (baseOpt) total += baseOpt.price;
    
    const sauceOpt = steps[1].options.find(o => o.name === selections.sauce);
    if (sauceOpt) total += sauceOpt.price;
    
    const cheeseOpt = steps[2].options.find(o => o.name === selections.cheese);
    if (cheeseOpt) total += cheeseOpt.price;
    
    selections.veggies.forEach(v => {
      const vOpt = steps[3].options.find(o => o.name === v);
      if (vOpt) total += vOpt.price;
    });
    
    selections.meat.forEach(m => {
      const mOpt = steps[4].options.find(o => o.name === m);
      if (mOpt) total += mOpt.price;
    });
    
    return total;
  }, [selections.base, selections.sauce, selections.cheese, selections.veggies, selections.meat]);

  const [savingFavorite, setSavingFavorite] = useState(false);

  const crustStyles = {
    'Thin Crust': 'from-[#e8c99b] to-[#d4a574]',
    'Thick Crust': 'from-[#c4956a] to-[#a87d52]',
    'Stuffed Crust': 'from-[#dbb878] to-[#c9a55e]',
    'Cheese Burst': 'from-[#f0d58c] to-[#e0c36e]',
    'Whole Wheat': 'from-[#b89a6a] to-[#96794e]',
  };

  const sauceStyles = {
    'Tomato Basil': 'bg-red-600/70',
    'BBQ': 'bg-amber-800/70',
    'Pesto': 'bg-green-700/70',
    'Garlic Parmesan': 'bg-amber-200/70',
    'Arrabbiata': 'bg-red-800/70',
  };

  const cheeseStyles = {
    'Mozzarella': 'from-[#fff5cc] to-[#ffe680]',
    'Cheddar': 'from-[#ffcc66] to-[#e6a820]',
    'Parmesan': 'from-[#f5f0dc] to-[#e8dfc0]',
    'Mixed': 'from-[#ffe699] to-[#e6c84d]',
  };

  const veggieIcons = {
    'Onion': '🧅',
    'Capsicum': '🫑',
    'Tomato': '🍅',
    'Mushroom': '🍄',
    'Corn': '🌽',
    'Olive': '🫒',
    'Jalapeno': '🌶️',
    'Paneer': '🧈',
  };

  const meatIcons = {
    'Chicken': '🍗',
    'Pepperoni': '🥓',
    'Sausage': '🌭',
    'Bacon': '🥓',
  };

  const handleSaveFavorite = async () => {
    setSavingFavorite(true);
    try {
      await api.post('/favorites', {
        name: `${selections.base} + ${selections.sauce}`,
        base: selections.base,
        sauce: selections.sauce,
        cheese: selections.cheese,
        veggies: selections.veggies,
        meat: selections.meat,
        price: totalPrice,
      });
    } catch (err) {
      console.error('Error saving favorite', err);
    }
    setSavingFavorite(false);
  };

  const generateToppingPositions = (items, startIndex) => {
    const positions = [];
    items.forEach((item, i) => {
      const angle = ((startIndex + i) * 137.508 * (Math.PI / 180));
      const radius = 20 + ((startIndex + i) % 3) * 12;
      const cx = 50 + radius * Math.cos(angle);
      const cy = 50 + radius * Math.sin(angle);
      const ToppingSVG = toppingSVGs[item];
      positions.push({
        key: item,
        svg: ToppingSVG,
        left: `${cx}%`,
        top: `${cy}%`,
      });
    });
    return positions;
  };

  const toppingPositions = useMemo(() => {
    return [
      ...generateToppingPositions(selections.veggies, 0),
      ...generateToppingPositions(selections.meat, selections.veggies.length),
    ];
  }, [selections.veggies, selections.meat]);

  const crustGradient = crustStyles[selections.base] || crustStyles['Thin Crust'];
  const sauceBg = sauceStyles[selections.sauce] || sauceStyles['Tomato Basil'];
  const cheeseGradient = cheeseStyles[selections.cheese] || cheeseStyles['Mozzarella'];

  const handleSelection = (key, val, type) => {
    setSelections(prev => {
      const newSelections = { ...prev };
      if (type === 'radio') {
        newSelections[key] = val;
      } else {
        const index = newSelections[key].indexOf(val);
        if (index > -1) {
          newSelections[key] = [...newSelections[key].slice(0, index), ...newSelections[key].slice(index + 1)];
        } else {
          newSelections[key] = [...newSelections[key], val];
        }
      }
      return newSelections;
    });
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...selections, price: totalPrice }));
    navigate('/cart');
  };

  const step = steps[currentStep];

  return (
    <div className="pb-32 w-full max-w-container-max mx-auto">
      {/* Progress Stepper */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-surface-variant -translate-y-1/2 z-0"></div>
          <div 
            className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((s, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base ${idx <= currentStep ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-surface-variant text-on-surface-variant'}`}>
                {idx + 1}
              </div>
              <span className={`text-[10px] md:text-xs font-medium uppercase ${idx <= currentStep ? 'text-primary' : 'text-on-surface-variant'}`}>
                {s.title.split(' ')[1] || s.title.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: Live Pizza Preview (Sticky) */}
        <div className="md:col-span-6 lg:col-span-7 sticky top-24">
          <div className="relative aspect-square w-full max-w-[500px] mx-auto group">
            <div className="absolute inset-0 bg-secondary-container/10 rounded-full blur-3xl scale-90 group-hover:scale-100 transition-transform duration-700"></div>
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              {/* Plate */}
              <div className="absolute inset-4 rounded-full border border-outline-variant/30 shadow-2xl bg-white/10 backdrop-blur-sm"></div>
              
              {/* Crust - changes based on selection */}
              <div className={`absolute inset-8 rounded-full bg-gradient-to-br ${crustGradient} shadow-xl transition-all duration-500`}></div>
              
              {/* Sauce - changes color based on selection */}
              <div 
                className={`absolute inset-10 rounded-full ${sauceBg} mix-blend-multiply transition-all duration-500`} 
                style={{ opacity: selections.sauce ? '0.8' : '0' }}
              ></div>
              
              {/* Cheese - changes based on selection */}
              <div 
                className={`absolute inset-10 rounded-full overflow-hidden transition-opacity duration-500 bg-gradient-to-br ${cheeseGradient}`} 
                style={{ opacity: selections.cheese ? '1' : '0' }}
              >
              </div>

              {/* Toppings - SVG components for each topping */}
              <div 
                className="absolute inset-10 transition-opacity duration-500"
                style={{ opacity: (selections.veggies.length > 0 || selections.meat.length > 0) ? '1' : '0' }}
              >
                {toppingPositions.map((pos) => {
                  const ToppingSVG = pos.svg;
                  return (
                    <div 
                      key={pos.key} 
                      className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-md transition-all duration-300 hover:scale-125"
                      style={{ 
                        top: pos.top, 
                        left: pos.left,
                      }}
                    >
                      {ToppingSVG && <ToppingSVG />}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="absolute -bottom-4 right-8 bg-white/80 backdrop-blur-md py-3 px-6 rounded-xl flex items-center gap-3 z-20 border border-white/20 shadow-lg">
              <span className="text-xl">🔥</span>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface-variant uppercase">Est. Time</span>
                <span className="font-bold text-on-surface">12-15 Mins</span>
              </div>
            </div>
          </div>

          {/* Save Favorite Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSaveFavorite}
              disabled={savingFavorite}
              className="px-6 py-3 bg-white/60 backdrop-blur-md border border-primary/30 rounded-xl font-semibold text-primary hover:bg-primary/10 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span>❤️</span> {savingFavorite ? 'Saving...' : 'Save as Favorite'}
            </button>
          </div>
        </div>

        {/* Right: Ingredient Controls */}
        <div className="md:col-span-6 lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white/60 backdrop-blur-md border border-white/20 shadow-xl p-8 rounded-2xl flex flex-col gap-6 min-h-[500px]">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-bold text-on-surface">{step.title}</h2>
              <p className="text-on-surface-variant">{step.sub}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2">
              {step.type === 'review' ? (
                <div className="flex flex-col gap-4">
                  <div className="p-4 rounded-xl bg-surface-container flex justify-between">
                    <span className="font-bold">Crust</span>
                    <span>{selections.base}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container flex justify-between">
                    <span className="font-bold">Sauce</span>
                    <span>{selections.sauce}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container flex justify-between">
                    <span className="font-bold">Cheese</span>
                    <span>{selections.cheese}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container flex flex-col gap-2">
                    <span className="font-bold">Veggies</span>
                    <div className="flex flex-wrap gap-2">
                      {selections.veggies.length ? selections.veggies.map(t => (
                        <span key={t} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">{t}</span>
                      )) : <span className="text-on-surface-variant">None</span>}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container flex flex-col gap-2">
                    <span className="font-bold">Meat</span>
                    <div className="flex flex-wrap gap-2">
                      {selections.meat.length ? selections.meat.map(t => (
                        <span key={t} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">{t}</span>
                      )) : <span className="text-on-surface-variant">None</span>}
                    </div>
                  </div>
                </div>
              ) : (
                step.options.map((opt) => {
                  const isSelected = step.type === 'radio' 
                    ? selections[step.key] === opt.name 
                    : selections[step.key].includes(opt.name);

                  return (
                    <label 
                      key={opt.name} 
                      className={`group relative flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-transparent bg-white/40 hover:border-primary/50'
                      }`}
                    >
                      <input 
                        type={step.type} 
                        name={step.key} 
                        value={opt.name} 
                        className="hidden" 
                        checked={isSelected} 
                        onChange={() => handleSelection(step.key, opt.name, step.type)} 
                      />
                      <div className="flex-1 flex flex-col">
                        <span className="font-bold text-on-surface">{opt.name}</span>
                        {opt.sub && <span className="text-on-surface-variant text-sm">{opt.sub}</span>}
                      </div>
                      <span className="text-sm text-primary font-bold">+₹{opt.price}</span>
                      {isSelected && <span className="text-primary ml-2 text-xl">✓</span>}
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button 
              className={`flex-1 py-4 px-6 rounded-xl font-semibold bg-white/60 text-on-surface border border-outline-variant hover:bg-surface-variant transition-all ${currentStep === 0 ? 'invisible' : ''}`}
              onClick={() => setCurrentStep(prev => prev - 1)}
            >
              Back
            </button>
            <button 
              className="flex-[2] py-4 px-6 rounded-xl font-semibold bg-primary text-white shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
              onClick={() => {
                if (currentStep < steps.length - 1) {
                  setCurrentStep(prev => prev + 1);
                } else {
                  handleAddToCart();
                }
              }}
            >
              {currentStep < steps.length - 1 ? `Next: ${steps[currentStep + 1].title.split(' ')[1] || steps[currentStep + 1].title}` : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Sticky Pricing Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-white/20 z-40 py-4 px-8 md:px-16 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-container-max mx-auto flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Price</span>
            <span className="text-3xl font-black text-primary">₹{totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaBuilder;
