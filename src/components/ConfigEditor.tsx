import { useState } from 'react';
import type { UberSelectFieldConfig, QueryParameter, ResponseMapping } from '../types';

interface ConfigEditorProps {
  onApply: (config: UberSelectFieldConfig, paramValues: Record<string, string>) => void;
}

export default function ConfigEditor({ onApply }: ConfigEditorProps) {
  const [url, setUrl] = useState('https://yenta.team1realbrokerage.com/api/v1/public/agents-public-info');
  const [minChars, setMinChars] = useState(0);
  const [preloadAll, setPreloadAll] = useState(true);
  const [selectionMode, setSelectionMode] = useState<'SINGLE' | 'MULTI'>('SINGLE');

  // Query parameter definitions (metadata)
  const [queryParams, setQueryParams] = useState<QueryParameter[]>([
    { name: 'administrativeAreaId', required: true },
    { name: 'pageNumber', required: true },
    { name: 'pageSize', required: true },
    { name: 'name', required: false },
  ]);

  // User-entered values for each parameter
  const [paramValues, setParamValues] = useState<Record<string, string>>({
    administrativeAreaId: 'US-CA',
    pageNumber: '1',
    pageSize: '20',
    name: '',
  });

  const [useResponseMapping, setUseResponseMapping] = useState(true);
  const [responseMapping, setResponseMapping] = useState<ResponseMapping>({
    optionsPath: 'agentPublicInfos',
    labelPath: 'firstName',
    valuePath: 'id',
    subLabelPath: 'emailAddress',
    imagePath: 'avatar',
  });

  const addQueryParam = () => {
    setQueryParams([...queryParams, { name: '', required: false }]);
  };

  const removeQueryParam = (index: number) => {
    const param = queryParams[index];
    setQueryParams(queryParams.filter((_, i) => i !== index));
    // Also remove the value
    const newValues = { ...paramValues };
    delete newValues[param.name];
    setParamValues(newValues);
  };

  const updateQueryParam = (index: number, field: keyof QueryParameter, value: string | boolean) => {
    const updated = [...queryParams];
    const oldName = updated[index].name;
    updated[index] = { ...updated[index], [field]: value };
    setQueryParams(updated);

    // If name changed, update paramValues key
    if (field === 'name' && typeof value === 'string') {
      const newValues = { ...paramValues };
      if (oldName && oldName !== value) {
        newValues[value] = newValues[oldName] || '';
        delete newValues[oldName];
      } else if (!oldName) {
        newValues[value] = '';
      }
      setParamValues(newValues);
    }
  };

  const updateParamValue = (name: string, value: string) => {
    setParamValues({ ...paramValues, [name]: value });
  };

  const handleApply = () => {
    // Validate required params
    for (const param of queryParams) {
      if (param.required && !paramValues[param.name]) {
        alert(`Parameter "${param.name}" is required`);
        return;
      }
    }

    const config: UberSelectFieldConfig = {
      label: 'Dynamic Config Test',
      selectionMode,
      placeholder: 'Search...',
      remoteOptions: {
        url,
        preloadAll,
        queryParameters: queryParams.filter(p => p.name),
        responseMapping: useResponseMapping ? responseMapping : undefined,
      },
      autoCompleteEnabled: true,
      autoComplete: {
        minChars,
        debounceMillis: 300,
      },
      showClearButton: true,
    };
    onApply(config, paramValues);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 500,
    color: '#6b7280',
    marginBottom: '4px',
  };

  const sectionStyle: React.CSSProperties = {
    backgroundColor: '#f9fafb',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '16px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '12px',
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* API Endpoint */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>API Endpoint</div>
        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={labelStyle}>Selection Mode</label>
            <select
              value={selectionMode}
              onChange={(e) => setSelectionMode(e.target.value as 'SINGLE' | 'MULTI')}
              style={inputStyle}
            >
              <option value="SINGLE">Single</option>
              <option value="MULTI">Multi</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Min Chars</label>
            <input
              type="number"
              value={minChars}
              onChange={(e) => setMinChars(parseInt(e.target.value) || 0)}
              style={inputStyle}
            />
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={preloadAll}
            onChange={(e) => setPreloadAll(e.target.checked)}
          />
          <span style={{ fontSize: '14px', color: '#4b5563' }}>Preload all options</span>
        </label>
      </div>

      {/* Query Parameters */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={sectionTitleStyle}>Query Parameters</div>
          <button
            type="button"
            onClick={addQueryParam}
            style={{ fontSize: '13px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            + Add Parameter
          </button>
        </div>

        {queryParams.map((param, index) => (
          <div key={index} style={{ backgroundColor: 'white', padding: '12px', borderRadius: '6px', marginBottom: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={param.required || false}
                  onChange={(e) => updateQueryParam(index, 'required', e.target.checked)}
                />
                <span style={{ fontSize: '12px', color: '#6b7280' }}>Required</span>
              </label>
              <button
                type="button"
                onClick={() => removeQueryParam(index)}
                style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Remove
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={labelStyle}>
                  Name
                </label>
                <input
                  type="text"
                  value={param.name}
                  onChange={(e) => updateQueryParam(index, 'name', e.target.value)}
                  placeholder="Parameter name"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Value {param.required && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                <input
                  type="text"
                  value={paramValues[param.name] || ''}
                  onChange={(e) => updateParamValue(param.name, e.target.value)}
                  placeholder="Enter value"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Response Mapping */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Response Mapping</div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '12px' }}>
          <input
            type="checkbox"
            checked={useResponseMapping}
            onChange={(e) => setUseResponseMapping(e.target.checked)}
          />
          <span style={{ fontSize: '14px', color: '#4b5563' }}>Enable custom response mapping</span>
        </label>

        {useResponseMapping && (
          <div>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Options Path</label>
              <input
                type="text"
                value={responseMapping.optionsPath}
                onChange={(e) => setResponseMapping({ ...responseMapping, optionsPath: e.target.value })}
                placeholder="e.g. data.items"
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={labelStyle}>Label Path</label>
                <input
                  type="text"
                  value={responseMapping.labelPath}
                  onChange={(e) => setResponseMapping({ ...responseMapping, labelPath: e.target.value })}
                  placeholder="e.g. name"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Value Path</label>
                <input
                  type="text"
                  value={responseMapping.valuePath}
                  onChange={(e) => setResponseMapping({ ...responseMapping, valuePath: e.target.value })}
                  placeholder="e.g. id"
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Sub-label Path</label>
                <input
                  type="text"
                  value={responseMapping.subLabelPath || ''}
                  onChange={(e) => setResponseMapping({ ...responseMapping, subLabelPath: e.target.value })}
                  placeholder="e.g. email"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Image Path</label>
                <input
                  type="text"
                  value={responseMapping.imagePath || ''}
                  onChange={(e) => setResponseMapping({ ...responseMapping, imagePath: e.target.value })}
                  placeholder="e.g. avatar"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Apply Button */}
      <button
        type="button"
        onClick={handleApply}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Apply Config
      </button>
    </div>
  );
}
