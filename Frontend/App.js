import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import AddRecordScreen from './src/screens/AddRecordScreen';
import RecordDetailScreen from './src/screens/RecordDetailScreen';
import EditRecordScreen from './src/screens/EditRecordScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2563eb',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Work Records',
            }}
          />
          <Stack.Screen
            name="AddRecord"
            component={AddRecordScreen}
            options={{
              title: 'Add New Record',
            }}
          />
          <Stack.Screen
            name="RecordDetail"
            component={RecordDetailScreen}
            options={{
              title: 'Record Details',
            }}
          />
          <Stack.Screen
            name="EditRecord"
            component={EditRecordScreen}
            options={{
              title: 'Edit Record',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
