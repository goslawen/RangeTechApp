import React from 'react';
import {StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {DashboardScreen} from '../screens/DashboardScreen';
import {MoreScreen} from '../screens/MoreScreen';
import {ReportsScreen} from '../screens/ReportsScreen';
import {ResourceScreen} from '../screens/ResourceScreen';
import {ServiceScreen} from '../screens/ServiceScreen';
import {TasksScreen} from '../screens/TasksScreen';
import {ResourceKey} from '../features/resources';
import {colors} from '../theme/styles';

export type RootStackParamList = {
  MainTabs: undefined;
  Resource: {resourceKey: ResourceKey};
};

export type MainTabParamList = {
  Dashboard: undefined;
  Tasks: undefined;
  Service: undefined;
  Reports: undefined;
  More: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: colors.header,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {fontSize: 11, fontWeight: '800'},
        tabBarItemStyle: {
          borderRadius: 8,
          marginHorizontal: 4,
          marginVertical: 6,
        },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          elevation: 12,
          height: 84,
          paddingBottom: 20,
          paddingHorizontal: 8,
          paddingTop: 8,
          shadowColor: colors.header,
          shadowOffset: {height: -3, width: 0},
          shadowOpacity: 0.12,
          shadowRadius: 10,
        },
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{tabBarIcon: HomeTabIcon, title: 'Dashboard'}}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{tabBarIcon: TasksTabIcon, title: 'Zadania'}}
      />
      <Tab.Screen
        name="Service"
        component={ServiceScreen}
        options={{tabBarIcon: ServiceTabIcon, title: 'Serwis'}}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{tabBarIcon: ReportsTabIcon, title: 'Raporty'}}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{tabBarIcon: MoreTabIcon, title: 'Więcej'}}
      />
    </Tab.Navigator>
  );
}

type TabIconProps = {
  color: string;
  size: number;
};

function HomeTabIcon({color, size}: TabIconProps) {
  return (
    <View style={[styles.iconBox, {height: size, width: size}]}>
      <View style={[styles.homeRoof, {borderBottomColor: color}]} />
      <View style={[styles.homeBody, {borderColor: color}]} />
    </View>
  );
}

function TasksTabIcon({color, size}: TabIconProps) {
  return (
    <View style={[styles.clipboard, {borderColor: color, height: size, width: size}]}>
      <View style={[styles.clip, {backgroundColor: color}]} />
      <View style={[styles.line, {backgroundColor: color}]} />
      <View style={[styles.line, {backgroundColor: color}]} />
      <View style={[styles.lineShort, {backgroundColor: color}]} />
    </View>
  );
}

function ServiceTabIcon({color, size}: TabIconProps) {
  return (
    <View style={[styles.iconBox, {height: size, width: size}]}>
      <View style={[styles.wrenchHead, {borderColor: color}]} />
      <View style={[styles.wrenchHandle, {backgroundColor: color}]} />
    </View>
  );
}

function ReportsTabIcon({color, size}: TabIconProps) {
  return (
    <View style={[styles.document, {borderColor: color, height: size, width: size * 0.78}]}>
      <View style={[styles.documentLine, {backgroundColor: color}]} />
      <View style={[styles.documentLine, {backgroundColor: color}]} />
      <View style={[styles.documentLineShort, {backgroundColor: color}]} />
    </View>
  );
}

function MoreTabIcon({color, size}: TabIconProps) {
  return (
    <View style={[styles.more, {height: size, width: size}]}>
      <View style={[styles.dot, {backgroundColor: color}]} />
      <View style={[styles.dot, {backgroundColor: color}]} />
      <View style={[styles.dot, {backgroundColor: color}]} />
    </View>
  );
}

export function AppNavigator(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Resource" component={ResourceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  clipboard: {
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 2,
    justifyContent: 'center',
    paddingTop: 2,
  },
  clip: {
    borderRadius: 2,
    height: 3,
    marginBottom: 3,
    width: 9,
  },
  document: {
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  documentLine: {
    borderRadius: 2,
    height: 2,
    marginTop: 3,
    width: 10,
  },
  documentLineShort: {
    borderRadius: 2,
    height: 2,
    marginTop: 3,
    width: 7,
  },
  dot: {
    borderRadius: 3,
    height: 5,
    width: 5,
  },
  homeBody: {
    borderRadius: 3,
    borderWidth: 2,
    height: 11,
    marginTop: -1,
    width: 15,
  },
  homeRoof: {
    borderBottomWidth: 9,
    borderLeftColor: 'transparent',
    borderLeftWidth: 10,
    borderRightColor: 'transparent',
    borderRightWidth: 10,
    height: 0,
    width: 0,
  },
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    borderRadius: 2,
    height: 2,
    marginTop: 3,
    width: 12,
  },
  lineShort: {
    borderRadius: 2,
    height: 2,
    marginTop: 3,
    width: 8,
  },
  more: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
  },
  wrenchHandle: {
    borderRadius: 2,
    height: 14,
    position: 'absolute',
    top: 8,
    transform: [{rotate: '42deg'}],
    width: 4,
  },
  wrenchHead: {
    borderRadius: 8,
    borderWidth: 2,
    height: 11,
    left: 5,
    position: 'absolute',
    top: 2,
    width: 11,
  },
});
