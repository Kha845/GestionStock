import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

interface ServerSideAutocompleteProps {
  label: string;
  ajaxCallFn: Function;
  onOptionSelect: (option: any) => void;
  error: any;
  field: any;
}

const ServerSideAutocomplete: React.FC<ServerSideAutocompleteProps> = 
({ label, ajaxCallFn, onOptionSelect, error, field }) => {
    
    const [options, setOptions] = useState<any[]>([]);
    const [inputvalue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    // Effect pour récupérer les options
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchOptions();
                setOptions(response);

            } catch (error) {
                console.error('Error fetching options:', error);
            }           
        };
        fetchData()
    }, [inputvalue,onOptionSelect,error]);

const fetchOptions = async () =>{
      setLoading(true);
      const response = await ajaxCallFn({ search: inputvalue });
      setLoading(true);
      return response;
  }
    return (
      <Autocomplete
          sx={{ width: 350 }}
          {...field}
          options={options}
          getOptionLabel={(option: any) => option.label ?? ""}
          isOptionEqualToValue={(option: any, value: any) => option.label === value.label} // Comparez par ID ou par un attribut unique
          filterOptions={(x) => x}
          onKeyUp={(e:any) => {setInputValue(e.target.value)}} 
            // Gérer le changement de l'input
          onChange={(_, newValue) => onOptionSelect(newValue)} // Lorsque l'utilisateur sélectionne une option
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              variant="filled"
              fullWidth
              error={!!error}
              helperText={error?.message}
              autoComplete="new-password"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
    );
}

export default observer(ServerSideAutocomplete);
