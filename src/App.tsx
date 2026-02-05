import { useState } from 'react';
import UberSelect from './components/UberSelect';
import type { UberSelectFieldConfig, StringOption, SelectionsDisplayMode, AutoCompleteConfig, AutoCompleteMatchMode, ManualEntryConfig } from './types';

const DEFAULT_TOKEN = 'd3aae14db6170a270c8ca080163bc1e88b0ff9dd904f9032eab12e2445c2e87b754c807d7fc92723d52a5ffa95c8f7d3bffc1179a331f6d250963d21767678806cc07ceb1b81eac7d38436f136b44d735d48120ab2f0db9730c70cb66ea755006bd4e48d1071b86d4da8b0da5a792c4f8b92a6096f4b9963f0876ef58fc365535f619696d431f01885805f48d71977adeb2b9a948200eb7ce1d964354290f3f7dad311e6dc672358cd7a12ae70bc7dc04e1190615777e041bd6dbfa9e147ceeda482f9e6c22a32090ee41d534afc71192e23dc864646712c6cd748df0f16bfa36940fbdb5debde3d853c395f4bb99e1776382a03f0ef51c0d4623bc736477c4ffef66798b01cc5ed0739eb36c0452b3c446f992cd0a7ac3ed9ed98e0ba8c89300e2ef46386c47a6fc2df47e229f78ddfebe4bd9bdf7b68b54026f30f71cc2512fc41a0168aff57fb9cf0f43e0d7f451b97638d61aa273d8f90836e966c0d88c7fb2b7bdee385cd0c93e0385ac3e7c59db029750e66c63811009ec0ca3d6b24bb6fe2b284d6b353fa56a0e13c24ab1d77dfebc8e39e7d2b4e845229fe9c9dc47842f5d739a208edf5a90e58b596851d56018f2e6f753827661e0ab3a87b51a73ff26a2d2310a6fb60291f9f171a90593f92f0416ca34537b10fad291d1f0cd5c69da7e2326574cb28124b0788e313b688d7006dc650576397a2a958483b624db09ac449f8b2a7c39202c46bbbb32feb041eb4ebfe76a7134962f1ccd830b6af10baf3ff702938b7c3b089adb48851832a959d8f7266a0fbb7e108aab23b308397d5f62be1c2c59ed85792d77ccd365ad3675e23493963aba355ceeae7ef18eb6fe38a3aecae6eae7e236321866f7f2b0767d6646a521a712bfec2511a276005a72c437952b6861dc46234df00c92a78418d306a86a8e52f475c7bb602ca65c1e2945d867a55a742aa28cd790ce7b40aa3a61008b0ae9c1aa2bb424d828ee894f47650601eb45847497ab12661cc6485158a28b1a1735c058cd82fd8100fb578af5fe69e5d8c1002074d835c2b57cf829f002af5dd9196770a0faeac81437c83a4eafa2c7209858633131edff8baaa71631c24f359f3f749828de34dc893c510492583da6e080b944af53d6512c03371d1ea200068935e3ce5454f89d459c787a6f34a2bbb77cff97ca6e410a9b2bc2848a4e082b08a61eaeb1e19c4135c70b2286a8b0e6e9413e464c4f003cee83c0236f0d8583236b8fb72a7b4c394c49e1dc15ac501dffb4e9c5efe9592bf108826b1552c586fcc11469338f83c8ee0bbc760d49edd0600fff648a7e1b5c27d6deba81dda0855b3ea78c354438899967c74cb81ae51d586eff0e8e427083fdb0e2e82306456226ebae0dc064c6d51836f2d297729ecc23fe8785e2383a2ba74865082aadf73fe44ed521714b32645cfa156dd057cd3b8f211494444a52d59e2505b8bd6a98df2bedd5409d4b8c6bf016014857a6fc4e0b09790c263196ae245deafbb588d58e9b72f4f7a8e8233312f3b8846ed6f5e9ddd20acbd341ae125847e0758a78b0c728eb0c728acd45f217b0577740c9c0f52ae8b582d721dcd8e556b8a0908b8e6072b0e3a7fadbd5797aa022d780dcde29b0ee15a85e2a7f64d6329234ae72c8c7cc772f13d5a724543f5874a38460beac6f72339e8992417634b475f10e3c00b595acb3e5d73935561a4a19ea2ef02fe7273f257e0dc7cd525a8ad37c4bf3bed1557b58f86ebae203c6a82b5d1fa77cbe571850e530d1981b4396d7d81474533cd753afead4c79b7af9b493d31cf01e8e3a4906d8220bacc70a423d95eec813b942e462b031bc21d5f6b5e883cb513a518897a78c68e539a778483c0a5edd3ceabff94f78019ac3f5ca509bbecc16220c09e1c99b6c459f871e23df8271e23dc3d4e3b75b7abef7478bd3ed0932e0807eac75deb85a0058b4787224255a1074330f5963a387a45e21c373a048c';

