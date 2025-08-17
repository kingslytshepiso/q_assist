import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { theme } from "../lib/theme";

interface DropdownOption {
  id: string;
  label: string;
}

interface DropdownPickerProps {
  placeholder: string;
  selectedOption: DropdownOption | null;
  options: DropdownOption[];
  onSelectOption: (option: DropdownOption) => void;
  style?: any;
  maxHeight?: number;
  onOpenChange?: (isOpen: boolean) => void;
}

export const DropdownPicker: React.FC<DropdownPickerProps> = ({
  placeholder,
  selectedOption,
  options,
  onSelectOption,
  style,
  maxHeight = 200,
  onOpenChange,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedOption?.id || null);
  const [items, setItems] = useState(
    options.map((option) => ({
      label: option.label,
      value: option.id,
    }))
  );

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  useEffect(() => {
    setValue(selectedOption?.id || null);
  }, [selectedOption]);

  useEffect(() => {
    setItems(
      options.map((option) => ({
        label: option.label,
        value: option.id,
      }))
    );
  }, [options]);

  return (
    <View style={[styles.container, style]}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onSelectItem={(item) => {
          console.log("onSelectItem called with:", item);
          if (item) {
            const selectedItem = options.find(
              (option) => option.id === item.value
            );
            if (selectedItem) {
              console.log("Calling onSelectOption with:", selectedItem);
              onSelectOption(selectedItem);
            }
          }
        }}
        placeholder={placeholder}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
        // maxHeight={maxHeight}
        zIndex={2000}
        zIndexInverse={2000}
        theme="LIGHT"
        placeholderStyle={styles.placeholder}
        labelStyle={styles.label}
        listItemLabelStyle={styles.listItemLabel}
        selectedItemLabelStyle={styles.selectedItemLabel}
        selectedItemContainerStyle={styles.selectedItemContainer}
        arrowIconStyle={styles.arrowIcon}
        tickIconStyle={styles.tickIcon}
        searchable={false}
        closeAfterSelecting={true}
        closeOnBackPressed={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 2000,
  },
  dropdown: {
    backgroundColor: theme.colors.background.secondary,
    borderColor: theme.colors.border.medium,
    borderWidth: 1,
    borderRadius: theme.borderRadius.base,
    minHeight: theme.layout.inputHeight.base,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
  },
  dropdownContainer: {
    backgroundColor: theme.colors.background.secondary,
    borderColor: theme.colors.border.medium,
    borderWidth: 1,
    borderRadius: theme.borderRadius.base,
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 2,
  },
  placeholder: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.size.base,
  },
  label: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.base,
  },
  listItemLabel: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.base,
    paddingVertical: theme.spacing[2],
  },
  selectedItemLabel: {
    color: theme.colors.primary.main,
    fontWeight: theme.typography.weight.semibold,
  },
  selectedItemContainer: {
    backgroundColor: theme.colors.primary.light + "20",
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: theme.colors.text.tertiary,
  },
  tickIcon: {
    width: 20,
    height: 20,
    tintColor: theme.colors.primary.main,
  },
});
