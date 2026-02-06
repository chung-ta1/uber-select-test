import { useState, useCallback, useEffect } from 'react';
import Select from 'react-select';
import type { MultiValue, SingleValue, StylesConfig } from 'react-select';
import { AsyncPaginate } from 'react-select-async-paginate';
import type { UberSelectFieldConfig, StringOption, ResultMapping } from '../types';

interface UberSelectProps {
  config: UberSelectFieldConfig;
  paramValues: Record<string, string>;
  onParamChange?: (paramValues: Record<string, string>) => void;
  onLoadOptions?: () => void;
  token?: string;
  value?: StringOption | StringOption[] | null;
  onChange?: (value: StringOption | StringOption[] | null) => void;
  onManualEntryChange?: (entries: Record<string, unknown>[] | null) => void;
  initialAnswer?: Array<Record<string, unknown>>;
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
  const normalizedPath = path.startsWith('$.') ? path.slice(2) : path.startsWith('$') ? path.slice(1) : path;
  if (!normalizedPath) return obj;

  const tokens = normalizedPath.match(/[^.[\]]+|\[\d+]/g);
  if (!tokens) return undefined;

  return tokens.reduce((acc: unknown, token) => {
    if (acc == null) return undefined;
    const indexMatch = token.match(/^\[(\d+)]$/);
    if (indexMatch) {
      return Array.isArray(acc) ? acc[parseInt(indexMatch[1])] : undefined;
    }
    if (typeof acc === 'object') {
      return (acc as Record<string, unknown>)[token];
    }
    return undefined;
  }, obj);
};

const isExpression = (value: string): boolean => value.includes('${');

const evaluateExpression = (expr: string, data: Record<string, unknown>): string => {
  return expr.replace(/\$\{(\$[^}]+)\}/g, (_match, jsonPath: string) => {
    const value = resolveJsonPath(data, jsonPath);
    return value != null ? String(value) : '';
  });
};

const resolveValue = (value: unknown, data: Record<string, unknown>): unknown => {
  if (typeof value !== 'string') return undefined;
  if (isExpression(value)) {
    return evaluateExpression(value, data);
  }
  return resolveJsonPath(data, value);
};

const mapResponseWithResultMapping = (
  data: Record<string, unknown>,
  optionsPath: string,
  resultMapping: ResultMapping,
  answerMapping?: Record<string, string>,
): { options: StringOption[], hasMore: boolean } => {
  const rawOptions = resolveJsonPath(data, optionsPath) as Record<string, unknown>[] || [];

  const options: StringOption[] = rawOptions.map((item) => {
    const label = resultMapping.labelExpression
      ? String(resolveValue(resultMapping.labelExpression, item) ?? '')
      : '';

    const imageUrl = resultMapping.imageUrlJsonPath
      ? String(resolveJsonPath(item, resultMapping.imageUrlJsonPath) ?? '')
      : undefined;

    const mapped: Record<string, unknown> = {};

    if (answerMapping) {
      Object.entries(answerMapping).forEach(([key, path]) => {
        const resolved = resolveValue(path, item);
        if (resolved != null) mapped[key] = resolved;
      });
    }

    return {
      label,
      value: label,
      image: imageUrl || undefined,
      mappedData: mapped,
    };
  });

  return { options, hasMore: options.length > 0 };
};

