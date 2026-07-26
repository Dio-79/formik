import { Link } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { Formik } from "formik";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { getPasswordResetErrorMessage } from "../lib/authErrors";
import { auth } from "../lib/firebase";
import { formStyles as styles } from "../styles/formStyles";

const schema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Email is required")
});

const initial = { email: "" };

export default function ForgotPasswordScreen() {
	const [focus, setFocus] = useState<string | null>(null);

	return (
		<SafeAreaView style={styles.safe} edges={["bottom"]}>
			<ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
				<Text style={styles.title}>Forgot Password</Text>
				<Text style={styles.subtitle}>Enter your email and we will send a reset link</Text>

				<Formik
					initialValues={initial}
					validationSchema={schema}
					validateOnChange
					validateOnBlur
					validateOnMount
					onSubmit={async (values, { setSubmitting, resetForm }) => {
						try {
							await sendPasswordResetEmail(auth, values.email.trim());
							Alert.alert("Email sent", "Check your inbox for a password reset link.");
							resetForm();
						} catch (error) {
							const code = error && typeof error === "object" && "code" in error ? String(error.code) : undefined;
							Alert.alert("Reset failed", getPasswordResetErrorMessage(code));
						} finally {
							setSubmitting(false);
						}
					}}>
					{({ values, errors, touched, dirty, isValid, isSubmitting, handleChange, handleBlur, handleSubmit, resetForm }) => {
						const show = (touched.email || values.email.length > 0) && errors.email;

						return (
							<View>
								<View style={styles.field}>
									<Text style={styles.label}>Email</Text>
									<TextInput
										style={[styles.input, focus === "email" && styles.inputFocused, show && styles.inputError]}
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
									{show ? <Text style={styles.errorText}>{errors.email}</Text> : null}
								</View>

								<Pressable style={({ pressed }) => [styles.button, (!isValid || !dirty || isSubmitting) && styles.buttonDisabled, pressed && isValid && dirty && !isSubmitting && styles.buttonPressed]} disabled={!isValid || !dirty || isSubmitting} onPress={handleSubmit as () => void}>
									{isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send Reset Link</Text>}
								</Pressable>

								<Pressable style={styles.buttonSecondary} onPress={() => resetForm()} disabled={isSubmitting}>
									<Text style={styles.buttonSecondaryText}>Reset</Text>
								</Pressable>

								<Link href="/sign-in" asChild>
									<Pressable style={styles.link} disabled={isSubmitting}>
										<Text style={styles.linkText}>Back to Sign In</Text>
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
