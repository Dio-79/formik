import { useState } from "react";
import { Text,
  View,
  StyleSheet,
  ScrollView,

  TextInput,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {NavigationContainer } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from "yup";
import { useRouter } from "expo-router";

const employee = Yup.object().shape({
     id: Yup.string()
     
   
   
   ,
   FirstName:  Yup.string()
   .min(2,"too short")
   .max(50 ,"max length")
   .required("Full name is required")
   ,
   Email: Yup.string()
   .email("invaild email")
   .required("Email required")
   ,

   PhoneNumber: Yup.string()
     .matches(/^[0-9]{10,11}$/, "Phone number must be 10–11 digits")
   .required("PhoneNumber required")
   ,


   Position: Yup.string()
   .min(2,"too short")
   .max(50 ,"max length")
   .required("Full name is required")
   ,

   Address: Yup.string()
   .min(2,"too short")
   .max(50 ,"max length")
   .required("Full name is required")




});


const styles = StyleSheet.create({

input:{
  borderWidth: 1,
  borderColor:"black",
  borderRadius: 8,
    padding: 12,
    marginBottom: 4,
  },
  inputError: {
    borderColor: '#d32f2f', 
  
},
 errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginBottom: 8,
  },

  
})

 export default function Display () { 
 return(

<SafeAreaView>
<ScrollView>
<Formik 

initialValues={{FirstName:'',
                Email:'',
                PhoneNumber:'',
                Position:'',
                Address:'',

}}
validationSchema={employee}
onSubmit={(values) => console.log(values)}




>
      {({ values, handleChange, handleBlur, handleSubmit, errors, touched  }) => (
    <View >
    <TextInput
    style={[styles.input, touched.FirstName && errors.FirstName && styles.inputError]}
      placeholder = "FirstName"
      value ={values.FirstName}
      onChangeText={handleChange('FirstName')} 
     onBlur={handleBlur('FirstName')}
     keyboardType="default"
     autoCapitalize="none"
    />
  {touched.FirstName && errors.FirstName && <Text>{errors.FirstName}</Text>}


    <TextInput
        style={[styles.input, touched.Email && errors.Email && styles.inputError]}

      placeholder = "Email"
      value ={values.Email}
      onChangeText={handleChange('Email')} 
     onBlur={handleBlur('Email')}
     keyboardType="default"
     autoCapitalize="none"
    />
  {touched.Email && errors.Email && <Text>{errors.Email}</Text>}
   

 <TextInput
         style={[styles.input, touched.PhoneNumber && errors.PhoneNumber && styles.inputError]}

      placeholder = "PhoneNumber"
      value ={values.PhoneNumber}
      onChangeText={handleChange('PhoneNumber')} 
     onBlur={handleBlur('PhoneNumber')}
     keyboardType="default"
     autoCapitalize="none"
    />
  {touched.PhoneNumber && errors.PhoneNumber && <Text>{errors.PhoneNumber}</Text>}


     <TextInput
              style={[styles.input, touched.Position && errors.Position && styles.inputError]}

      placeholder = "Position"
      value ={values.Position}
      onChangeText={handleChange('Position')} 
     onBlur={handleBlur('Position')}
     keyboardType="default"
     autoCapitalize="none"
    />
  {touched.Position && errors.Position && <Text>{errors.Position}</Text>}

        <TextInput
       style={[styles.input, touched.Address && errors.Address && styles.inputError]}

      placeholder = "Address"
      value ={values.Address}
      onChangeText={handleChange('Address')} 
     onBlur={handleBlur('Address')}
     keyboardType="default"
     autoCapitalize="none"
    />
  {touched.Address && errors.Address && <Text>{errors.Address}</Text>}

 <Pressable onPress={handleSubmit as () => void}>
            <Text>Log In</Text>
            </Pressable>

    </View>
  
      )}
  </Formik>

            
</ScrollView>
</SafeAreaView>

    )


}

