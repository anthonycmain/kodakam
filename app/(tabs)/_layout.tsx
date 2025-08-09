import React, { useCallback, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { I18nextProvider } from 'react-i18next';
import i18n from '../translations/i18n';


// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  
  
  

  return (
    <I18nextProvider i18n={i18n}>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: '#000',
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        headerStyle: { backgroundColor: '#FFB700' },
        tabBarInactiveBackgroundColor: Colors[colorScheme ?? 'light'].background,
        tabBarActiveBackgroundColor: Colors[colorScheme ?? 'light'].background,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopWidth: 2,
          borderTopColor: '#ED0000',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Network Scanner',
          tabBarIcon: ({ color }) => <TabBarIcon name="wifi" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera Details',
          tabBarIcon: ({ color }) => <TabBarIcon name="video-camera" color={color} />,
        }}
      />
    </Tabs>
    </I18nextProvider>
  );
}

