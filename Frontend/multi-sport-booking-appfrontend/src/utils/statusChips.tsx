import React from 'react';
import { Chip } from 'react-native-paper';

export function SlotStatusChip({ status }: { status: 'AVAILABLE' | 'BOOKED' | 'UNAVAILABLE' }) {
  const color = status === 'AVAILABLE' ? '#C8E6C9' : status === 'BOOKED' ? '#FFF9C4' : '#FFCDD2';
  return <Chip style={{ backgroundColor: color }}>{status}</Chip>;
}

export function PaymentStatusChip({ status }: { status: 'PENDING' | 'SUCCESS' | 'FAILED' }) {
  const color = status === 'SUCCESS' ? '#C8E6C9' : status === 'PENDING' ? '#FFF9C4' : '#FFCDD2';
  return <Chip style={{ backgroundColor: color }}>{status}</Chip>;
}

export function VenueStatusChip({ status }: { status: 'ACTIVE' | 'INACTIVE' }) {
  const color = status === 'ACTIVE' ? '#C8E6C9' : '#FFCDD2';
  return <Chip style={{ backgroundColor: color }}>{status}</Chip>;
}
