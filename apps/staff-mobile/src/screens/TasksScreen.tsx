/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports */
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, Typography, TonalCard, EditorialHeader } from '@crowza/design-system';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const MOCK_TASKS = [
  { id: '1', title: 'Crowd Flow Monitoring', zone: 'Section B (Main Gate)', status: 'ongoing', priority: 'High', icon: 'people', time: '10:30 AM' },
  { id: '2', title: 'Vendor Access Check', zone: 'Loading Dock 2', status: 'pending', priority: 'Medium', icon: 'cart', time: '11:15 AM' },
  { id: '3', title: 'Perimeter Sweep', zone: 'East Perimeter', status: 'pending', priority: 'Low', icon: 'shield-checkmark', time: '12:00 PM' },
  { id: '4', title: 'VIP Escort Services', zone: 'Entrance Lounge', status: 'done', priority: 'High', icon: 'sparkles', time: '09:45 AM' },
];

export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('all');

  const filteredTasks = MOCK_TASKS.filter(t => filter === 'all' || t.status === filter);

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High': return theme.colors.error;
      case 'Medium': return theme.colors.secondary;
      default: return theme.colors.outline;
    }
  };

  const renderTaskItem = ({ item }: { item: any }) => (
    <TonalCard variant="medium" style={styles.taskCard}>
       <View style={[styles.priorityTab, { backgroundColor: getPriorityColor(item.priority) }]} />
       <View style={styles.taskIcon}>
          <Ionicons name={item.icon as any} size={24} color={theme.colors.primary} />
       </View>
       <View style={styles.taskContent}>
          <View style={styles.taskTop}>
             <Typography variant="labelSmall" color={getPriorityColor(item.priority)} weight="900" style={{ letterSpacing: 1 }}>{item.priority.toUpperCase()} PRIORITY</Typography>
             <Typography variant="labelSmall" color={theme.colors.outline}>{item.time}</Typography>
          </View>
          <Typography variant="titleLarge" weight="900" style={{ marginTop: 2 }}>{item.title}</Typography>
          <Typography variant="bodySmall" color={theme.colors.outline} style={{ marginTop: 2 }}>{item.zone}</Typography>
          
          <View style={styles.statusRow}>
             <View style={[styles.statusBadge, { backgroundColor: item.status === 'done' ? '#FFF7ED' : (item.status === 'ongoing' ? '#FFF9C4' : '#F3F4F6') }]}>
                <Typography variant="labelSmall" color={item.status === 'done' ? '#F98000' : (item.status === 'ongoing' ? '#FBC02D' : theme.colors.outline)} weight="900">
                   {item.status.toUpperCase()}
                </Typography>
             </View>
             {item.status !== 'done' && (
               <TouchableOpacity style={styles.completeBtn}>
                  <Typography variant="labelSmall" color="white" weight="900">MARK COMPLETE</Typography>
               </TouchableOpacity>
             )}
          </View>
       </View>
    </TonalCard>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
          <EditorialHeader
            metadata="OPERATIONAL DUTIES"
            title="My Tasks"
            subtitle="Track and manage your specific assignments for the current venue operation."
          />
      </View>

      <View style={styles.filterBar}>
         {['all', 'pending', 'ongoing', 'done'].map((f) => (
           <TouchableOpacity 
             key={f} 
             onPress={() => setFilter(f)}
             style={[styles.filterChip, filter === f && styles.filterChipActive]}
           >
              <Typography variant="labelSmall" color={filter === f ? 'white' : theme.colors.outline} weight="900">
                 {f.toUpperCase()}
              </Typography>
           </TouchableOpacity>
         ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
             <Ionicons name="documents-outline" size={64} color={theme.colors.outlineVariant} />
             <Typography variant="titleMedium" color={theme.colors.outline} style={{ marginTop: 16 }}>No duties found</Typography>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { paddingHorizontal: 20, marginBottom: 20, marginTop: 10 },
  filterBar: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 16 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: theme.colors.surfaceVariant },
  filterChipActive: { backgroundColor: theme.colors.primary },
  listContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  taskCard: { 
    flexDirection: 'row', 
    padding: 20, 
    borderRadius: 28, 
    marginBottom: 16, 
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
  },
  priorityTab: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 6 },
  taskIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.colors.surfaceVariant },
  taskContent: { flex: 1, marginLeft: 16 },
  taskTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  completeBtn: { backgroundColor: theme.colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  emptyState: { alignItems: 'center', marginTop: 100 },
});
