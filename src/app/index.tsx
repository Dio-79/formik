import { Link, router, type Href } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Formik } from "formik";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { employeeFields, employeeInitial, employeeSchema, type EmployeeFormValues } from "../lib/employeeForm";
import { auth, db } from "../lib/firebase";
import { getFirestoreErrorMessage } from "../lib/firestoreErrors";
import { formStyles as styles } from "../styles/formStyles";

export default function EmployeeScreen() {
	const { user } = useAuth();
	const [focus, setFocus] = useState<string | null>(null);
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
			<ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
				<Text style={styles.title}>Employee</Text>
				<Text style={styles.subtitle}>Signed in as {user?.email ?? "unknown"}</Text>

				<Formik
					initialValues={employeeInitial}
					validationSchema={employeeSchema}
					validateOnChange
					validateOnBlur
					validateOnMount
					onSubmit={async (values, { setSubmitting, resetForm }) => {
						if (!user) {
							Alert.alert("Not signed in", "Please sign in to submit employee records.");
							setSubmitting(false);
							return;
						}

						try {
							await addDoc(collection(db, "employees"), {
								...values,
								userId: user.uid,
								createdAt: serverTimestamp()
							});

							Alert.alert("Saved", "Employee record submitted successfully.", [{ text: "View submissions", onPress: () => router.push("/submissions" as Href) }, { text: "OK" }]);
							resetForm();
						} catch (err) {
							const code = err && typeof err === "object" && "code" in err ? String(err.code) : undefined;
							Alert.alert("Save failed", getFirestoreErrorMessage(code));
						} finally {
							setSubmitting(false);
						}
					}}>
					{({ values, errors, touched, dirty, isValid, isSubmitting, handleChange, handleBlur, handleSubmit, resetForm }) => {
						const show = (name: keyof EmployeeFormValues) => (touched[name] || values[name].length > 0) && errors[name];
						const busy = isSubmitting || signingOut;

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

								<Pressable style={({ pressed }) => [styles.button, (!isValid || !dirty || busy) && styles.buttonDisabled, pressed && isValid && dirty && !busy && styles.buttonPressed]} disabled={!isValid || !dirty || busy} onPress={handleSubmit as () => void}>
									{isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit</Text>}
								</Pressable>

								<Pressable style={styles.buttonSecondary} onPress={() => resetForm()} disabled={busy}>
									<Text style={styles.buttonSecondaryText}>Reset</Text>
								</Pressable>

								<Link href={"/submissions" as Href} asChild>
									<Pressable style={styles.link} disabled={busy}>
										<Text style={styles.linkText}>View my submissions</Text>
									</Pressable>
								</Link>

								<Link href={"/profile" as Href} asChild>
									<Pressable style={styles.link} disabled={busy}>
										<Text style={styles.linkText}>Profile</Text>
									</Pressable>
								</Link>

								<Pressable style={styles.link} onPress={handleSignOut} disabled={busy}>
									{signingOut ? <ActivityIndicator color="#208AEF" /> : <Text style={styles.linkText}>Sign out</Text>}
								</Pressable>
							</View>
						);
					}}
				</Formik>
			</ScrollView>
		</SafeAreaView>
	);
}