const DEFAULT_REMOTE_TOKEN = '6a2ec3f11633d560c0df74a816ce462f4f34b100c198f42f4e05ce19a8bef28d8fad55372556f36e965d51c73a0df52dd30ceb8794c621e06d5aabf323d3c9b322f5f080cf04b7805cf2bd71f7089fa7375935d932ab003e67f0862a1de7dc285204c51980931bc1e81e3d87508465686f22d22794b9964d4769d7f541e00959aca07cd710ba07e2795b366852cfda1e3c3012511379abb23d340c7729d282588e6c44b5aa21d3e823e967188d65879c9335e5c32fc920e6fa788c08301bfff13a1fb64e5da43ce98742ce5f8ce20a3b14c07626f95fbe426f10396a82ff00b667f5e2a6b2c565686a6fbe166fb83f9b9ca484f0050232d12b5e31817485a9a18c00f2fc66d66fbe3a31c9842522d69714ac4a39f1e934bf970fad2812b4209f2aeafcefce270db90c250693d0e721b63430ca3b01ccc27d62b62872d25858532d1ff0a52dfc1b80f25022070560e74ea95ac3f3269bf84b6820e98c650c2dc87f7d976a351bba2febeec5be88110dce2cd40025ecac516241c8b1230e73c199a0e74919c957b0d3e187f245441eaa6c012df152c751b1d6cbbd894c13d926b0bda46fdd2b5af4e1d059012dab04090d09d6468c4c9d86cbe79d00906ed791de4743ee38d276dc2328044cbad12c75920cd50ca557a5b488f20fb532c7133e83a1da2ad6b40a4090dfed07785ae04802598bcf36f73431c387429b944d84e9bdfd28f6b916f8d7a591094a267829b92dea891fd6ecc61854a52e8d6ea3f383b1f391b168fb0e9278eae4e0cdf2f1d2ca0cf609ee5d71ba880e1acc3e4ba603f2db4c8dba530703aaf34b02857ac9f29201a9962e2a74257f6a11eaeef9037212296bb7f57c5b01d432d21a13f574d218b4ddcb45cb51543bc548e807959e6181a4e4b270b03ffd3db8111d08fb2e2b2d3a2c06d5f8508999e14f93b65cab18a9a909f67df0b7f4201fcd2b992bd97e21f37dfe8f35f260edb37c76bf3eb9159ddfaec4bb93b2d317042667aa3d14ce9e21208b3a59c226befb8dcc2a06aa449cf30af49f4d98b4911238ec9be5ed7314538991a9d87ad637a9c97ea2c6a413152a49f0f2b921ec183ba36c13c63adf4d1ba3dbd85eb79d722554190bef84d8a85553514e20469d30aadf42dbe9fbd52dc05fcc0f2e61abf109315d3dc55ce849ddb0d9d60ed3a24ffe29d223f67b438ea564cc5cea6da7f1b401b99e36d615e21a96d47f03161cd3b58cb1634856241fbfa1e252fed83eb8df1c6c9a2148ddac02c0011db848794e6cf4dfd4a6851ce601439d754f5f56108aeb69220d409b69fe0fc8f54eb50f6c2c73e69dc105fa5f6a5623cc9eff4f121e173dbe3ec5c0ce5a4c7fe128732a9d0cc4d4d24c15e898c4587be95abfd381f47c92a3f2fdeb44b67d316c1727c65de8af70ff9ec7fabb2915636a9d2f818e119859cae659511eceb545db12c63a489c739cdabf94989e3973b420bd3ce148de97094fc909e06438beea43ecabce76163cd20d36a6fab84aeef6284012d35ebd7d860a3f441e6f19887b44b349d2fd2a982e21ce6b61a386f70957faba6aa24563c2000d99db2be50b95905047df631bc645f72bdbcd2b0bbaf8769b7a7c8225771dfad32daf185291480c6951b0b78aab71688b5b6ad40b04afd2396ca37b95a60b784bc336821577def3a429e6629906987a7420a736afb560e4d2e690c72ca19b74392bb81a0f91e039505af12d28d6fd893265f41e97322ed9298479d59df5f4fef561472af91c1f403b135ec52d699eb5d19a849baf54b5a0395c962278530edc6012f675773d20ffa5624064febe2c03efec77e438dac062dcbe060f3412fb8c8777025777fc7b7c86aafa92985d7cb84aba7f1aa7817d461f9e62c5052ab40e80f59598db90c7e246e4c6d071b7902abd9a3e256a1da5d880bef775401bbdb987aad680ce4dd5feec54c707f1e7b13ec4a79a3833f811c1e49a4ff422309365e91d951a';

