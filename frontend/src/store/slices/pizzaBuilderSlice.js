import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentStep: 1, // 1: Base, 2: Sauce & Cheese, 3: Veggies, 4: Meat
  pizza: {
    base: '',
    sauce: '',
    cheese: '',
    veggies: [],
    meat: [],
    quantity: 1,
    price: 0,
  },
};

const pizzaBuilderSlice = createSlice({
  name: 'pizzaBuilder',
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < 4) state.currentStep += 1;
    },
    prevStep: (state) => {
      if (state.currentStep > 1) state.currentStep -= 1;
    },
    updatePizza: (state, action) => {
      state.pizza = { ...state.pizza, ...action.payload };
    },
    toggleTopping: (state, action) => {
      const { type, name } = action.payload; // type is 'veggies' or 'meat'
      const index = state.pizza[type].indexOf(name);
      if (index === -1) {
        state.pizza[type].push(name);
      } else {
        state.pizza[type].splice(index, 1);
      }
    },
    resetBuilder: (state) => {
      state.currentStep = 1;
      state.pizza = initialState.pizza;
    },
  },
});

export const { setStep, nextStep, prevStep, updatePizza, toggleTopping, resetBuilder } = pizzaBuilderSlice.actions;
export default pizzaBuilderSlice.reducer;
