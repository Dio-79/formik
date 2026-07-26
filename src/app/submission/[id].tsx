import { Link, router, useFocusEffect, useLocalSearchParams, type Href } from "expo-router";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { Formik } from "formik";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { employeeFields, employeeInitial, employeeSchema, type EmployeeFormValues } from "../../lib/employeeForm";
import { db } from "../../lib/firebase";
import { formStyles as styles } from "../../styles/formStyles";

export default function SubmissionDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { user } = useAuth();
	const [focus, setFocus] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [initialValues, setInitialValues] = useState<EmployeeFormValues>(employeeInitial);
	const [deleting, setDeleting] = useState(false);

	const loadRecord = useCallback(async () => {
		if (!user || !id) {
			setError("Record not found.");
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const snapshot = await getDoc(doc(db, "employees", id));

			if (!snapshot.exists()) {
				setError("Record not found.");
				return;
			}

			const data = snapshot.data();
			if (data.userId !== user.uid) {
				setError("You do not have access to this record.");
				return;
			}

			setInitialValues({
				firstName: String(data.firstName ?? ""),
				email: String(data.email ?? ""),
				phoneNumber: String(data.phoneNumber ?? ""),
				position: String(data.position ?? ""),
				address: String(data.address ?? ""),
			});
		} catch {
			setError("Could not load this record. Check your connection and try again.");
		} finally {
			setLoading(false);
		}
	}, [id, user]);

	useFocusEffect(
		useCallback(() => {
			loadRecord();
		}, [loadRecord])
	);

	const confirmDelete = () => {
		Alert.alert("Delete record?", "This action cannot be undone.", [
			{ text: "Cancel", style: "cancel" },
			{ text: "Delete", style: "destructive", onPress: handleDelete },
		]);
	};

	const handleDelete = async () => {
		if (!id) return;

		setDeleting(true);
		try {
			await deleteDoc(doc(db, "employees", id));
			Alert.alert("Deleted", "Employee record removed.", [{ text: "OK", onPress: () => router.replace("/submissions" as Href) }]);
		} catch {
			Alert.alert("Delete failed", "Could not delete this record. Please try again.");
			setDeleting(false);
		}
	};

	if (loading) {
		return (
			<SafeAreaView style={styles.safe} edges={["bottom"]}>
				<View style={styles.centered}>
					<ActivityIndicator size="large" color="#208AEF" />
					<Text style={styles.helperText}>Loading record…</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (error) {
		return (
			<SafeAreaView style={styles.safe} edges={["bottom"]}>
				<View style={styles.centered}>
					<Text style={styles.errorBanner}>{error}</Text>
					<Pressable style={styles.button} onPress={loadRecord}>
						<Text style={styles.buttonText}>Retry</Text>
					</Pressable>
					<Link href={"/submissions" as Href} asChild>
						<Pressable style={styles.link}>
							<Text style={styles.linkText}>Back to submissions</Text>
						</Pressable>
					</Link>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.safe} edges={["bottom"]}>
			<ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
				<Text style={styles.title}>Edit Record</Text>
				<Text style={styles.subtitle}>Update or delete this submission</Text>

				<Formik
					initialValues={initialValues}
					validationSchema={employeeSchema}
					enableReinitialize
					validateOnChange
					validateOnBlur
					onSubmit={async (values, { setSubmitting, resetForm }) => {
						if (!id) return;

						try {
							await updateDoc(doc(db, "employees", id), {
								...values,
								updatedAt: serverTimestamp(),
							});

							Alert.alert("Updated", "Employee record saved successfully.");
							resetForm({ values });
						} catch {
							Alert.alert("Update failed", "Could not save changes. Check your connection and try again.");
						} finally {
							setSubmitting(false);
						}
					}}>
					{({ values, errors, touched, dirty, isValid, isSubmitting, handleChange, handleBlur, handleSubmit }) => {
						const show = (name: keyof EmployeeFormValues) => (touched[name] || values[name].length > 0) && errors[name];
						const busy = isSubmitting || deleting;

						return (
							<View>
								{employeeFields.map(({ name, label, placeholder, keyboardType, autoCapitalize }) => (
									<View style={styles.field} key={name}>
										<Text style={styles.label}>{label}</Text>
										<TextInput
											style={[styles.input, focus === name && styles.inputFocused, show(name) && styles.inputError]}
											placeholder={placeholder}
											placeholderTextColor="#999"
											value={values[name]}
											onChangeText={handleChange(name)}
											onFocus={() => setFocus(name)}
											onBlur={e => {
												setFocus(null);
												handleBlur(name)(e);
											}}
											keyboardType={keyboardType}
											autoCapitalize={autoCapitalize}
											autoCorrect={false}
											editable={!busy}
										/>
										{show(name) ? <Text style={styles.errorText}>{errors[name]}</Text> : null}
									</View>
								))}

								<Pressable
									style={({ pressed }) => [styles.button, (!isValid || !dirty || busy) && styles.buttonDisabled, pressed && isValid && dirty && !busy && styles.buttonPressed]}
									disabled={!isValid || !dirty || busy}
									onPress={handleSubmit as () => void}>
									{isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Changes</Text>}
								</Pressable>

								<Pressable style={[styles.buttonDanger, busy && styles.buttonDisabled]} disabled={busy} onPress={confirmDelete}>
									{deleting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Delete Record</Text>}
								</Pressable>

								<Link href={"/submissions" as Href} asChild>
									<Pressable style={styles.link} disabled={busy}>
										<Text style={styles.linkText}>Back to submissions</Text>
									</Pressable>
								</Link>
							</View>
						);
					}}
				</Formik>
			</ScrollView>
		</SafeAreaView>
	);
}
