// import React from 'react';
// import IconButton from '@mui/material/IconButton';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputLabel from '@mui/material/InputLabel';
// import InputAdornment from '@mui/material/InputAdornment';
// import FormControl from '@mui/material/FormControl';
// import FormHelperText from '@mui/material/FormHelperText';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';

// const Password = ({ helperText, name, onChange, value, className }) => {
//   const [showPassword, setShowPassword] = React.useState(false);

//   const handleClickShowPassword = () => setShowPassword((show) => !show);
//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };

//   return (
//     <FormControl
//       className={`password-field ${className}`}
//       sx={{ m: 0, width: '100%' }} // Ensures full width
//       variant="outlined"
//     >
//       <InputLabel htmlFor={`outlined-adornment-${name}`} sx={{color:"black"}} >Password</InputLabel>
//       <OutlinedInput
//         id={`outlined-adornment-${name}`}
//         type={showPassword ? 'text' : 'password'}
//         name={name}
//         value={value}
//         onChange={onChange}
//         endAdornment={
//           <InputAdornment position="end">
//             <IconButton
//               aria-label={showPassword ? 'hide the password' : 'display the password'}
//               onClick={handleClickShowPassword}
//               onMouseDown={handleMouseDownPassword}
//               edge="end"
//             >
//               {showPassword ? <VisibilityOff /> : <Visibility />}
//             </IconButton>
//           </InputAdornment>
//         }
//         label="Password"
//         sx={{
//           paddingRight: "10px",
//           paddingLeft: "10px", // Match padding with TextInput
//         }}
//       />
//       {helperText && <FormHelperText>{helperText}</FormHelperText>}
//     </FormControl>
//   );
// };

// export default Password;

import React from 'react';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Password = ({ helperText, name, onChange, value, className }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl
      className={`password-field ${className}`}
      sx={{ m: 0, width: '100%' }} // Ensures full width
      variant="outlined"
    >
      <InputLabel
        htmlFor={`outlined-adornment-${name}`}
        sx={{
          color: 'white',
          '&.Mui-focused': { color: 'white' }, // Label color when focused
        }}
      >
        Password
      </InputLabel>
      <OutlinedInput
        id={`outlined-adornment-${name}`}
        type={showPassword ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={showPassword ? 'hide the password' : 'display the password'}
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              sx={{ color: 'white' }} // Icon color
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
        sx={{
          color: 'white', // Text color
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white', // Border color
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white', // Border color on hover
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white', // Border color on focus
          },
          input: {
            color: 'white', // Input text color
          },
        }}
      />
      {helperText && (
        <FormHelperText sx={{ color: 'white', marginLeft: '10px' }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default Password;

