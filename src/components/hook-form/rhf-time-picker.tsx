import type { Dayjs } from 'dayjs';
import type { TextFieldProps } from '@mui/material/TextField';
import type { TimePickerProps } from '@mui/x-date-pickers/TimePicker';

import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';

import { formatPatterns } from 'src/utils/format-time';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

type RHFTimePickerProps = TimePickerProps<Dayjs> & {
  name: string;
};

export function RHFTimePicker({ name, slotProps, ...other }: RHFTimePickerProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TimePicker
          {...field}
          value={dayjs(field.value)}
          ampm={false}
          onChange={(newValue) => field.onChange(dayjs(newValue).format())}
          slotProps={{
            ...slotProps,
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message ?? (slotProps?.textField as TextFieldProps)?.helperText,
              ...slotProps?.textField,
            },
          }}
          {...other}
        />
      )}
    />
  );
}