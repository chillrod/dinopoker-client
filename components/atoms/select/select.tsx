import { chakra, Select as Sl } from "@chakra-ui/react";
import { useState } from "react";

export type IOption = {
  id: number | string;
  text: string;
  value: number[];
};

interface ISelect {
  options: IOption[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  disabled?: boolean;
  selected?: number | string;
}

const Option = chakra("option", {});

export const Select = ({ options, onChange, disabled, selected }: ISelect) => {
  return (
    <Sl
      role="@dino-select"
      defaultValue={selected}
      onChange={onChange}
      bg="dino.secondary"
      size="lg"
      color="dino.text"
      border="none"
      outline="none"
      isDisabled={disabled}
    >
      {options.map((option) => (
        <Option role="@dino-selectoption" key={option.text} value={option.id}>
          {option.text}
        </Option>
      ))}
    </Sl>
  );
};
