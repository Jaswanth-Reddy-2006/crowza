import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './config';
import { AppDispatch } from '../../store/store';
import { updateMetrics, addAlert } from '../../store/slices/dashboardSlice';
import { upsertIncident } from '../../store/slices/incidentManagementSlice';
import { updateWait } from '../../store/slices/waitTimeManagementSlice';
import { updateSpotStatus } from '../../store/slices/parkingManagementSlice';

export const setupStaffDashboardListener = (venueId: string, dispatch: AppDispatch) => {
  const dashboardRef = doc(db, 'venues', venueId, 'dashboard', 'live');
  return onSnapshot(dashboardRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      dispatch(updateMetrics({
        incidentCount: data.activeIncidents ?? 0,
        avgWaitTime: data.avgWaitMins ?? 0,
      }));
    }
  });
};

export const setupIncidentListener = (venueId: string, staffId: string, dispatch: AppDispatch) => {
  const incidentsRef = collection(db, 'venues', venueId, 'incidents');
  const q = query(incidentsRef, where('assignedTo', '==', staffId));
  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added' || change.type === 'modified') {
        const data = change.doc.data() as any;
        dispatch(upsertIncident({ id: change.doc.id, ...data }));
      }
    });
  });
};

export const setupWaitTimeListener = (venueId: string, dispatch: AppDispatch) => {
  const waitTimesRef = collection(db, 'venues', venueId, 'wait-times');
  return onSnapshot(waitTimesRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added' || change.type === 'modified') {
        const data = change.doc.data();
        dispatch(updateWait({ zoneId: change.doc.id, waitMins: data.estimatedWaitMins }));
      }
    });
  });
};

export const setupParkingListener = (venueId: string, dispatch: AppDispatch) => {
  const parkingRef = collection(db, 'venues', venueId, 'parking-spots');
  return onSnapshot(parkingRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'modified') {
        const data = change.doc.data();
        dispatch(updateSpotStatus({
          spotId: change.doc.id,
          lotId: data.lotId,
          occupied: data.occupied,
        }));
      }
    });
  });
};
