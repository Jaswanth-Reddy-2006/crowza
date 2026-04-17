/**
 * Task Assignment Screen - Staff Mobile App
 * Real-time task management and channel coordination
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Typography, TonalCard, theme, Chip } from '@crowza/design-system';
import { taskAssignmentService, Task, Channel, StaffChannel, TaskAssignmentEvent } from '../services/task-assignment-service';

interface TaskAssignmentScreenProps {
  route?: any;
  navigation?: any;
}

export function TaskAssignmentScreen({ route, navigation }: TaskAssignmentScreenProps) {
  const [selectedChannel, setSelectedChannel] = useState<StaffChannel | 'all'>('all');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'assigned' | 'in-progress' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'time' | 'status'>('priority');
  const [refreshing, setRefreshing] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Initialize service
  useEffect(() => {
    taskAssignmentService.initializeChannels();
  }, []);

  // Subscribe to events
  useEffect(() => {
    const unsubscribe = taskAssignmentService.onTaskEvent((event: TaskAssignmentEvent) => {
      loadTasks();
      handleTaskEvent(event);
    });

    return () => unsubscribe();
  }, []);

  // Load tasks on focus
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [selectedChannel, filterStatus])
  );

  const loadTasks = () => {
    let allTasks: Task[] = [];

    if (selectedChannel === 'all') {
      allTasks = taskAssignmentService.getAllTasks();
    } else {
      allTasks = taskAssignmentService.getTasksForChannel(selectedChannel, filterStatus === 'all' ? undefined : (filterStatus as any));
    }

    // Apply filters
    let filteredTasks = allTasks;
    if (filterStatus !== 'all') {
      filteredTasks = filteredTasks.filter((t) => t.status === filterStatus);
    }

    // Sort
    filteredTasks.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder: Record<string, number> = { critical: 0, high: 1, normal: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === 'time') {
        return b.createdAt - a.createdAt;
      }
      return 0;
    });

    setTasks(filteredTasks);
    setRefreshing(false);
  };

  const handleTaskEvent = (event: TaskAssignmentEvent) => {
    if (event.type === 'urgent-alert') {
      Alert.alert('🚨 URGENT ALERT', event.message, [{ text: 'OK' }]);
    }
  };

  const handleAcknowledgeTask = (task: Task) => {
    taskAssignmentService.acknowledgeTask(task.id, 'current-staff-id');
    Alert.alert('✓ Task Acknowledged', 'Your team has been notified', [{ text: 'OK' }]);
    loadTasks();
  };

  const handleStartTask = (task: Task) => {
    taskAssignmentService.updateTaskStatus(task.id, 'in-progress');
    Alert.alert('In Progress', 'Task status updated to in progress', [{ text: 'OK' }]);
    loadTasks();
  };

  const handleCompleteTask = (task: Task, notes?: string) => {
    taskAssignmentService.updateTaskStatus(task.id, 'completed', notes);
    Alert.alert('✓ Task Completed', 'Great work! Task marked as complete', [{ text: 'OK' }]);
    setShowDetailView(false);
    loadTasks();
  };

  const renderTaskCard = ({ item: task }: { item: Task }) => {
    const priorityColor: Record<string, string> = {
      critical: theme.colors.error,
      high: theme.colors.secondary,
      normal: theme.colors.primary,
      low: theme.colors.outline,
    };
    const color = priorityColor[task.priority];

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedTask(task);
          setShowDetailView(true);
        }}
        activeOpacity={0.7}
      >
         <TonalCard variant="highest" style={[styles.taskCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
          <View style={styles.taskHeader}>
            <View style={styles.taskTitleSection}>
               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <View style={[styles.liveDot, { backgroundColor: color }]} />
                  <Typography variant="labelSmall" color={color} weight="800" style={{ letterSpacing: 1.5 }}>
                    {task.priority.toUpperCase()}
                  </Typography>
               </View>
              <Typography variant="titleMedium" color={theme.colors.onSurface} weight="800" numberOfLines={1}>
                {task.title}
              </Typography>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: `${color}10` }]}>
               <Typography variant="labelSmall" color={color} weight="800">{task.status.toUpperCase()}</Typography>
            </View>
          </View>

          <Typography
            variant="bodyMedium"
            color={theme.colors.onSurfaceVariant}
            numberOfLines={2}
            style={styles.taskDescription}
          >
            {task.description}
          </Typography>

          <View style={styles.taskFooter}>
            <View style={styles.taskZone}>
               <Ionicons name="location-outline" size={14} color={theme.colors.primary} />
               <Typography variant="labelSmall" color={theme.colors.outline} weight="600">
                  {task.zone || 'SEC-01'}
               </Typography>
            </View>
            <Typography variant="labelSmall" color={theme.colors.outline} weight="600">
              {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </View>

          {task.status === 'assigned' && (
            <TouchableOpacity
              onPress={() => handleAcknowledgeTask(task)}
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            >
              <Typography variant="labelSmall" color={theme.colors.onPrimary} weight="800">
                ACKNOWLEDGE
              </Typography>
            </TouchableOpacity>
          )}
        </TonalCard>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.screenHeader}>
           <Typography variant="labelSmall" color={theme.colors.primary} style={{ letterSpacing: 3 }}>OPERATIONAL LOG</Typography>
           <Typography variant="headlineLarge" color={theme.colors.onSurface} weight="800">Field Tasks</Typography>
        </View>

        {/* Channel Selector */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.channelScroll}
            contentContainerStyle={styles.channelContent}
          >
            {[
              { id: 'all' as const, label: 'GLOBAL', icon: 'grid-outline' },
              { id: 'security', label: 'SECURITY', icon: 'shield-outline' },
              { id: 'crowd-control', label: 'CROWD', icon: 'people-outline' },
              { id: 'medical', label: 'MEDICAL', icon: 'medkit-outline' },
              { id: 'emergency', label: 'EMERGENCY', icon: 'flash-outline' },
            ].map((ch) => (
              <TouchableOpacity
                key={ch.id}
                onPress={() => setSelectedChannel(ch.id as any)}
                style={[
                  styles.channelChip,
                  selectedChannel === ch.id && styles.channelChipActive,
                ]}
              >
                <Ionicons 
                  name={ch.icon as any} 
                  size={16} 
                  color={selectedChannel === ch.id ? theme.colors.onPrimary : theme.colors.outline} 
                />
                <Typography
                  variant="labelSmall"
                  color={selectedChannel === ch.id ? theme.colors.onPrimary : theme.colors.outline}
                  weight="800"
                >
                  {ch.label}
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Filter Bar */}
        <View style={styles.filterChips}>
          {['all', 'assigned', 'in-progress', 'completed'].map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setFilterStatus(status as any)}
              style={[
                styles.filterChip,
                filterStatus === status && styles.filterChipActive,
              ]}
            >
              <Typography
                variant="labelSmall"
                color={filterStatus === status ? theme.colors.onSecondary : theme.colors.outline}
                weight="800"
              >
                {status.toUpperCase()}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tasks List */}
        <FlatList
          data={tasks}
          renderItem={renderTaskCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.tasksList}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            loadTasks();
          }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                 <Ionicons name="documents-outline" size={48} color={theme.colors.outline} />
              </View>
              <Typography variant="titleMedium" color={theme.colors.outline} weight="700">
                No active task logs
              </Typography>
              <Typography variant="bodySmall" color={theme.colors.outline} style={{ textAlign: 'center' }}>
                All clear in the current sector. New assignments will appear here.
              </Typography>
            </View>
          }
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  screenHeader: { paddingHorizontal: 24, paddingVertical: 20 },
  channelScroll: { marginBottom: 16 },
  channelContent: { paddingHorizontal: 20, gap: 10 },
  channelChip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16, backgroundColor: theme.colors.surfaceContainerLow, borderWidth: 1, borderColor: theme.colors.outlineVariant },
  channelChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  filterChips: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 12, gap: 8 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  filterChipActive: { borderBottomColor: theme.colors.secondary },
  tasksList: { paddingHorizontal: 16, paddingBottom: 100, gap: 16 },
  taskCard: { padding: 20, borderRadius: 24, gap: 12 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  taskTitleSection: { flex: 1 },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  taskDescription: { lineHeight: 20, opacity: 0.7 },
  taskZone: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  taskFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: theme.colors.outlineVariant, paddingTop: 12 },
  actionButton: { paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 4 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 100, paddingHorizontal: 40, gap: 12 },
  emptyIconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.surfaceContainer, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  detailOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.colors.background },
  detailContainer: { flex: 1 },
});
