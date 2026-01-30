export interface StringOption {
  label: string;
  value: string;
  image?: string;
  subLabel?: string;
}

export interface SearchableSelectedOption {
  _type?: 'SearchableSelectedOption';
  label: string;
  value: string;
  imageUrl?: string;
}

export type SelectionMode = 'SINGLE' | 'MULTI';

export type SelectionsDisplayMode = 'ABOVE' | 'BELOW';

export interface QueryParameter {
  name: string;
  required?: boolean;
}

export interface ResponseMapping {
  optionsPath: string;
  labelPath: string;
  valuePath: string;
  subLabelPath?: string;
  imagePath?: string;
}

export interface RemoteOptions {
  url: string;
  preloadAll?: boolean;
  queryParameters?: QueryParameter[];
  responseMapping?: ResponseMapping;
}

export interface AutoCompleteConfig {
  minChars?: number;
  debounceMillis?: number;
  noMatchesMessage?: string;
  caseSensitive?: boolean;
}

export interface UberSelectFieldConfig {
  label: string;
  required?: boolean;
  placeholder?: string;
  subtitle?: string;
  selectionMode?: SelectionMode;
  options?: StringOption[];
  remoteOptions?: RemoteOptions;
  autoCompleteEnabled?: boolean;
  autoComplete?: AutoCompleteConfig;
  minSelections?: number;
  maxSelections?: number;
  selectionsDisplayMode?: SelectionsDisplayMode;
  readOnly?: boolean;
}
