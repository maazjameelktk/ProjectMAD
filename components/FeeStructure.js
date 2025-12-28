import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Card, DataTable, Divider } from 'react-native-paper';

const FeeStructure = () => {
  const feeRates = [
    { rank: 'Lt/Capt/Maj', fee: 500 },
    { rank: 'Lt Col/Col', fee: 1000 },
    { rank: 'Brig', fee: 1200 },
    { rank: 'Maj Gen', fee: 1500 },
    { rank: 'Lt Gen', fee: 2000 },
    { rank: 'Gen', fee: 2000 },
  ];

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Fee Structure Details" />
        <Card.Content>
          <Text style={styles.heading}>Registration Fee: ?600/- (One Time)</Text>
          <Divider style={styles.divider} />
          
          <Text style={styles.subHeading}>Monthly Fees as per Rank:</Text>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Rank</DataTable.Title>
              <DataTable.Title numeric>Monthly Fee</DataTable.Title>
            </DataTable.Header>
            
            {feeRates.map((item, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell>{item.rank}</DataTable.Cell>
                <DataTable.Cell numeric>?{item.fee}/-</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
          
          <Divider style={styles.divider} />
          
          <Text style={styles.subHeading}>Payment Periods:</Text>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Period</DataTable.Title>
              <DataTable.Title>Calculation</DataTable.Title>
              <DataTable.Title numeric>Amount</DataTable.Title>
            </DataTable.Header>
            
            <DataTable.Row>
              <DataTable.Cell>Quarterly</DataTable.Cell>
              <DataTable.Cell>3 × Monthly Fee</DataTable.Cell>
              <DataTable.Cell numeric>Varies by Rank</DataTable.Cell>
            </DataTable.Row>
            
            <DataTable.Row>
              <DataTable.Cell>Six Months</DataTable.Cell>
              <DataTable.Cell>6 × Monthly Fee</DataTable.Cell>
              <DataTable.Cell numeric>Varies by Rank</DataTable.Cell>
            </DataTable.Row>
            
            <DataTable.Row>
              <DataTable.Cell>Nine Months</DataTable.Cell>
              <DataTable.Cell>9 × Monthly Fee</DataTable.Cell>
              <DataTable.Cell numeric>Varies by Rank</DataTable.Cell>
            </DataTable.Row>
            
            <DataTable.Row>
              <DataTable.Cell>Yearly</DataTable.Cell>
              <DataTable.Cell>12 × Monthly Fee</DataTable.Cell>
              <DataTable.Cell numeric>Varies by Rank</DataTable.Cell>
            </DataTable.Row>
          </DataTable>
          
          <Divider style={styles.divider} />
          
          <Text style={styles.subHeading}>Color Codes:</Text>
          <View style={styles.colorCodeContainer}>
            <View style={styles.colorItem}>
              <View style={[styles.colorBox, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.colorText}>Paid Fees (Frozen)</Text>
            </View>
            <View style={styles.colorItem}>
              <View style={[styles.colorBox, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.colorText}>Ready to Pay (Green)</Text>
            </View>
            <View style={styles.colorItem}>
              <View style={[styles.colorBox, { backgroundColor: '#f44336' }]} />
              <Text style={styles.colorText}>Pending (Red)</Text>
            </View>
          </View>
          
          <Text style={styles.note}>
            Note: Fee columns freeze when paid. "Pending" shows in red when due.
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 10,
    elevation: 3,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a73e8',
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
    color: '#333',
  },
  divider: {
    marginVertical: 15,
  },
  colorCodeContainer: {
    marginVertical: 10,
  },
  colorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  colorText: {
    fontSize: 14,
    color: '#666',
  },
  note: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
  },
});

export default FeeStructure;
