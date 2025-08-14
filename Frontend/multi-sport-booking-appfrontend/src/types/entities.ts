// Shared TypeScript interfaces for all major entities

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'VENDOR';
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  locationUrl: string;
  contactNumber: string;
  description: string;
  image: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Sport {
  id: string;
  name: string;
}

export interface VenueSport {
  id: string;
  venueId: string;
  sportId: string;
  pricePerHour: number;
}

export interface Slot {
  id: string;
  venueSportId: string;
  date: string; // YYYY-MM-DD
  start: string; // HH:MM
  end: string; // HH:MM
  available: boolean;
  price: number;
  status: 'AVAILABLE' | 'BOOKED' | 'UNAVAILABLE';
}

export interface Booking {
  id: string;
  userId: string;
  slotId: string;
  venueId: string;
  sportId: string;
  date: string;
  time: string;
  price: number;
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED';
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  commission: number;
  net: number;
  status: 'PAID' | 'PENDING';
  date: string;
}

export interface Review {
  id: string;
  userId: string;
  venueId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
