import React from 'react'
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function TeacherDropdown() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120, width: '200px' }}>
      <FormControl fullWidth>
        <Select
          value={age}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label', }}
          sx={{ fontSize: '0.8em', height: '2.5em', backgroundColor: '#e3e1e1' }}
        >
          <MenuItem value="" sx={{ fontSize: '0.8em' }}>
            You vs Class - Bar Chart
          </MenuItem>
          <MenuItem value={10} sx={{ fontSize: '0.8em' }}>Ten</MenuItem>
          <MenuItem value={20} sx={{ fontSize: '0.8em' }}>Twenty</MenuItem>
          <MenuItem value={30} sx={{ fontSize: '0.8em' }}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default TeacherDropdown;

