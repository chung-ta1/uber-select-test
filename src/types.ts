export interface StringOption {
  label: string;
  value: string;
  image?: string;
  subLabel?: string;
  mappedData?: Record<string, unknown>;
}

export interface SearchableSelectedOption {
  _type?: 'SearchableSelectedOption';
  label: string;
  value: string;
  imageUrl?: string;
}

export type SelectionMode = 'SINGLE' | 'MULTI';

export type SelectionsDisplayMode = 'ABOVE' | 'BELOW' | 'WITHIN';

export interface QueryParameter {
  name: string;
  required?: boolean;
}

export interface RemoteOptions {
  url: string;
  preloadAll?: boolean;
  queryParameters?: QueryParameter[];
  resultsPath?: string;
  fields?: Record<string, string>;
}

export type AutoCompleteMatchMode = 'STARTS_WITH' | 'CONTAINS' | 'FUZZY';

export interface AutoCompleteConfig {
  enabled?: boolean;
  minChars?: number;
  debounceMillis?: number;
  noMatchesMessage?: string;
  caseSensitive?: boolean;
  localMatchMode?: AutoCompleteMatchMode;
}

export interface ManualEntryFieldDefinition {
  type: string;
  label: string;
  alias: string;
  required: boolean;
  placeholder?: string;
}

export interface ManualEntryConfig {
  fields: ManualEntryFieldDefinition[];
  [key: string]: string | ManualEntryFieldDefinition[] | undefined;
}

export interface UberSelectFieldConfig {
  label: string;
  required?: boolean;
  placeholder?: string;
  subtitle?: string;
  selectionMode?: SelectionMode;
  options?: StringOption[];
  remoteOptions?: RemoteOptions;
  manualEntry?: ManualEntryConfig[];
  autoComplete?: AutoCompleteConfig;
  minSelections?: number;
  maxSelections?: number;
  selectionsDisplayMode?: SelectionsDisplayMode;
  selectionsHeader?: string;
  showClearButton?: boolean;
  readOnly?: boolean;
}