export default function UberSelect({ config, paramValues, onParamChange, onLoadOptions, token, value, onChange, onManualEntryChange, initialAnswer }: UberSelectProps) {
  const [inputValue, setInputValue] = useState('');
  const [manualEntries, setManualEntries] = useState<Record<string, string>[]>(() => {
    return config.manualEntryConfig ? [{}] : [];
  });
  const [initialized, setInitialized] = useState(false);

  const isMulti = config.maxSelections !== 1;

  const searchSelectionCount = Array.isArray(value) ? value.length : value ? 1 : 0;
  const filledManualCount = config.manualEntryConfig?.subformConfig
    ? manualEntries.filter((entry) => config.manualEntryConfig!.subformConfig!.fields.some((f) => entry[f.alias]?.trim())).length
    : 0;
  const totalSelections = searchSelectionCount + filledManualCount;

  useEffect(() => {
    if (initialized || !initialAnswer || initialAnswer.length === 0) return;
    setInitialized(true);

    const subform = config.manualEntryConfig?.subformConfig;
    const aliases = subform ? subform.fields.map((f) => f.alias) : [];

    const isManualEntry = (entry: Record<string, unknown>): boolean => {
      return aliases.length > 0 && aliases.every((alias) => alias in entry);
    };

    const searchEntries: StringOption[] = [];
    const restoredEntries: Record<string, string>[] = [];

    for (const entry of initialAnswer) {
      if (isManualEntry(entry)) {
        const restored: Record<string, string> = {};
        for (const alias of aliases) {
          restored[alias] = entry[alias] != null ? String(entry[alias]) : '';
        }
        restoredEntries.push(restored);
      } else {
        const label = entry.label ? String(entry.label) : '';
        searchEntries.push({
          label,
          value: label,
          image: entry.imageUrl ? String(entry.imageUrl) : undefined,
          mappedData: entry,
        });
      }
    }

    if (searchEntries.length > 0) {
      onChange?.(isMulti ? searchEntries : searchEntries[0]);
    }

    if (restoredEntries.length > 0) {
      setManualEntries(restoredEntries);
    }
  }, [initialAnswer, initialized, config.manualEntryConfig, isMulti, onChange]);

  const debounceMs = config.searchConfig?.debounceDelayMs ?? 250;
  const minChars = config.searchConfig?.minInputLength ?? 3;
  const noMatchesMessage = config.dropdownDisplay?.noResultsMessage ?? 'No results found';

  const loadOptions = useCallback(
    async (search: string, _loadedOptions: unknown, additional?: { page: number }) => {
      if (!config.remoteOptions?.url) {
        return { options: [], hasMore: false };
      }

      const effectiveSearch = paramValues['searchText'] || search;

      if (effectiveSearch.length < minChars && !config.remoteOptions.preloadAll) {
        return { options: [], hasMore: false };
      }

      try {
        const page = additional?.page ?? 1;
        const remote = config.remoteOptions;
        const url = new URL(remote.url);

        remote.queryParameters?.forEach((param) => {
          const value = paramValues[param.name];
          if (value) {
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

        const optionsPath = remote.resultsJsonPath || 'results';
        const mapped = mapResponseWithResultMapping(
          data,
          optionsPath,
          config.resultMapping || {},
          config.answerMapping,
        );

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
    [config.remoteOptions, config.resultMapping, config.answerMapping, minChars, paramValues, token]
  );

  const filterStaticOptions = useCallback(
    (option: { data: StringOption }, inputValue: string) => {
      if (!inputValue) return true;
      const searchTerm = inputValue.toLowerCase();
      const label = option.data.label.toLowerCase();
      return label.includes(searchTerm);
    },
    []
  );

  const handleChange = (
    newValue: MultiValue<StringOption> | SingleValue<StringOption>
  ) => {
    if (isMulti) {
      const values = newValue as MultiValue<StringOption>;
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

  useEffect(() => {
    if (!config.manualEntryConfig || !onManualEntryChange) return;

    const subform = config.manualEntryConfig.subformConfig;
    if (!subform) return;

    const resolvedEntries: Record<string, unknown>[] = [];

    for (const entry of manualEntries) {
      const hasAnyValue = subform.fields.some((f) => entry[f.alias]?.trim());
      if (!hasAnyValue) continue;

      const formData: Record<string, unknown> = {};
      subform.fields.forEach((field) => {
        formData[field.alias] = entry[field.alias] || '';
      });

      const data: Record<string, unknown> = { ...formData };
      if (subform.labelExpression) {
        const label = resolveValue(subform.labelExpression, formData);
        if (label != null) {
          data.label = label;
        }
      }

      resolvedEntries.push(data);
    }

    onManualEntryChange(resolvedEntries.length > 0 ? resolvedEntries : null);
  }, [manualEntries, config.manualEntryConfig, onManualEntryChange]);

  const renderSelectedAbove = () => {
    if (config.selectionsDisplay?.position !== 'ABOVE' || !isMulti) return null;
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
                x
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderSelectedBelow = () => {
    if (config.selectionsDisplay?.position !== 'BELOW' || !isMulti) return null;
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
                x
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
    controlShouldRenderValue: !isMulti || !config.selectionsDisplay?.position,
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

      {/* Search dropdown */}
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

      {/* Query Parameters */}
      {onParamChange && config.remoteOptions?.queryParameters && (
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          {config.remoteOptions.queryParameters.map((param) => (
            <div key={param.name} style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#6b7280', marginBottom: '4px' }}>
                {param.name} {param.required && <span style={{ color: '#ef4444' }}>*</span>}
              </label>
              <input
                type="text"
                value={paramValues[param.name] || ''}
                onChange={(e) => onParamChange({ ...paramValues, [param.name]: e.target.value })}
                placeholder={`Enter ${param.name}`}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={onLoadOptions}
            style={{
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Load Options
          </button>
        </div>
      )}

      {/* Manual entry section */}
      {config.manualEntryConfig?.subformConfig != null && (
        <>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '16px 0',
            color: '#9ca3af',
            fontSize: '13px',
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            <span>{config.manualEntryConfig?.triggerText || 'or enter manually'}</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {manualEntries.map((entry, entryIndex) => (
                <div key={entryIndex} style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '16px', backgroundColor: 'white', position: 'relative' }}>
                  {manualEntries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setManualEntries((prev) => prev.filter((_, i) => i !== entryIndex))}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'none',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        fontSize: '18px',
                        lineHeight: 1,
                        padding: '4px',
                      }}
                      title="Remove entry"
                    >
                      x
                    </button>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {config.manualEntryConfig!.subformConfig!.fields.map((field) => (
                      <div key={field.alias}>
                        <label style={{ display: 'block', fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                          {field.label}
                          {field.required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
                        </label>
                        <input
                          type={field.type === 'EMAIL' ? 'email' : 'text'}
                          value={entry[field.alias] || ''}
                          onChange={(e) =>
                            setManualEntries((prev) =>
                              prev.map((ent, i) =>
                                i === entryIndex ? { ...ent, [field.alias]: e.target.value } : ent
                              )
                            )
                          }
                          placeholder={field.placeholder || ''}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {(!config.maxSelections || totalSelections < config.maxSelections) && (
                <button
                  type="button"
                  onClick={() => setManualEntries((prev) => [...prev, {}])}
                  style={{
                    padding: '10px',
                    backgroundColor: 'white',
                    color: '#2563eb',
                    border: '1px dashed #93c5fd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  + Add another entry
                </button>
              )}

            </div>
          </div>
        </>
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
