import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';

export default function EarningsChart({ data }) {
  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={{ marginBottom: 8 }}>Earnings (Last 7 Days)</Text>
      <VictoryChart theme={VictoryTheme.material} domainPadding={16} height={220}>
        <VictoryAxis tickFormat={d => d} style={{ tickLabels: { fontSize: 10 } }} />
        <VictoryAxis dependentAxis tickFormat={d => `₹${d}`} style={{ tickLabels: { fontSize: 10 } }} />
        <VictoryBar data={data} x="date" y="earnings" style={{ data: { fill: '#1976d2' } }} />
      </VictoryChart>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 24, alignItems: 'center', width: '100%' },
});
