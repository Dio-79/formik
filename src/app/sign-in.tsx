import { Ionicons } from "@expo/vector-icons";
import { Link, type Href } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Formik } from "formik";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { formStyles as styles } from "../styles/formStyles";
import { getAuthErrorMessage } from "../lib/authErrors";
import { auth } from "../lib/firebase";

const schema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Email is required"),
	password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
});

const initial = { email: "", password: "" };

export default function SignInScreen() {
	const [focus, setFocus] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	return (
		<SafeAreaView style={styles.safe} edges={["bottom"]}>
			<ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
				<Text style={styles.title}>Sign In</Text>
				<Text style={styles.subtitle}>Welcome back</Text>

				<Formik
					initialValues={initial}
					validationSchema={schema}
					validateOnChange
					validateOnBlur
					validateOnMount
					onSubmit={async (values, { setSubmitting }) => {
						try {
							await signInWithEmailAndPassword(auth, values.email.trim(), values.password);
						} catch (error) {
							const code = error && typeof error === "object" && "code" in error ? String(error.code) : undefined;
							Alert.alert("Sign in failed", getAuthErrorMessage(code));
						} finally {
							setSubmitting(false);
						}
					}}>
					{({ values, errors, touched, dirty, isValid, isSubmitting, handleChange, handleBlur, handleSubmit, resetForm }) => {
						const show = (name: keyof typeof initial) => (touched[name] || values[name].length > 0) && errors[name];

						return (
							<View>
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

								<Pressable style={({ pressed }) => [styles.button, (!isValid || !dirty || isSubmitting) && styles.buttonDisabled, pressed && isValid && dirty && !isSubmitting && styles.buttonPressed]} disabled={!isValid || !dirty || isSubmitting} onPress={handleSubmit as () => void}>
									{isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
								</Pressable>

								<Pressable style={styles.buttonSecondary} onPress={() => resetForm()} disabled={isSubmitting}>
									<Text style={styles.buttonSecondaryText}>Reset</Text>
								</Pressable>

								<Link href="/sign-up" asChild>
									<Pressable style={styles.link} disabled={isSubmitting}>
										<Text style={styles.linkText}>Create an account</Text>
									</Pressable>
								</Link>

								<Link href={"/forgot-password" as Href} asChild>
									<Pressable style={styles.link} disabled={isSubmitting}>
										<Text style={styles.linkText}>Forgot password?</Text>
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
