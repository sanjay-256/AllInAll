// Importing dependencies
import { TextField } from '@mui/material';
import React from 'react';

// First Component
const TextInput1 = ({ label, name, value, onChange, helperText, className, type }) => {
  return (
    <TextField
      type={type}
      label={label}
      variant="outlined"
      className={`text-input-field ${className}`}
      name={name}
      value={value}
      onChange={onChange}
      helperText={helperText}
      sx={{
        m: 0,
        width: '100%', 
        "& .MuiFormHelperText-root": {
          marginLeft: "10px",
        },
        "& .MuiFormLabel-root": {
          color: "black",
        },
        "& .MuiOutlinedInput-root": {
          paddingRight: "10px",
          paddingLeft: "10px", 
        },
      }}
    />
  );
};

// Second Component
const TextInput = ({ label, name, value, onChange, helperText, className, type }) => {
  return (
    <TextField
      type={type}
      label={label}
      variant="outlined"
      className={`text-input-field ${className}`}
      name={name}
      value={value}
      onChange={onChange}
      helperText={helperText}
      sx={{
        m: 0,
        width: '100%', 

        // Helper text style
        "& .MuiFormHelperText-root": {
          marginLeft: "10px",
          color: "white",
        },

        // Label style
        "& .MuiFormLabel-root": {
          color: "white", 
        },

        // Focused label style
        "& .MuiFormLabel-root.Mui-focused": {
          color: "white", 
        },

        // Input field and border styles
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "white", // Default border color
          },
          "&:hover fieldset": {
            borderColor: "white", // Border color on hover
          },
          "&.Mui-focused fieldset": {
            borderColor: "white", // Border color when focused
          },
          color: "white", // Input text color
        },

        // Ensures padding consistency
        "& .MuiOutlinedInput-input": {
          paddingRight: "10px",
          paddingLeft: "10px",
        },
      }}
    />
  );
};


export { TextInput1, TextInput };