interface ContentMessage {
  contentType: string;
  title?: string;
  subtitle?: string;
  fields?: Field[];
  cta?: Field;
}

interface ContentItem {
  id: string;
  name: string;
  position: number;
  description?: string;
  status: string;
  alias?: string;
  data?: {
    _class: string;
    message: ContentMessage;
  };
  content?: ContentMessage;
}

interface BinaryOption {
  label: string;
  value: boolean;
}

interface FieldCondition {
  answerType: string;
  fieldId: string;
  fieldAnswer: unknown;
}

interface Field {
  _fieldClass: string;
  id: string;
  type: string;
  label: string;
  required?: boolean;
  selectionMode?: 'SINGLE' | 'MULTI';
  placeholder?: string;
  subtitle?: string;
  remoteOptions?: {
    url: string;
    preloadAll?: boolean;
    queryParameters?: { name: string; required?: boolean }[];
    resultsPath?: string;
    fields?: Record<string, string>;
  };
  manualEntry?: ManualEntryConfig | ManualEntryConfig[];
  options?: { label: string; value: string | boolean }[];
  trueOption?: BinaryOption;
  falseOption?: BinaryOption;
  minSelections?: number;
  maxSelections?: number;
  autoComplete?: {
    enabled?: boolean;
    minChars?: number;
    debounceMillis?: number;
    noMatchesMessage?: string;
    localMatchMode?: AutoCompleteMatchMode;
    caseSensitive?: boolean;
  };
  showClearButton?: boolean;
  selectionsDisplayMode?: 'ABOVE' | 'WITHIN' | 'BELOW';
  selectionsHeader?: string;
  answer?: unknown;
  condition?: FieldCondition;
  alias?: string;
}

