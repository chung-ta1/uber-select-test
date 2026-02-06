export interface StringOption {
  label: string;
  value: string;
  image?: string;
  subLabel?: string;
  mappedData?: Record<string, unknown>;
}

export type SelectionsDisplayPosition = 'ABOVE' | 'BELOW' | 'WITHIN';

export interface QueryParameter {
  name: string;
  required?: boolean;
}

export interface RemoteOptions {
  url: string;
  preloadAll?: boolean;
  queryParameters?: QueryParameter[];
  resultsJsonPath?: string;
}

export interface ResultMapping {
  labelExpression?: string;
  imageUrlJsonPath?: string;
}

export interface SearchConfig {
  enabled?: boolean;
  minInputLength?: number;
  debounceDelayMs?: number;
}

export interface SelectionsDisplay {
  position?: SelectionsDisplayPosition;
}

export interface DropdownDisplay {
  noResultsMessage?: string;
}

export interface ManualEntryFieldDefinition {
  type: string;
  label: string;
  alias: string;
  required: boolean;
  placeholder?: string;
}

export interface ManualEntrySubformConfig {
  labelExpression?: string;
  fields: ManualEntryFieldDefinition[];
}

export interface ManualEntryConfig {
  triggerText?: string;
  subformConfig?: ManualEntrySubformConfig;
}

export interface UberSelectFieldConfig {
  label: string;
  required?: boolean;
  placeholder?: string;
  subtitle?: string;
  options?: StringOption[];
  remoteOptions?: RemoteOptions;
  resultMapping?: ResultMapping;
  answerMapping?: Record<string, string>;
  searchConfig?: SearchConfig;
  minSelections?: number;
  maxSelections?: number;
  selectionsDisplay?: SelectionsDisplay;
  dropdownDisplay?: DropdownDisplay;
  manualEntryConfig?: ManualEntryConfig;
  selectionsHeader?: string;
  showClearButton?: boolean;
  readOnly?: boolean;
}
