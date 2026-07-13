import { Stack } from "expo-router";

export default function RootLayout() {
	return (
		<Stack screenOptions={{ headerShadowVisible: false }}>
			<Stack.Screen name="index" options={{ title: "Employee Form" }} />
			<Stack.Screen name="sign-in" options={{ title: "Sign In" }} />
			<Stack.Screen name="sign-up" options={{ title: "Sign Up" }} />
		</Stack>
	);
}
