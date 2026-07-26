import { Link, router, useFocusEffect, type Href } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { auth, db } from "../lib/firebase";
import { getFirestoreErrorMessage } from "../lib/firestoreErrors";
import { formStyles as styles } from "../styles/formStyles";

type EmployeeRecord = {
	id: string;
	firstName: string;
	email: string;
	phoneNumber: string;
	position: string;
	address: string;
	createdAt: number;
};

export default function SubmissionsScreen() {
	const { user } = useAuth();
	const [records, setRecords] = useState<EmployeeRecord[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [signingOut, setSigningOut] = useState(false);

	const loadSubmissions = useCallback(async () => {
		if (!user) {
			setRecords([]);
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const submissionsQuery = query(collection(db, "employees"), where("userId", "==", user.uid));
			const snapshot = await getDocs(submissionsQuery);

			setRecords(
				snapshot.docs
					.map(doc => {
						const data = doc.data();
						const createdAt = data.createdAt && typeof data.createdAt.toMillis === "function" ? data.createdAt.toMillis() : 0;

						return {
							id: doc.id,
							firstName: String(data.firstName ?? ""),
							email: String(data.email ?? ""),
							phoneNumber: String(data.phoneNumber ?? ""),
							position: String(data.position ?? ""),
							address: String(data.address ?? ""),
							createdAt
						};
					})
					.sort((a, b) => b.createdAt - a.createdAt)
			);
		} catch (err) {
			const code = err && typeof err === "object" && "code" in err ? String(err.code) : undefined;
			console.error("Failed to load submissions:", err);
			setError(getFirestoreErrorMessage(code));
		} finally {
			setLoading(false);
		}
	}, [user]);

	useFocusEffect(
		useCallback(() => {
			if (user) {
				loadSubmissions();
			}
		}, [user, loadSubmissions])
	);

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

	if (loading) {
		return (
			<SafeAreaView style={styles.safe} edges={["bottom"]}>
				<View style={styles.centered}>
					<ActivityIndicator size="large" color="#208AEF" />
					<Text style={styles.helperText}>Loading submissions…</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.safe} edges={["bottom"]}>
			<View style={styles.listContainer}>
				<Text style={styles.subtitle}>Tap a record to view, edit, or delete</Text>

				{error ? (
					<View style={styles.centered}>
						<Text style={styles.errorBanner}>{error}</Text>
						<Pressable style={styles.button} onPress={loadSubmissions}>
							<Text style={styles.buttonText}>Retry</Text>
						</Pressable>
					</View>
				) : records.length === 0 ? (
					<View style={styles.centered}>
						<Text style={styles.emptyTitle}>No submissions yet</Text>
						<Text style={styles.helperText}>Submit the employee form to see your records here.</Text>
						<Link href="/" asChild>
							<Pressable style={styles.button}>
								<Text style={styles.buttonText}>Go to Employee Form</Text>
							</Pressable>
						</Link>
					</View>
				) : (
					<FlatList
						data={records}
						keyExtractor={item => item.id}
						style={styles.listFlex}
						contentContainerStyle={styles.listContent}
						renderItem={({ item }) => (
							<Pressable style={styles.cardPressable} onPress={() => router.push(`/submission/${item.id}` as Href)}>
								<Text style={styles.cardTitle}>{item.firstName}</Text>
								<Text style={styles.cardLine}>{item.position}</Text>
								<Text style={styles.cardLine}>{item.email}</Text>
								<Text style={styles.cardHint}>Tap to edit or delete</Text>
							</Pressable>
						)}
					/>
				)}

				<Link href="/" asChild>
					<Pressable style={styles.link} disabled={signingOut}>
						<Text style={styles.linkText}>Back to Employee Form</Text>
					</Pressable>
				</Link>

				<Link href={"/profile" as Href} asChild>
					<Pressable style={styles.link} disabled={signingOut}>
						<Text style={styles.linkText}>Profile</Text>
					</Pressable>
				</Link>

				<Pressable style={styles.link} onPress={handleSignOut} disabled={signingOut}>
					{signingOut ? <ActivityIndicator color="#208AEF" /> : <Text style={styles.linkText}>Sign out</Text>}
				</Pressable>
			</View>
		</SafeAreaView>
	);
}
