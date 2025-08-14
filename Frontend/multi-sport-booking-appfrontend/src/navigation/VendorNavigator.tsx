import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import VendorDashboardScreen from '../screens/VendorDashboardScreen';
import VenueManagementScreen from '../screens/VenueManagementScreen';
import SportManagementScreen from '../screens/SportManagementScreen';
import SlotManagementScreen from '../screens/SlotManagementScreen';
import BookingManagementScreen from '../screens/BookingManagementScreen';
import EarningsScreen from '../screens/EarningsScreen';

const Tab = createBottomTabNavigator();

export default function VendorNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={VendorDashboardScreen} />
      <Tab.Screen name="Venues" component={VenueManagementScreen} />
      <Tab.Screen name="Sports" component={SportManagementScreen} />
      <Tab.Screen name="Slots" component={SlotManagementScreen} />
      <Tab.Screen name="Bookings" component={BookingManagementScreen} />
      <Tab.Screen name="Earnings" component={EarningsScreen} />
    </Tab.Navigator>
  );
}
