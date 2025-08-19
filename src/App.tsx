import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, Text, View, ActivityIndicator } from 'react-native';
// 导入页面组件
import HomeScreen from './screens/HomeScreen';
import MaterialScreen from './screens/MaterialScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import VideoDetailScreen from './screens/VideoDetailScreen';

// 导入认证上下文
import { AuthProvider, useAuth } from './contexts/AuthContext';

// 导入图标组件
import { HomeIcon, MaterialIcon, ProfileIcon } from './components/TabIcons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 主Tab导航
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          paddingVertical: 5,
          height: 60,
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#999999',
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <HomeIcon color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Material"
        component={MaterialScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcon color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <ProfileIcon color={color} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// 认证导航器
function AuthNavigator() {
  const { isAuthenticated, isLoading, user } = useAuth();

  console.log('AuthNavigator - isAuthenticated:', isAuthenticated);
  console.log('AuthNavigator - isLoading:', isLoading);
  console.log('AuthNavigator - user:', user);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1890ff" />
        <Text style={{ marginTop: 10, color: '#666' }}>加载中...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="VideoDetail" component={VideoDetailScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

// 主应用
function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <AuthNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
