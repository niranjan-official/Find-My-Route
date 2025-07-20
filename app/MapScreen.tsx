import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import * as Location from "expo-location";
import { ref, onValue, set } from "firebase/database";
import { auth, rtdb } from "@/src/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import polyline from "@mapbox/polyline";

const MapScreen = () => {
    const { busId } = useLocalSearchParams();
    const [busLocation, setBusLocation] = useState<Region | null>(null);
    const [userLocation, setUserLocation] = useState<Region | null>(null);
    const [routeCoords, setRouteCoords] = useState<
        { latitude: number; longitude: number }[]
    >([]);
    const mapRef = useRef<MapView | null>(null);
    const user = auth.currentUser;
    const userUid = user ? user.uid : "default";
    const userLocationRef = ref(rtdb, `/device_1/computed_location`);

    const initialLocation: Region = {
        latitude: 9.459849,
        longitude: 76.555256,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };
    const finalLocation = { latitude: 9.299346, longitude: 76.615452 };

    useEffect(() => {
        const startTrackingUserLocation = async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Permission to access location was denied");
                return;
            }

            await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Highest,
                    timeInterval: 500,
                    distanceInterval: 0.1,
                },
                (location) => {
                    const newLocation = {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    };

                    setUserLocation((prevLocation) => {
                        if (
                            !prevLocation ||
                            prevLocation.latitude !== newLocation.latitude ||
                            prevLocation.longitude !== newLocation.longitude
                        ) {
                            // Update Firebase RTDB only when there is a change
                            set(userLocationRef, {
                                latitude: newLocation.latitude,
                                longitude: newLocation.longitude,
                                updates_at: Date.now(),
                            });
                        }
                        return newLocation;
                    });
                }
            );
        };

        startTrackingUserLocation();
    }, []);

    useEffect(() => {
        if (!busId) return;
        const busRef = ref(rtdb, `${busId}/computed_location`);
        const unsubscribe = onValue(busRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                if (data.latitude && data.longitude) {
                    const newLocation: Region = {
                        latitude: data.latitude,
                        longitude: data.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    };
                    setBusLocation(newLocation);
                    fetchRoute(
                        userLocation || initialLocation,
                        newLocation,
                        finalLocation
                    );
                }
            }
        });

        return () => unsubscribe();
    }, [busId, userLocation]);

    const fetchRoute = async (
        start: Region,
        mid: Region,
        end: { latitude: number; longitude: number }
    ) => {
        try {
            const url = `https://routes.googleapis.com/directions/v2:computeRoutes?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-FieldMask": "routes.polyline.encodedPolyline",
                },
                body: JSON.stringify({
                    origin: {
                        location: {
                            latLng: {
                                latitude: start.latitude,
                                longitude: start.longitude,
                            },
                        },
                    },
                    destination: {
                        location: {
                            latLng: {
                                latitude: end.latitude,
                                longitude: end.longitude,
                            },
                        },
                    },
                    intermediates: [
                        {
                            location: {
                                latLng: {
                                    latitude: mid.latitude,
                                    longitude: mid.longitude,
                                },
                            },
                        },
                    ],
                    travelMode: "DRIVE",
                    routingPreference: "TRAFFIC_AWARE_OPTIMAL",
                    computeAlternativeRoutes: true,
                }),
            });

            const result = await response.json();
            if (result.routes?.length) {
                const selectedRoute = result.routes[0];
                const points = polyline.decode(
                    selectedRoute.polyline.encodedPolyline
                );
                const coords = points.map(
                    ([latitude, longitude]: [number, number]) => ({
                        latitude,
                        longitude,
                    })
                );
                setRouteCoords(coords);
            }
        } catch (error) {
            console.log("Error fetching route:", error);
        }
    };

    const centerOnBus = () => {
        if (busLocation && mapRef.current) {
            mapRef.current.animateToRegion(busLocation, 1000);
        }
    };

    const centerOnUser = () => {
        if (userLocation && mapRef.current) {
            mapRef.current.animateToRegion(userLocation, 1000);
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                region={userLocation || initialLocation}
            >
                {userLocation && (
                    <Marker
                        coordinate={userLocation}
                        title="Your Location"
                        image={require("@/assets/images/user-marker.png")}
                    />
                )}
                {busLocation && (
                    <Marker
                        coordinate={busLocation}
                        image={require("@/assets/images/bus.png")}
                        title="Bus Location"
                    />
                )}
                <Marker
                    coordinate={initialLocation}
                    title="Start"
                    pinColor="green"
                />
                <Marker
                    coordinate={finalLocation}
                    title="Destination"
                    pinColor="red"
                />
                {routeCoords.length > 0 && (
                    <Polyline
                        coordinates={routeCoords}
                        strokeWidth={4}
                        strokeColor="blue"
                    />
                )}
            </MapView>

            <TouchableOpacity style={styles.centerButton} onPress={centerOnBus}>
                <Image
                    source={require("@/assets/images/precision.png")}
                    style={styles.icon}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.centerButton, { bottom: 100 }]}
                onPress={centerOnUser}
            >
                <Image
                    source={require("@/assets/images/user-loc.png")}
                    style={styles.icon}
                />
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