export default function App() {
  const [baseUrl, setBaseUrl] = useState('http://localhost:8085');
  const [applicationId, setApplicationId] = useState('03d6909c-1bf7-46cf-b9b0-70131354fef5');
  const [token, setToken] = useState(DEFAULT_TOKEN);
  const [remoteToken, setRemoteToken] = useState(DEFAULT_REMOTE_TOKEN);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);
  const [contentItem, setContentItem] = useState<ContentItem | null>(null);
  const [allFields, setAllFields] = useState<Field[]>([]);
  const [fieldAnswers, setFieldAnswers] = useState<Record<string, unknown>>({});
  const [uberSelectConfig, setUberSelectConfig] = useState<UberSelectFieldConfig | null>(null);
  const [uberSelectValue, setUberSelectValue] = useState<StringOption | StringOption[] | null>(null);
  const [uberSelectFieldId, setUberSelectFieldId] = useState<string | null>(null);
  const [buttonFieldId, setButtonFieldId] = useState<string | null>(null);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [showParamEditor, setShowParamEditor] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [showConfigEditor, setShowConfigEditor] = useState(false);
  const [staticOptionsText, setStaticOptionsText] = useState('');
  const [pendingManualEntries, setPendingManualEntries] = useState<Record<string, unknown>[] | null>(null);
  const [itemHistory, setItemHistory] = useState<string[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [storedAnswer, setStoredAnswer] = useState<Array<Record<string, unknown>> | undefined>(undefined);

  const processContentItem = (data: ContentItem) => {
    setContentItem(data);

    const message = getContentMessage(data);
    const fields = message?.fields?.filter(f => f._fieldClass !== 'ButtonField') || [];
    setAllFields(fields);

    const initialAnswers: Record<string, unknown> = {};
    for (const field of fields) {
      if (field.answer != null) {
        initialAnswers[field.id] = field.answer;
      }
    }
    setFieldAnswers(initialAnswers);

    const uberSelectField = fields.find(f => f._fieldClass === 'SearchableSelectField');
    if (uberSelectField) {
      const config = convertToUberSelectConfig(uberSelectField);
      setUberSelectConfig(config);
      setUberSelectFieldId(uberSelectField.id);
      setStoredAnswer(uberSelectField.answer as Array<Record<string, unknown>> | undefined);

      const initialParams: Record<string, string> = {};
      uberSelectField.remoteOptions?.queryParameters?.forEach(param => {
        initialParams[param.name] = '';
      });
      setParamValues(initialParams);
      setShowParamEditor(true);
    } else {
      setUberSelectConfig(null);
      setShowParamEditor(false);
      setStoredAnswer(undefined);
    }

    const buttonField = message?.fields?.find(f => f._fieldClass === 'ButtonField');
    if (buttonField) {
      setButtonFieldId(buttonField.id);
    }
  };

  const resetState = () => {
    setError(null);
    setSubmitResult(null);
    setContentItem(null);
    setAllFields([]);
    setFieldAnswers({});
    setUberSelectConfig(null);
    setUberSelectValue(null);
    setUberSelectFieldId(null);
    setButtonFieldId(null);
    setPendingManualEntries(null);
    setStoredAnswer(undefined);
  };

  const fetchNextItem = async () => {
    setLoading(true);
    resetState();

    try {
      const response = await fetch(`${baseUrl}/api/v1/checklists/${applicationId}/next-item`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 204) {
        setError('No more items (204 No Content)');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ContentItem = await response.json();
      processContentItem(data);

      setItemHistory(prev => [...prev.slice(0, currentHistoryIndex + 1), data.id]);
      setCurrentHistoryIndex(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnsweredItem = async (itemId: string) => {
    setLoading(true);
    resetState();

    try {
      const response = await fetch(`${baseUrl}/api/v1/applications/questions/${itemId}/answered`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ContentItem = await response.json();
      processContentItem(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const goToPreviousItem = () => {
    if (currentHistoryIndex <= 0) return;
    const prevIndex = currentHistoryIndex - 1;
    setCurrentHistoryIndex(prevIndex);
    setReloadKey(k => k + 1);
    fetchAnsweredItem(itemHistory[prevIndex]);
  };

  const goToNextItemInHistory = () => {
    if (currentHistoryIndex >= itemHistory.length - 1) return;
    const nextIndex = currentHistoryIndex + 1;
    setCurrentHistoryIndex(nextIndex);
    setReloadKey(k => k + 1);
    fetchAnsweredItem(itemHistory[nextIndex]);
  };

  const getContentMessage = (item: ContentItem): ContentMessage | undefined => {
    return item.content || item.data?.message;
  };

  const convertToUberSelectConfig = (field: Field): UberSelectFieldConfig => {
    const manualEntry = field.manualEntry
      ? Array.isArray(field.manualEntry) ? field.manualEntry : [field.manualEntry]
      : undefined;

    return {
      label: field.label,
      required: field.required,
      selectionMode: field.selectionMode,
      placeholder: field.placeholder,
      subtitle: field.subtitle,
      remoteOptions: field.remoteOptions ? {
        url: field.remoteOptions.url,
        preloadAll: field.remoteOptions.preloadAll,
        queryParameters: field.remoteOptions.queryParameters,
        resultsPath: field.remoteOptions.resultsPath,
        fields: field.remoteOptions.fields,
      } : undefined,
      manualEntry,
      options: field.options as StringOption[],
      minSelections: field.minSelections,
      maxSelections: field.maxSelections,
      autoComplete: {
        ...field.autoComplete,
        enabled: field.autoComplete?.enabled !== false,
      },
      showClearButton: field.showClearButton || false,
      selectionsDisplayMode: field.selectionsDisplayMode,
      selectionsHeader: field.selectionsHeader,
    };
  };

  const isFieldVisible = (field: Field): boolean => {
    if (!field.condition || !field.condition.fieldId) return true;
    const parentAnswer = fieldAnswers[field.condition.fieldId];
    if (parentAnswer == null) return false;
    if (field.condition.answerType === 'BOOLEAN') {
      const parsed = String(parentAnswer).toLowerCase() === 'true';
      return parsed === field.condition.fieldAnswer;
    }
    return String(parentAnswer) === String(field.condition.fieldAnswer);
  };

  const updateConfig = (updates: Partial<UberSelectFieldConfig>) => {
    if (uberSelectConfig) {
      setUberSelectConfig({ ...uberSelectConfig, ...updates });
    }
  };

  const updateAutoComplete = (updates: Partial<AutoCompleteConfig>) => {
    if (uberSelectConfig) {
      setUberSelectConfig({
        ...uberSelectConfig,
        autoComplete: { ...uberSelectConfig.autoComplete, ...updates },
      });
    }
  };

  const parseStaticOptions = (text: string): StringOption[] => {
    return text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const parts = line.split('|');
        return {
          value: parts[0].trim(),
          label: parts[1]?.trim() || parts[0].trim(),
        };
      });
  };

  const applyStaticOptions = () => {
    const options = parseStaticOptions(staticOptionsText);
    updateConfig({ options });
  };

  const submitAnswer = async () => {
    if (!contentItem) {
      setSubmitResult({ success: false, message: 'No content item' });
      return;
    }

    setSubmitting(true);
    setSubmitResult(null);

    const answers: Array<{ answerType: string; fieldId: string; answer: unknown }> = [];

    for (const field of allFields) {
      if (!isFieldVisible(field)) continue;

      if (field._fieldClass === 'BinaryField' || field.type === 'BINARY') {
        const binaryAnswer = fieldAnswers[field.id];
        if (binaryAnswer != null) {
          answers.push({
            answerType: 'BOOLEAN',
            fieldId: field.id,
            answer: String(binaryAnswer).toLowerCase() === 'true',
          });
        }
      }

      if (field._fieldClass === 'SearchableSelectField' && uberSelectFieldId) {
        const values = Array.isArray(uberSelectValue) ? uberSelectValue : uberSelectValue ? [uberSelectValue] : [];
        const selectedOptions: Array<Record<string, unknown>> = values.map(opt => {
          if (opt.mappedData) return opt.mappedData;
          return {
            label: opt.label,
            value: opt.value,
            ...(opt.image ? { imageUrl: opt.image } : {}),
          };
        });
        if (pendingManualEntries) {
          selectedOptions.push(...pendingManualEntries);
        }
        if (selectedOptions.length > 0) {
          answers.push({
            answerType: 'LIST',
            fieldId: uberSelectFieldId,
            answer: selectedOptions,
          });
        }
      }
    }

    if (buttonFieldId) {
      answers.push({
        answerType: 'BOOLEAN',
        fieldId: buttonFieldId,
        answer: true,
      });
    }

    if (answers.length === 0) {
      setSubmitResult({ success: false, message: 'No answers to submit' });
      setSubmitting(false);
      return;
    }

    const requestBody = { answers };

    console.log('Submitting to:', `${baseUrl}/api/v1/applications/questions/${contentItem.id}/answer`);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    try {
      const response = await fetch(`${baseUrl}/api/v1/applications/questions/${contentItem.id}/answer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 204) {
        setSubmitResult({ success: true, message: 'Answer submitted successfully (204 No Content)' });
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}`;
        if (errorText) {
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage += `: ${errorJson.message || errorJson.error || errorJson.detail || JSON.stringify(errorJson)}`;
          } catch {
            errorMessage += `: ${errorText}`;
          }
        }
        setSubmitResult({ success: false, message: errorMessage });
        return;
      }

      setSubmitResult({ success: true, message: 'Answer submitted successfully' });
    } catch (err) {
      setSubmitResult({ success: false, message: err instanceof Error ? err.message : 'Failed to submit' });
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'monospace',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 500,
    color: '#6b7280',
    marginBottom: '4px',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 24px' }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#111827' }}>
          Sherlock Application Viewer
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#6b7280' }}>
          Fetch and render application items with UBER_SELECT support
        </p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px' }}>
          {/* API Configuration */}
          <div>
            <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, color: '#374151' }}>
              API Configuration
            </h2>
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Base URL</label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Checklist ID</label>
                <input
                  type="text"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Sherlock Bearer Token</label>
                <textarea
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  style={{ ...inputStyle, height: '60px', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Remote Options Bearer Token (Yenta)</label>
                <textarea
                  value={remoteToken}
                  onChange={(e) => setRemoteToken(e.target.value)}
                  style={{ ...inputStyle, height: '60px', resize: 'vertical' }}
                />
              </div>

              <button
                onClick={fetchNextItem}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: loading ? '#9ca3af' : '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Fetching...' : 'Fetch Next Item'}
              </button>

              {error && (
                <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#fef2f2', borderRadius: '6px', color: '#dc2626', fontSize: '13px' }}>
                  {error}
                </div>
              )}
            </div>

            {/* Field Configuration Editor */}
            {uberSelectConfig && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#374151' }}>
                    Field Configuration
                  </h2>
                  <button
                    onClick={() => setShowConfigEditor(!showConfigEditor)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: showConfigEditor ? '#ef4444' : '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    {showConfigEditor ? 'Hide' : 'Edit'}
                  </button>
                </div>

                {showConfigEditor && (
                  <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px' }}>
                    {/* Basic Settings */}
                    <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>Basic Settings</div>

                      <div style={{ marginBottom: '12px' }}>
                        <label style={labelStyle}>Label</label>
                        <input
                          type="text"
                          value={uberSelectConfig.label}
                          onChange={(e) => updateConfig({ label: e.target.value })}
                          style={inputStyle}
                        />
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <label style={labelStyle}>Placeholder</label>
                        <input
                          type="text"
                          value={uberSelectConfig.placeholder || ''}
                          onChange={(e) => updateConfig({ placeholder: e.target.value || undefined })}
                          style={inputStyle}
                        />
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <label style={labelStyle}>Subtitle</label>
                        <input
                          type="text"
                          value={uberSelectConfig.subtitle || ''}
                          onChange={(e) => updateConfig({ subtitle: e.target.value || undefined })}
                          style={inputStyle}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151' }}>
                          <input
                            type="checkbox"
                            checked={uberSelectConfig.required || false}
                            onChange={(e) => updateConfig({ required: e.target.checked })}
                          />
                          Required
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151' }}>
                          <input
                            type="checkbox"
                            checked={uberSelectConfig.showClearButton || false}
                            onChange={(e) => updateConfig({ showClearButton: e.target.checked })}
                          />
                          Show Clear Button
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151' }}>
                          <input
                            type="checkbox"
                            checked={uberSelectConfig.autoComplete?.enabled !== false}
                            onChange={(e) => updateAutoComplete({ enabled: e.target.checked })}
                          />
                          Autocomplete Enabled
                        </label>
                      </div>
                    </div>

                    {/* Selection Settings */}
                    <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>Selection Settings</div>

                      <div style={{ marginBottom: '12px' }}>
                        <label style={labelStyle}>Selection Mode</label>
                        <select
                          value={uberSelectConfig.selectionMode || 'MULTI'}
                          onChange={(e) => updateConfig({ selectionMode: e.target.value as 'SINGLE' | 'MULTI' })}
                          style={inputStyle}
                        >
                          <option value="SINGLE">SINGLE</option>
                          <option value="MULTI">MULTI</option>
                        </select>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <label style={labelStyle}>Min Selections</label>
                          <input
                            type="number"
                            min="0"
                            value={uberSelectConfig.minSelections ?? ''}
                            onChange={(e) => updateConfig({ minSelections: e.target.value ? parseInt(e.target.value) : undefined })}
                            style={inputStyle}
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Max Selections</label>
                          <input
                            type="number"
                            min="1"
                            value={uberSelectConfig.maxSelections ?? ''}
                            onChange={(e) => updateConfig({ maxSelections: e.target.value ? parseInt(e.target.value) : undefined })}
                            style={inputStyle}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <label style={labelStyle}>Selections Display Mode</label>
                        <select
                          value={uberSelectConfig.selectionsDisplayMode || 'BELOW'}
                          onChange={(e) => updateConfig({ selectionsDisplayMode: e.target.value as SelectionsDisplayMode })}
                          style={inputStyle}
                        >
                          <option value="ABOVE">ABOVE</option>
                          <option value="WITHIN">WITHIN</option>
                          <option value="BELOW">BELOW</option>
                        </select>
                      </div>

                      <div>
                        <label style={labelStyle}>Selections Header</label>
                        <input
                          type="text"
                          value={uberSelectConfig.selectionsHeader || ''}
                          onChange={(e) => updateConfig({ selectionsHeader: e.target.value || undefined })}
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    {/* Autocomplete Config */}
                    <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>Autocomplete Config</div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <label style={labelStyle}>Min Chars</label>
                          <input
                            type="number"
                            min="0"
                            value={uberSelectConfig.autoComplete?.minChars ?? ''}
                            onChange={(e) => updateAutoComplete({ minChars: e.target.value ? parseInt(e.target.value) : undefined })}
                            style={inputStyle}
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Debounce (ms)</label>
                          <input
                            type="number"
                            min="0"
                            value={uberSelectConfig.autoComplete?.debounceMillis ?? ''}
                            onChange={(e) => updateAutoComplete({ debounceMillis: e.target.value ? parseInt(e.target.value) : undefined })}
                            style={inputStyle}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <label style={labelStyle}>No Matches Message</label>
                        <input
                          type="text"
                          value={uberSelectConfig.autoComplete?.noMatchesMessage || ''}
                          onChange={(e) => updateAutoComplete({ noMatchesMessage: e.target.value || undefined })}
                          style={inputStyle}
                        />
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <label style={labelStyle}>Local Match Mode</label>
                        <select
                          value={uberSelectConfig.autoComplete?.localMatchMode || 'CONTAINS'}
                          onChange={(e) => updateAutoComplete({ localMatchMode: e.target.value as AutoCompleteMatchMode })}
                          style={inputStyle}
                        >
                          <option value="STARTS_WITH">STARTS_WITH</option>
                          <option value="CONTAINS">CONTAINS</option>
                          <option value="FUZZY">FUZZY</option>
                        </select>
                      </div>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151' }}>
                        <input
                          type="checkbox"
                          checked={uberSelectConfig.autoComplete?.caseSensitive || false}
                          onChange={(e) => updateAutoComplete({ caseSensitive: e.target.checked })}
                        />
                        Case Sensitive
                      </label>
                    </div>

                    {/* Static Options */}
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>
                        Static Options
                        <span style={{ fontWeight: 400, color: '#6b7280', marginLeft: '8px' }}>
                          (value|label per line)
                        </span>
                      </div>

                      <textarea
                        value={staticOptionsText}
                        onChange={(e) => setStaticOptionsText(e.target.value)}
                        placeholder="value1|Label 1&#10;value2|Label 2&#10;value3"
                        style={{ ...inputStyle, height: '100px', resize: 'vertical', fontFamily: 'monospace' }}
                      />

                      <button
                        onClick={applyStaticOptions}
                        style={{
                          width: '100%',
                          padding: '8px',
                          marginTop: '8px',
                          backgroundColor: '#8b5cf6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        Apply Static Options
                      </button>

                      {uberSelectConfig.options && uberSelectConfig.options.length > 0 && (
                        <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                          Current: {uberSelectConfig.options.length} option(s)
                        </div>
                      )}
                    </div>

                    {/* Apply Button */}
                    <button
                      onClick={() => {
                        setUberSelectValue(null);
                        setReloadKey(k => k + 1);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px',
                        marginTop: '16px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      Apply Config & Reload
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content Display */}
          <div>
            <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600, color: '#374151' }}>
              Content Item
            </h2>
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
              {contentItem ? (
                <div>
                  {/* Item Header */}
                  <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#111827' }}>
                          {getContentMessage(contentItem)?.title || contentItem.name}
                        </h3>
                        {(getContentMessage(contentItem)?.subtitle || contentItem.description) && (
                          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#6b7280' }}>
                            {getContentMessage(contentItem)?.subtitle || contentItem.description}
                          </p>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ padding: '4px 8px', backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>
                          {getContentMessage(contentItem)?.contentType || contentItem.status}
                        </span>
                        <span style={{ padding: '4px 8px', backgroundColor: '#f3f4f6', color: '#374151', borderRadius: '4px', fontSize: '12px' }}>
                          Position: {contentItem.position}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Render all fields */}
                  {allFields.length > 0 && (
                    <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                      {allFields.map((field) => {
                        if (!isFieldVisible(field)) return null;

                        if (field._fieldClass === 'BinaryField' || field.type === 'BINARY') {
                          const selectedValue = fieldAnswers[field.id];
                          const binaryOptions: BinaryOption[] = [];
                          if (field.trueOption) binaryOptions.push(field.trueOption);
                          if (field.falseOption) binaryOptions.push(field.falseOption);
                          if (binaryOptions.length === 0 && field.options) {
                            field.options.forEach(opt => binaryOptions.push({ label: opt.label, value: Boolean(opt.value) }));
                          }

                          return (
                            <div key={field.id} style={{ marginBottom: '20px' }}>
                              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                                {field.label}
                              </label>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {binaryOptions.map((opt) => {
                                  const isSelected = String(selectedValue) === String(opt.value);
                                  return (
                                    <button
                                      key={String(opt.value)}
                                      type="button"
                                      onClick={() => {
                                        setFieldAnswers(prev => ({ ...prev, [field.id]: String(opt.value) }));
                                        if (!opt.value) {
                                          setUberSelectValue(null);
                                          setPendingManualEntries(null);
                                        }
                                      }}
                                      style={{
                                        padding: '14px 20px',
                                        backgroundColor: 'white',
                                        color: '#374151',
                                        border: isSelected ? '2px solid #3b82f6' : '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '15px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease',
                                      }}
                                    >
                                      {opt.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }

                        if (field._fieldClass === 'SearchableSelectField' && uberSelectConfig) {
                          return (
                            <div key={field.id}>
                              <UberSelect
                                key={reloadKey}
                                config={uberSelectConfig}
                                paramValues={paramValues}
                                onParamChange={showParamEditor ? setParamValues : undefined}
                                onLoadOptions={showParamEditor ? () => {
                                  setUberSelectValue(null);
                                  setReloadKey(k => k + 1);
                                } : undefined}
                                token={remoteToken}
                                value={uberSelectValue}
                                onChange={setUberSelectValue}
                                onManualEntryChange={setPendingManualEntries}
                                initialAnswer={storedAnswer}
                              />
                            </div>
                          );
                        }

                        return null;
                      })}

                      {/* Submit Button */}
                      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                        <button
                          onClick={submitAnswer}
                          disabled={submitting}
                          style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: submitting ? '#9ca3af' : '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: submitting ? 'not-allowed' : 'pointer',
                          }}
                        >
                          {submitting ? 'Submitting...' : 'Submit Answer to Sherlock'}
                        </button>

                        {submitResult && (
                          <div style={{
                            marginTop: '12px',
                            padding: '12px',
                            backgroundColor: submitResult.success ? '#d1fae5' : '#fef2f2',
                            borderRadius: '6px',
                            color: submitResult.success ? '#065f46' : '#dc2626',
                            fontSize: '13px',
                          }}>
                            {submitResult.success ? '+ ' : '- '}{submitResult.message}
                          </div>
                        )}

                        {/* Navigation buttons */}
                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                          <button
                            onClick={goToPreviousItem}
                            disabled={loading || currentHistoryIndex <= 0}
                            style={{
                              flex: 1,
                              padding: '10px',
                              backgroundColor: currentHistoryIndex <= 0 ? '#e5e7eb' : '#6b7280',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: 500,
                              cursor: currentHistoryIndex <= 0 ? 'not-allowed' : 'pointer',
                            }}
                          >
                            Previous
                          </button>
                          <button
                            onClick={currentHistoryIndex < itemHistory.length - 1 ? goToNextItemInHistory : fetchNextItem}
                            disabled={loading}
                            style={{
                              flex: 1,
                              padding: '10px',
                              backgroundColor: loading ? '#9ca3af' : '#2563eb',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: 500,
                              cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                          >
                            {loading ? 'Loading...' : currentHistoryIndex < itemHistory.length - 1 ? 'Next' : 'Next Item'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Non-field content - show item info as read-only */}
                  {allFields.length === 0 && (
                    <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#6b7280', marginBottom: '4px' }}>
                          Item ID
                        </label>
                        <input
                          type="text"
                          value={contentItem.id}
                          readOnly
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontFamily: 'monospace',
                            backgroundColor: '#f3f4f6',
                            color: '#6b7280',
                            cursor: 'not-allowed',
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#6b7280', marginBottom: '4px' }}>
                          Name
                        </label>
                        <input
                          type="text"
                          value={contentItem.name}
                          readOnly
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '14px',
                            backgroundColor: '#f3f4f6',
                            color: '#6b7280',
                            cursor: 'not-allowed',
                          }}
                        />
                      </div>
                      {contentItem.alias && (
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#6b7280', marginBottom: '4px' }}>
                            Alias
                          </label>
                          <input
                            type="text"
                            value={contentItem.alias}
                            readOnly
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontFamily: 'monospace',
                              backgroundColor: '#f3f4f6',
                              color: '#6b7280',
                              cursor: 'not-allowed',
                            }}
                          />
                        </div>
                      )}
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#6b7280', marginBottom: '4px' }}>
                          Status
                        </label>
                        <input
                          type="text"
                          value={contentItem.status}
                          readOnly
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '14px',
                            backgroundColor: '#f3f4f6',
                            color: '#6b7280',
                            cursor: 'not-allowed',
                          }}
                        />
                      </div>
                      {getContentMessage(contentItem)?.cta && (
                        <button
                          style={{
                            padding: '12px 24px',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer',
                          }}
                        >
                          {getContentMessage(contentItem)?.cta?.label}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Debug Display */}
                  {allFields.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280', marginBottom: '8px' }}>
                          FIELD ANSWERS
                        </div>
                        <pre style={{ margin: 0, fontSize: '12px', color: '#374151', overflow: 'auto', maxHeight: '150px' }}>
                          {JSON.stringify({ fieldAnswers, uberSelectValue, pendingManualEntries }, null, 2)}
                        </pre>
                      </div>

                      {uberSelectConfig && (
                        <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280', marginBottom: '8px' }}>
                            UBER_SELECT CONFIG
                          </div>
                          <pre style={{ margin: 0, fontSize: '11px', color: '#374151', overflow: 'auto', maxHeight: '150px' }}>
                            {JSON.stringify(uberSelectConfig, null, 2)}
                          </pre>
                        </div>
                      )}

                      {storedAnswer && (
                        <div style={{ backgroundColor: '#fffbeb', padding: '16px', borderRadius: '8px', gridColumn: '1 / -1' }}>
                          <div style={{ fontSize: '12px', fontWeight: 500, color: '#92400e', marginBottom: '8px' }}>
                            STORED ANSWER (from API)
                          </div>
                          <pre style={{ margin: 0, fontSize: '11px', color: '#374151', overflow: 'auto', maxHeight: '150px' }}>
                            {JSON.stringify(storedAnswer, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Raw Response */}
                  <details style={{ marginTop: '20px' }}>
                    <summary style={{ fontSize: '12px', fontWeight: 500, color: '#6b7280', cursor: 'pointer', padding: '8px 0' }}>
                      Raw API Response
                    </summary>
                    <pre style={{ margin: '8px 0 0', fontSize: '11px', color: '#374151', backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', overflow: 'auto', maxHeight: '300px' }}>
                      {JSON.stringify(contentItem, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    Click "Fetch Next Item" to load an application item
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
