import { doc, onSnapshot, collection } from 'firebase/firestore';
import { db } from './config'; // Assuming firebase config is exported from here
import { setZoneOccupancy, setHeatmap } from '../../store/slices/occupancySlice';
import { setWaitTime } from '../../store/slices/waittimeSlice';
import { AppDispatch } from '../../store/store';
import { ZoneOccupancy, HeatMapData } from '@crowza/shared';

export const setupOccupancyListener = (venueId: string, dispatch: AppDispatch) => {
  const occupancyRef = collection(db, 'venues', venueId, 'occupancy');
  
  return onSnapshot(occupancyRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added' || change.type === 'modified') {
        const data = change.doc.data() as ZoneOccupancy;
        dispatch(setZoneOccupancy(data));
      }
    });
  });
};

export const setupWaitTimeListener = (venueId: string, dispatch: AppDispatch) => {
  const waitTimeRef = collection(db, 'venues', venueId, 'wait-times');
  
  return onSnapshot(waitTimeRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added' || change.type === 'modified') {
        const data = change.doc.data();
        dispatch(setWaitTime({ 
          zoneId: change.doc.id, 
          waitMins: data.estimatedWaitMins 
        }));
      }
    });
  });
};

export const setupHeatmapListener = (venueId: string, dispatch: AppDispatch) => {
  const heatmapDocRef = doc(db, 'venues', venueId, 'heatmap', 'current');
  
  return onSnapshot(heatmapDocRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data() as HeatMapData;
      dispatch(setHeatmap(data));
    }
  });
};
