import React from 'react'
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';


function SearchBar() {
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    margin: 0,
    width: '100%',
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      borderRadius: '0.2rem'
    },
  }));

  return (
    <Search sx={{ width:'calc(100%)',marginBottom:'10px', backgroundColor: 'white',borderRadius:'0.3rem'}}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search Analytics for particular student"
        inputProps={{ 'aria-label': 'search' }}
        sx={{ width:'100%',margin:'0px' }}
      />
    </Search>
  );
}

export default SearchBar;
