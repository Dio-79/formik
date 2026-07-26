import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Formik } from "formik";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { formStyles as styles } from "../styles/formStyles";
import { getAuthErrorMessage } from "../lib/authErrors";
import { auth } from "../lib/firebase";

const schema = Yup.object().shape({
	fullName: Yup.string().min(2, "Too short").max(50, "Max length exceeded").required("Full name is required"),
	email: Yup.string().email("Invalid email").required("Email is required"),
	password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref("password")], "Passwords must match")
		.required("Confirm password is required")
});

const initial = { fullName: "", email: "", password: "", confirmPassword: "" };

export default function SignUpScreen() {
	const [focus, setFocus] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	return (
		<SafeAreaView style={styles.safe} edges={["bottom"]}>
			<ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
				<Text style={styles.title}>Sign Up</Text>
				<Text style={styles.subtitle}>Create your account</Text>

				<Formik
					initialValues={initial}
					validationSchema={schema}
					validateOnChange
					validateOnBlur
					validateOnMount
					onSubmit={async (values, { setSubmitting }) => {
						try {
							const credential = await createUserWithEmailAndPassword(auth, values.email.trim(), values.password);
							await updateProfile(credential.user, { displayName: values.fullName.trim() });
						} catch (error) {
							const code = error && typeof error === "object" && "code" in error ? String(error.code) : undefined;
							Alert.alert("Sign up failed", getAuthErrorMessage(code));
						} finally {
							setSubmitting(false);
						}
					}}>
					{({ values, errors, touched, dirty, isValid, isSubmitting, handleChange, handleBlur, handleSubmit, resetForm }) => {
						const show = (name: keyof typeof initial) => (touched[name] || values[name].length > 0) && errors[name];

						return (
							<View>
								<View style={styles.field}>
									<Text style={styles.label}>Full name</Text>
									<TextInput
										style={[styles.input, focus === "fullName" && styles.inputFocused, show("fullName") && styles.inputError]}
										placeholder="Jane Doe"
										placeholderTextColor="#999"
										value={values.fullName}
										onChangeText={handleChange("fullName")}
										onFocus={() => setFocus("fullName")}
										onBlur={e => {
											setFocus(null);
											handleBlur("fullName")(e);
										}}
										autoCapitalize="words"
										editable={!isSubmitting}
									/>
									{show("fullName") ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
								</View>

								<View style={styles.field}>
									<Text style={styles.label}>Email</Text>
									<TextInput
										style={[styles.input, focus === "email" && styles.inputFocused, show("email") && styles.inputError]}
										placeholder="jane@email.com"
										placeholderTextColor="#999"
										value={values.email}
										onChangeText={handleChange("email")}
										onFocus={() => setFocus("email")}
										onBlur={e => {
											setFocus(null);
											handleBlur("email")(e);
										}}
										keyboardType="email-address"
										autoCapitalize="none"
										autoCorrect={false}
										editable={!isSubmitting}
									/>
									{show("email") ? <Text style={styles.errorText}>{errors.email}</Text> : null}
								</View>

								<View style={styles.field}>
									<Text style={styles.label}>Password</Text>
									<View style={styles.passwordRow}>
										<TextInput
											style={[styles.input, styles.passwordInput, focus === "password" && styles.inputFocused, show("password") && styles.inputError]}
											placeholder="••••••••"
											placeholderTextColor="#999"
											value={values.password}
											onChangeText={handleChange("password")}
											onFocus={() => setFocus("password")}
											onBlur={e => {
												setFocus(null);
												handleBlur("password")(e);
											}}
											secureTextEntry={!showPassword}
											autoCapitalize="none"
											editable={!isSubmitting}
										/>
										<Pressable style={styles.toggle} onPress={() => setShowPassword(v => !v)} disabled={isSubmitting}>
											<Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#208AEF" />
										</Pressable>
									</View>
									{show("password") ? <Text style={styles.errorText}>{errors.password}</Text> : null}
								</View>

								<View style={styles.field}>
									<Text style={styles.label}>Confirm password</Text>
									<View style={styles.passwordRow}>
										<TextInput
											style={[styles.input, styles.passwordInput, focus === "confirmPassword" && styles.inputFocused, show("confirmPassword") && styles.inputError]}
											placeholder="••••••••"
											placeholderTextColor="#999"
											value={values.confirmPassword}
											onChangeText={handleChange("confirmPassword")}
											onFocus={() => setFocus("confirmPassword")}
											onBlur={e => {
												setFocus(null);
												handleBlur("confirmPassword")(e);
											}}
											secureTextEntry={!showConfirm}
											autoCapitalize="none"
											editable={!isSubmitting}
										/>
										<Pressable style={styles.toggle} onPress={() => setShowConfirm(v => !v)} disabled={isSubmitting}>
											<Ionicons name={showConfirm ? "eye-off" : "eye"} size={22} color="#208AEF" />
										</Pressable>
									</View>
									{show("confirmPassword") ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
								</View>

								<Pressable style={({ pressed }) => [styles.button, (!isValid || !dirty || isSubmitting) && styles.buttonDisabled, pressed && isValid && dirty && !isSubmitting && styles.buttonPressed]} disabled={!isValid || !dirty || isSubmitting} onPress={handleSubmit as () => void}>
									{isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
								</Pressable>

								<Pressable style={styles.buttonSecondary} onPress={() => resetForm()} disabled={isSubmitting}>
									<Text style={styles.buttonSecondaryText}>Reset</Text>
								</Pressable>

								<Link href="/sign-in" asChild>
									<Pressable style={styles.link} disabled={isSubmitting}>
										<Text style={styles.linkText}>Already have an account? Sign In</Text>
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
