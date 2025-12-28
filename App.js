import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import FeeStructure from './components/FeeStructure';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="EmployeeList"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#1a73e8',
              },
              headerTintColor: '#fff',
            }}
          >
            <Stack.Screen 
              name="EmployeeList" 
              component={EmployeeList} 
              options={{ title: 'Employee Management (500 Employees)' }}
            />
            <Stack.Screen 
              name="EmployeeForm" 
              component={EmployeeForm} 
              options={{ title: 'Employee Details' }}
            />
            <Stack.Screen 
              name="FeeStructure" 
              component={FeeStructure} 
              options={{ title: 'Fee Structure' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
