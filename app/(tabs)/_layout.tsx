import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

function TabIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={22} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1d4434',
        tabBarInactiveTintColor: '#8a8a80',
        tabBarStyle: { backgroundColor: '#f5f2eb', borderTopColor: 'rgba(26,26,24,0.1)' },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Checklist',
          tabBarIcon: ({ color }) => <TabIcon name="check-square-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ color }) => <TabIcon name="map-marker" color={color} />,
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documents',
          tabBarIcon: ({ color }) => <TabIcon name="file-text-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="deadlines"
        options={{
          title: 'Deadlines',
          tabBarIcon: ({ color }) => <TabIcon name="clock-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabIcon name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
}
