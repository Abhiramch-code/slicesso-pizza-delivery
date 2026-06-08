import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

let socket = null;

export const connectSocket = (userId) => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    if (userId) {
      socket.emit('join', userId);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export const onOrderUpdate = (callback) => {
  if (socket) {
    socket.on('order-update', callback);
  }
};

export const offOrderUpdate = (callback) => {
  if (socket) {
    socket.off('order-update', callback);
  }
};

export const onOrderStatusUpdate = (callback) => {
  if (socket) {
    socket.on('order-status-update', callback);
  }
};

export const offOrderStatusUpdate = (callback) => {
  if (socket) {
    socket.off('order-status-update', callback);
  }
};

export const onNewOrder = (callback) => {
  if (socket) {
    socket.on('new-order', callback);
  }
};

export const offNewOrder = (callback) => {
  if (socket) {
    socket.off('new-order', callback);
  }
};