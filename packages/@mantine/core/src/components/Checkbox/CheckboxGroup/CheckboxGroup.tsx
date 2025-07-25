import { useUncontrolled } from '@mantine/hooks';
import { DataAttributes, factory, Factory, MantineSize, useProps } from '../../../core';
import { InputsGroupFieldset } from '../../../utils/InputsGroupFieldset';
import { Input, InputWrapperProps, InputWrapperStylesNames } from '../../Input';
import { CheckboxGroupProvider } from '../CheckboxGroup.context';

export type CheckboxGroupStylesNames = InputWrapperStylesNames;

export interface CheckboxGroupProps extends Omit<InputWrapperProps, 'onChange'> {
  /** `Checkbox` components and any other elements */
  children: React.ReactNode;

  /** Controlled component value */
  value?: string[];

  /** Default value for uncontrolled component */
  defaultValue?: string[];

  /** Called with an array of selected checkboxes values when value changes */
  onChange?: (value: string[]) => void;

  /** Props passed down to the root element (`Input.Wrapper` component) */
  wrapperProps?: React.ComponentPropsWithoutRef<'div'> & DataAttributes;

  /** Controls size of the `Input.Wrapper` @default `'sm'` */
  size?: MantineSize | (string & {});

  /** If set, value cannot be changed */
  readOnly?: boolean;
}

export type CheckboxGroupFactory = Factory<{
  props: CheckboxGroupProps;
  ref: HTMLDivElement;
  stylesNames: CheckboxGroupStylesNames;
}>;

export const CheckboxGroup = factory<CheckboxGroupFactory>((props, ref) => {
  const { value, defaultValue, onChange, size, wrapperProps, children, readOnly, ...others } =
    useProps('CheckboxGroup', null, props);

  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: [],
    onChange,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | string) => {
    const itemValue = typeof event === 'string' ? event : event.currentTarget.value;
    !readOnly &&
      setValue(
        _value.includes(itemValue)
          ? _value.filter((item) => item !== itemValue)
          : [..._value, itemValue]
      );
  };

  return (
    <CheckboxGroupProvider value={{ value: _value, onChange: handleChange, size }}>
      <Input.Wrapper
        size={size}
        ref={ref}
        {...wrapperProps}
        {...others}
        labelElement="div"
        __staticSelector="CheckboxGroup"
      >
        <InputsGroupFieldset role="group">{children}</InputsGroupFieldset>
      </Input.Wrapper>
    </CheckboxGroupProvider>
  );
});

CheckboxGroup.classes = Input.Wrapper.classes;
CheckboxGroup.displayName = '@mantine/core/CheckboxGroup';
