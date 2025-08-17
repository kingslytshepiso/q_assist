import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { theme } from "../lib/theme";

interface AutocompleteOption {
  id: string;
  label: string;
  subtitle?: string;
}

interface AutocompleteInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSelectOption: (option: AutocompleteOption) => void;
  options: AutocompleteOption[];
  showOptions: boolean;
  onShowOptionsChange: (show: boolean) => void;
  style?: any;
  inputStyle?: any;
  maxHeight?: number;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  placeholder,
  value,
  onChangeText,
  onSelectOption,
  options,
  showOptions,
  onShowOptionsChange,
  style,
  inputStyle,
  maxHeight = 200,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<any>(null);

  // Sync inputValue with external value prop
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = useCallback(
    (text: string) => {
      setInputValue(text);
      onChangeText(text);
    },
    [onChangeText]
  );

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    // Delay hiding to allow for option selection
    setTimeout(() => {
      onShowOptionsChange(false);
    }, 200);
  }, [onShowOptionsChange]);

  const handleSelectOption = useCallback(
    (option: AutocompleteOption) => {
      setInputValue(option.label);
      onSelectOption(option);
      onShowOptionsChange(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    },
    [onSelectOption, onShowOptionsChange]
  );

  const renderItem = useCallback(
    ({ item }: { item: AutocompleteOption }) => (
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => handleSelectOption(item)}
        activeOpacity={0.7}
      >
        <View style={styles.suggestionContent}>
          <Text style={styles.suggestionLabel}>{item.label}</Text>
          {item.subtitle && (
            <Text style={styles.suggestionSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </TouchableOpacity>
    ),
    [handleSelectOption]
  );

  // Only show options when focused and there are options to show
  const shouldShowOptions = isFocused && showOptions && options.length > 0;

  return (
    <View style={[styles.container, style]}>
      <Autocomplete
        ref={inputRef}
        data={shouldShowOptions ? options : []}
        value={inputValue}
        onChangeText={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        flatListProps={{
          keyExtractor: (item: AutocompleteOption) => item.id,
          renderItem: renderItem,
          style: { maxHeight },
          nestedScrollEnabled: true,
          keyboardShouldPersistTaps: "handled",
          showsVerticalScrollIndicator: false,
        }}
        inputContainerStyle={[styles.inputContainer, inputStyle]}
        listContainerStyle={styles.listContainer}
        hideResults={!shouldShowOptions}
        containerStyle={styles.autocompleteContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  autocompleteContainer: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.base,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    minHeight: theme.layout.inputHeight.base,
  },
  listContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.base,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 2,
    maxHeight: 200,
    zIndex: 1001,
  },
  suggestionItem: {
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionLabel: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  suggestionSubtitle: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
  },
});
