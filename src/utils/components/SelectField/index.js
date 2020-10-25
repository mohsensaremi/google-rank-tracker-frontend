import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';

const SelectField = React.forwardRef((props, ref) => {

    const {
        label,
        children,
        margin,
        fullWidth,
        className,
        variant,
        InputLabelProps,
        helperText,
        error,
        ...otherProps
    } = props;

    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    return (
        <FormControl
            margin={margin}
            fullWidth={fullWidth}
            variant={variant}
            className={className}
            error={error}
        >
            <InputLabel ref={inputLabel} {...InputLabelProps}>{label}</InputLabel>
            <Select
                {...otherProps}
                labelWidth={labelWidth}
                ref={ref}
            >
                {children}
            </Select>
            {
                helperText && (
                    <FormHelperText error={error}>{helperText}</FormHelperText>
                )
            }
        </FormControl>
    );
});


export default SelectField;