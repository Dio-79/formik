import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function LoadingScreen() {
	return (
		<View style={styles.loading}>
			<ActivityIndicator size="large" color="#208AEF" />
			<Text style={styles.loadingText}>Restoring session…</Text>
		</View>
	);
}

function RootNavigator() {
	const { user, loading } = useAuth();
	const segments = useSegments();
	const router = useRouter();

	useEffect(() => {
		if (loading) return;

		const onAuthScreen = segments[0] === "sign-in" || segments[0] === "sign-up" || (segments[0] as string) === "forgot-password";

		if (!user && !onAuthScreen) {
			router.replace("/sign-in");
		} else if (user && onAuthScreen) {
			router.replace("/");
		}
	}, [user, loading, segments, router]);

	if (loading) {
		return <LoadingScreen />;
	}

	return (
		<Stack screenOptions={{ headerShadowVisible: false }}>
			<Stack.Screen name="index" options={{ title: "Employee Form" }} />
			<Stack.Screen name="submissions" options={{ title: "My Submissions" }} />
			<Stack.Screen name="submission/[id]" options={{ title: "Edit Record" }} />
			<Stack.Screen name="profile" options={{ title: "Profile" }} />
			<Stack.Screen name="sign-in" options={{ headerShown: false }} />
			<Stack.Screen name="sign-up" options={{ headerShown: false }} />
			<Stack.Screen name="forgot-password" options={{ title: "Forgot Password" }} />
		</Stack>
	);
}

export default function RootLayout() {
	return (
		<AuthProvider>
			<RootNavigator />
		</AuthProvider>
	);
}

const styles = StyleSheet.create({
	loading: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f5f6f8",
		gap: 12
	},
	loadingText: {
		fontSize: 16,
		color: "#666"
	}
});
