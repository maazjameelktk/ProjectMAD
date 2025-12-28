import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Share from 'expo-sharing';
import { Card, Searchbar, FAB, IconButton, Button, Chip } from 'react-native-paper';
import { mockEmployees } from '../data/mockEmployees';

const EmployeeList = ({ navigation }) => {
  const [employees, setEmployees] = useState(mockEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState(mockEmployees);

  useEffect(() => {
    if (searchQuery) {
      const filtered = employees.filter(emp =>
        emp.personalData.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.membershipNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.personalData.cnic.includes(searchQuery) ||
        emp.personalData.rank.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchQuery, employees]);

  const generateNewMemberId = () => {
    return employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
  };

  const calculateFeesForRank = (rankTitle) => {
    const rankFees = {
      'Lt/Capt/Maj': 500,
      'Lt Col/Col': 1000,
      'Brig': 1200,
      'Maj Gen': 1500,
      'Lt Gen': 2000,
      'Gen': 2000,
    };
    const fee = rankFees[rankTitle] || 500;
    return {
      quarterly: fee * 3,
      sixMonths: fee * 6,
      nineMonths: fee * 9,
      yearly: fee * 12,
    };
  };

  
  // TEST EXPORT FUNCTION - SIMPLE VERSION
  
  const handleExportData = async () => {
    console.log("?? EXPORT BUTTON CLICKED - Starting export...");
    
    if (employees.length === 0) {
      // Use setTimeout to ensure Alert works
      setTimeout(() => {
        Alert.alert('No Data', 'There are no employees to export.');
      }, 100);
      return;
    }

    try {
      // 1. Create CSV content
      const headers = ['Serial No', 'Membership No', 'Full Name', 'Rank', 'Status', 'CNIC', 'WhatsApp', 'Joining Date', 'Fee Paid', 'Fee Remaining'];
      const csvRows = employees.map(emp => [
        emp.serialNumber,
        `"${emp.membershipNumber}"`, // Wrap in quotes to handle commas
        `"${emp.personalData.fullName}"`,
        `"${emp.personalData.rank}"`,
        emp.personalData.status,
        `"${emp.personalData.cnic}"`,
        `"${emp.personalData.whatsapp}"`,
        emp.dateOfJoining,
        emp.accountData.totalFeePaid,
        emp.accountData.feeRemaining
      ]);
      
      const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');
      
      // 2. Show progress alert
      setTimeout(() => {
        Alert.alert(
          'Export Started',
          `Preparing to export ${employees.length} employees...`,
          [{ text: 'OK' }]
        );
      }, 100);
      
      console.log("CSV Content created, length:", csvContent.length);
      
      // 3. Save to file
      const date = new Date().toISOString().split('T')[0];
      const fileName = `employees_${date}.csv`;
      const fileUri = FileSystem.documentDirectory + fileName;
      
      console.log("Writing to:", fileUri);
      
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8
      });
      
      console.log("File written successfully");
      
      // 4. Share the file
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        setTimeout(() => {
          Alert.alert(
            'Export Complete',
            `File saved as: ${fileName}\n\nShare or save the CSV file.`,
            [
              { 
                text: 'Share File', 
                onPress: () => {
                  Sharing.shareAsync(fileUri, {
                    mimeType: 'text/csv',
                    dialogTitle: 'Export Employees Data',
                    UTI: 'public.comma-separated-values-text'
                  });
                }
              },
              { text: 'OK', style: 'cancel' }
            ]
          );
        }, 200);
      } else {
        setTimeout(() => {
          Alert.alert(
            'Export Complete',
            `File saved to app storage: ${fileName}\n\nSharing not available on this device.`,
            [{ text: 'OK' }]
          );
        }, 200);
      }
      
    } catch (error) {
      console.error('Export error:', error);
      setTimeout(() => {
        Alert.alert(
          'Export Failed',
          `Error: ${error.message}\n\nCheck console for details.`,
          [{ text: 'OK' }]
        );
      }, 100);
    }
  };;

  const handleAddEmployee = () => {
    const newId = generateNewMemberId();
    const fees = calculateFeesForRank('Lt/Capt/Maj');
    const totalFee = 600 + fees.quarterly + fees.sixMonths + fees.nineMonths + fees.yearly;
    
    const newEmployee = {
      id: newId,
      serialNumber: newId,
      dateOfJoining: new Date().toISOString().split('T')[0],
      dateOfLeaving: null,
      membershipPeriod: '0 years',
      membershipNumber: `MEM${String(newId).padStart(4, '0')}`,
      personalData: {
        ownName: '',
        personalNumber: `P${String(10000 + newId).padStart(5, '0')}`,
        rank: 'Lt/Capt/Maj',
        fullName: 'New Member',
        officeAddress: '',
        residenceAddress: '',
        appointment: '',
        status: 'Serving',
        cnic: '',
        whatsapp: '',
        personalAssistant: { name: '', number: '' }
      },
      accountData: {
        registrationFee: { paid: false, amount: 600 },
        quarterlyFee: { paid: false, amount: fees.quarterly },
        sixMonthFee: { paid: false, amount: fees.sixMonths },
        nineMonthFee: { paid: false, amount: fees.nineMonths },
        yearlyFee: { paid: false, amount: fees.yearly },
        totalFeePaid: 0,
        feeRemaining: totalFee,
        wholeFeePaidTillJoining: 0,
        cardReceiver: { name: '', contact: '' },
        remarks: 'New member - Rank Fee: 500/- per month'
      },
    };
    
    navigation.navigate('EmployeeForm', { 
      employee: newEmployee, 
      onSave: handleSaveEmployee,
      isNew: true 
    });
  };

  const handleSaveEmployee = (updatedEmployee) => {
    if (updatedEmployee.isNew) {
      // Add new employee
      setEmployees(prev => [...prev, { ...updatedEmployee, isNew: undefined }]);
    } else {
      // Update existing employee
      setEmployees(prev =>
        prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
      );
    }
  };

  const renderEmployee = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('EmployeeForm', { 
        employee: item, 
        onSave: handleSaveEmployee 
      })}
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.row}>
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.personalData.fullName}</Text>
              <View style={styles.detailsRow}>
                <Chip compact style={styles.rankChip}>{item.personalData.rank}</Chip>
                <Chip compact style={[
                  styles.statusChip,
                  { backgroundColor: item.personalData.status === 'Serving' ? '#4CAF50' : '#FF9800' }
                ]}>
                  {item.personalData.status}
                </Chip>
              </View>
              <Text style={styles.details}>ID: {item.membershipNumber}</Text>
              <Text style={styles.details}>CNIC: {item.personalData.cnic}</Text>
            </View>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => navigation.navigate('EmployeeForm', { 
                employee: item, 
                onSave: handleSaveEmployee 
              })}
            />
          </View>
          
          <View style={styles.feeSummary}>
            <View style={styles.feeItem}>
              <Text style={styles.feeLabel}>Paid:</Text>
              <Text style={styles.feeValue}>?{item.accountData.totalFeePaid.toLocaleString()}</Text>
            </View>
            <View style={styles.feeItem}>
              <Text style={styles.feeLabel}>Remaining:</Text>
              <Text style={[
                styles.feeValue,
                item.accountData.feeRemaining > 0 ? styles.pending : styles.paid
              ]}>
                ?{item.accountData.feeRemaining.toLocaleString()}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search by name, ID, rank, or CNIC"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <View style={styles.header}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{employees.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {employees.filter(e => e.personalData.status === 'Serving').length}
            </Text>
            <Text style={styles.statLabel}>Serving</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, styles.pendingStat]}>
              {employees.filter(e => e.accountData.feeRemaining > 0).length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('FeeStructure')}
          style={styles.feeButton}
          icon="cash"
        >
          Fee Structure
        </Button>

        <Button
          mode="contained"
          onPress={handleExportData}
          style={styles.exportButton}
          icon="file-export"
        >
          Export Data (CSV)
        </Button>
      </View>

      <FlatList
        data={filteredEmployees}
        renderItem={renderEmployee}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        style={styles.fab}
        icon="account-plus"
        onPress={handleAddEmployee}
        label="Add New Member"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 10,
    elevation: 2,
  },
  header: {
    paddingHorizontal: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    marginBottom: 10,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  pendingStat: {
    color: '#f44336',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  feeButton: {
    marginVertical: 5,
    backgroundColor: '#4CAF50',
  },
  exportButton: {
    marginVertical: 5,
    backgroundColor: '#9C27B0',
  },
  card: {
    marginHorizontal: 10,
    marginVertical: 5,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  rankChip: {
    marginRight: 5,
    backgroundColor: '#e3f2fd',
  },
  statusChip: {
    marginRight: 5,
  },
  details: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  feeSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  feeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 5,
  },
  feeValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  pending: {
    color: '#f44336',
  },
  paid: {
    color: '#4CAF50',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a73e8',
  },
  list: {
    paddingBottom: 80,
  },
});

export default EmployeeList;




