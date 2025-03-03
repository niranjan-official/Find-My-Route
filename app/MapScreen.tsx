import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import { ref, onValue } from "firebase/database";
import { rtdb } from "@/src/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import polyline from "@mapbox/polyline";

const MapScreen = () => {
  const { busId } = useLocalSearchParams();
  const [busLocation, setBusLocation] = useState<Region | null>(null);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const mapRef = useRef<MapView | null>(null); // Reference for the map

  // Define initial and final locations
  const initialLocation: Region = { latitude: 9.459849, longitude: 76.555256, latitudeDelta: 0.01, longitudeDelta: 0.01 };
  const finalLocation = { latitude: 9.299346, longitude: 76.615452 };

  useEffect(() => {
    if (!busId) return;

    const busRef = ref(rtdb, `${busId}/gps_module`);
    const unsubscribe = onValue(busRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Function 1");

        if (data.latitude && data.longitude) {
          console.log("Function 2");
          const newLocation: Region = {
            latitude: data.latitude,
            longitude: data.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setBusLocation(newLocation);
          fetchRoute(initialLocation, newLocation, finalLocation);
        }
      }
    });

    return () => unsubscribe();
  }, [busId]);

  // Function to fetch route from Google API
  const fetchRoute = async (start: Region, mid: Region, end: { latitude: number; longitude: number }) => {
    console.log("Function 3");
    try {
      const url = `https://routes.googleapis.com/directions/v2:computeRoutes?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask": "routes.polyline.encodedPolyline",
        },
        body: JSON.stringify({
          origin: { location: { latLng: { latitude: start.latitude, longitude: start.longitude } } },
          destination: { location: { latLng: { latitude: end.latitude, longitude: end.longitude } } },
          intermediates: [{ location: { latLng: { latitude: mid.latitude, longitude: mid.longitude } } }],
          travelMode: "DRIVE",
          routingPreference: "TRAFFIC_AWARE_OPTIMAL",
          computeAlternativeRoutes: true, // Request multiple routes
        }),
      });

      const result = await response.json();
      console.log(result);

      if (result.routes?.length) {
        console.log(`Found ${result.routes.length} routes`);

        // Select the first route by default
        const selectedRoute = result.routes[0];

        // Decode the polyline for the selected route
        const points = polyline.decode(selectedRoute.polyline.encodedPolyline);
        const coords = points.map(([latitude, longitude]: [number, number]) => ({ latitude, longitude }));

        console.log(coords);
        setRouteCoords(coords);
      } else {
        console.log("No routes found");
      }
    } catch (error) {
      console.log("Error fetching route:", error);
    }
  };

  // Function to center map on bus location
  const centerOnBus = () => {
    if (busLocation && mapRef.current) {
      mapRef.current.animateToRegion(busLocation, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} region={busLocation || initialLocation}>
        {busLocation && <Marker coordinate={busLocation} image={require("@/assets/images/bus.png")} title="Bus Location" />}
        <Marker coordinate={initialLocation} title="Start" pinColor="green" />
        <Marker coordinate={finalLocation} title="Destination" pinColor="red" />
        {routeCoords.length > 0 && <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor="blue" />}
      </MapView>

      {/* Center button (fixed on right-bottom) */}
      <TouchableOpacity style={styles.centerButton} onPress={centerOnBus}>
        <Image source={require("@/assets/images/precision.png")} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  centerButton: {
    position: "absolute",
    right: 20,
    bottom: 40,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 30,
    elevation: 5,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: "black",
  },
});

export default MapScreen;
