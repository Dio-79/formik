import { Link, type Href } from "expo-router";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../lib/firebase";
import { formStyles as styles } from "../styles/formStyles";

function formatDate(value?: string) {
	if (!value) return "Unknown";
	return new Date(value).toLocaleDateString(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
}

export default function ProfileScreen() {
	const { user } = useAuth();
	const [signingOut, setSigningOut] = useState(false);

	const handleSignOut = async () => {
		setSigningOut(true);
		try {
			await signOut(auth);
		} catch {
			Alert.alert("Sign out failed", "Please try again.");
		} finally {
			setSigningOut(false);
		}
	};

	return (
		<SafeAreaView style={styles.safe} edges={["bottom"]}>
			<ScrollView contentContainerStyle={styles.scroll}>
				<Text style={styles.title}>Profile</Text>
				<Text style={styles.subtitle}>Your account details</Text>

				<View style={styles.profileCard}>
					<View style={styles.profileRow}>
						<Text style={styles.profileLabel}>Email</Text>
						<Text style={styles.profileValue}>{user?.email ?? "Not available"}</Text>
					</View>
					<View style={styles.profileRow}>
						<Text style={styles.profileLabel}>Display name</Text>
						<Text style={styles.profileValue}>{user?.displayName?.trim() || "Not set"}</Text>
					</View>
					<View style={styles.profileRow}>
						<Text style={styles.profileLabel}>Member since</Text>
						<Text style={styles.profileValue}>{formatDate(user?.metadata.creationTime)}</Text>
					</View>
				</View>

				<Link href="/" asChild>
					<Pressable style={styles.link} disabled={signingOut}>
						<Text style={styles.linkText}>Employee Form</Text>
					</Pressable>
				</Link>

				<Link href={"/submissions" as Href} asChild>
					<Pressable style={styles.link} disabled={signingOut}>
						<Text style={styles.linkText}>My Submissions</Text>
					</Pressable>
				</Link>

				<Pressable style={styles.link} onPress={handleSignOut} disabled={signingOut}>
					{signingOut ? <ActivityIndicator color="#208AEF" /> : <Text style={styles.linkText}>Sign out</Text>}
				</Pressable>
			</ScrollView>
		</SafeAreaView>
	);
}
