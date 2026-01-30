import { useState, useCallback } from 'react';
import Select from 'react-select';
import type { MultiValue, SingleValue, StylesConfig } from 'react-select';
import { AsyncPaginate } from 'react-select-async-paginate';
import type { UberSelectFieldConfig, StringOption, ResponseMapping } from '../types';

interface UberSelectProps {
  config: UberSelectFieldConfig;
  paramValues: Record<string, string>;
  token?: string;
  value?: StringOption | StringOption[] | null;
  onChange?: (value: StringOption | StringOption[] | null) => void;
}

const customStyles: StylesConfig<StringOption, boolean> = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
    '&:hover': {
      borderColor: '#3b82f6',
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#3b82f6'
      : state.isFocused
      ? '#eff6ff'
      : 'white',
    color: state.isSelected ? 'white' : '#1f2937',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#eff6ff',
    borderRadius: '4px',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#1e40af',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: '#1e40af',
    '&:hover': {
      backgroundColor: '#dbeafe',
      color: '#1e3a8a',
    },
  }),
};

const formatOptionLabel = (option: StringOption) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    {option.image && (
      <img src={option.image} alt="" style={{ width: '20px', height: '20px', borderRadius: '4px' }} />
    )}
    <div>
      <div>{option.label}</div>
      {option.subLabel && (
        <div style={{ fontSize: '12px', color: '#6b7280' }}>{option.subLabel}</div>
      )}
    </div>
  </div>
);


const resolveJsonPath = (obj: unknown, path: string): unknown => {
  // Strip leading "$." or "$" prefix
  const normalizedPath = path.startsWith('$.') ? path.slice(2) : path.startsWith('$') ? path.slice(1) : path;
  if (!normalizedPath) return obj;

  // Split into tokens: "field", "[0]", "nested" etc.
  const tokens = normalizedPath.match(/[^.[\]]+|\[\d+]/g);
  if (!tokens) return undefined;

  return tokens.reduce((acc: unknown, token) => {
    if (acc == null) return undefined;
    // Array index: [0], [1], etc.
    const indexMatch = token.match(/^\[(\d+)]$/);
    if (indexMatch) {
      return Array.isArray(acc) ? acc[parseInt(indexMatch[1])] : undefined;
    }
    // Object field
    if (typeof acc === 'object') {
      return (acc as Record<string, unknown>)[token];
    }
    return undefined;
  }, obj);
};

const mapResponse = (data: Record<string, unknown>, mapping?: ResponseMapping): { options: StringOption[], hasMore: boolean } => {
  if (!mapping) {
    return {
      options: (data.options as StringOption[]) || [],
      hasMore: false,
    };
  }

  const rawOptions = resolveJsonPath(data, mapping.optionsPath) as Record<string, unknown>[] || [];

  const options: StringOption[] = rawOptions.map((item) => ({
    label: String(resolveJsonPath(item, mapping.labelPath) || ''),
    value: String(resolveJsonPath(item, mapping.valuePath) || ''),
    subLabel: mapping.subLabelPath ? String(resolveJsonPath(item, mapping.subLabelPath) || '') : undefined,
    image: mapping.imagePath ? String(resolveJsonPath(item, mapping.imagePath) || '') : undefined,
  }));

  return { options, hasMore: options.length > 0 };
};

export default function UberSelect({ config, paramValues, token, value, onChange }: UberSelectProps) {
  const [inputValue, setInputValue] = useState('');

  const isMulti = config.selectionMode === 'MULTI';
  const debounceMs = config.autoComplete?.debounceMillis ?? 250;
  const minChars = config.autoComplete?.minChars ?? 3;
  const noMatchesMessage = config.autoComplete?.noMatchesMessage ?? 'No results';

  const loadOptions = useCallback(
    async (search: string, _loadedOptions: unknown, additional?: { page: number }) => {
      if (!config.remoteOptions?.url) {
        return { options: [], hasMore: false };
      }

      // Use paramValues['searchText'] if available, otherwise use the typed search
      const effectiveSearch = paramValues['searchText'] || search;

      if (effectiveSearch.length < minChars && !config.remoteOptions.preloadAll) {
        return { options: [], hasMore: false };
      }

      try {
        const page = additional?.page ?? 1;
        const remote = config.remoteOptions;
        const url = new URL(remote.url);

        // Set all query parameters from user-entered values
        remote.queryParameters?.forEach((param) => {
          const value = paramValues[param.name];
          if (value) {
            // Handle page number - increment for pagination
            if (param.name === 'page' || param.name === 'pageNumber' || param.name === 'pageNum') {
              url.searchParams.set(param.name, page.toString());
            } else {
              url.searchParams.set(param.name, value);
            }
          }
        });

        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(url.toString(), { headers });
        const data = await response.json();
        const mapped = mapResponse(data, remote.responseMapping);

        return {
          options: mapped.options,
          hasMore: mapped.hasMore,
          additional: { page: page + 1 },
        };
      } catch (error) {
        console.error('Failed to fetch options:', error);
        return { options: [], hasMore: false };
      }
    },
    [config.remoteOptions, minChars, paramValues, token]
  );

  const filterStaticOptions = useCallback(
    (option: { data: StringOption }, inputValue: string) => {
      if (!inputValue) return true;

      const searchTerm = config.autoComplete?.caseSensitive
        ? inputValue
        : inputValue.toLowerCase();
      const label = config.autoComplete?.caseSensitive
        ? option.data.label
        : option.data.label.toLowerCase();

      return label.includes(searchTerm);
    },
    [config.autoComplete]
  );

  const handleChange = (
    newValue: MultiValue<StringOption> | SingleValue<StringOption>
  ) => {
    if (isMulti) {
      const values = newValue as MultiValue<StringOption>;
      // Don't enforce maxSelections on frontend - let backend validation handle it
      onChange?.(values ? [...values] : []);
    } else {
      onChange?.(newValue as StringOption | null);
    }
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
  };

  const getSelectedValues = () => {
    if (!value) return isMulti ? [] : null;
    return value;
  };

  const renderSelectedAbove = () => {
    if (config.selectionsDisplayMode !== 'ABOVE' || !isMulti) return null;
    const values = (value as StringOption[]) || [];
    if (values.length === 0) return null;

    return (
      <div style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {values.map((v) => (
            <span
              key={v.value}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              {v.image && <img src={v.image} alt="" style={{ width: '16px', height: '16px', borderRadius: '4px' }} />}
              {v.label}
              <button
                type="button"
                onClick={() => {
                  onChange?.(values.filter((x) => x.value !== v.value));
                }}
                style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: '0' }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderSelectedBelow = () => {
    if (config.selectionsDisplayMode !== 'BELOW' || !isMulti) return null;
    const values = (value as StringOption[]) || [];
    if (values.length === 0) return null;

    return (
      <div style={{ marginTop: '8px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {values.map((v) => (
            <span
              key={v.value}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              {v.image && <img src={v.image} alt="" style={{ width: '16px', height: '16px', borderRadius: '4px' }} />}
              {v.label}
              <button
                type="button"
                onClick={() => {
                  onChange?.(values.filter((x) => x.value !== v.value));
                }}
                style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: '0' }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  };

  const selectProps = {
    isMulti,
    value: getSelectedValues(),
    onChange: handleChange,
    onInputChange: handleInputChange,
    inputValue,
    placeholder: config.placeholder || 'Select...',
    isDisabled: config.readOnly,
    isClearable: true,
    styles: customStyles,
    formatOptionLabel,
    noOptionsMessage: () => noMatchesMessage,
    controlShouldRenderValue: !isMulti || !config.selectionsDisplayMode,
  };

  return (
    <div style={{ width: '100%' }}>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
        {config.label}
        {config.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
      </label>

      {config.subtitle && (
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', marginTop: 0 }}>{config.subtitle}</p>
      )}

      {renderSelectedAbove()}

      {config.remoteOptions?.url ? (
        <AsyncPaginate
          {...selectProps}
          loadOptions={loadOptions}
          debounceTimeout={debounceMs}
          additional={{ page: 1 }}
          cacheUniqs={[config.remoteOptions.url, JSON.stringify(paramValues)]}
          defaultOptions={config.remoteOptions.preloadAll || minChars === 0 || (paramValues['searchText']?.length ?? 0) >= minChars}
        />
      ) : (
        <Select
          {...selectProps}
          options={config.options || []}
          filterOption={filterStaticOptions}
        />
      )}

      {renderSelectedBelow()}

      {config.minSelections && isMulti && (
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
          Minimum {config.minSelections} selection(s) required
        </p>
      )}
      {config.maxSelections && isMulti && (
        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
          Maximum {config.maxSelections} selection(s) allowed
        </p>
      )}

    </div>
  );
}
