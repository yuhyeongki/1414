import React, { useState } from 'react';
import { KeyRound, X, CheckCircle2, AlertCircle, ExternalLink, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { testNeisKey, getStoredApiKey, setStoredApiKey } from '../services/neisService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated,
}) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    valid?: boolean;
    message?: string;
  }>({ tested: false });

  if (!isOpen) return null;

  const handleTestKey = async () => {
    setIsTesting(true);
    setTestResult({ tested: false });
    try {
      const result = await testNeisKey(apiKey.trim());
      setTestResult({
        tested: true,
        valid: result.valid,
        message: result.message,
      });
    } catch {
      setTestResult({
        tested: true,
        valid: false,
        message: '연결 테스트에 실패했습니다. 키를 확인해주세요.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    setStoredApiKey(apiKey.trim());
    onKeyUpdated();
    onClose();
  };

  const handleReset = () => {
    setApiKey('');
    setStoredApiKey('');
    setTestResult({
      tested: true,
      valid: true,
      message: '공개 기본 모드로 초기화되었습니다.',
    });
    onKeyUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-sky-100 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-sky-100 bg-sky-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-sky-950 font-cute">
                나이스(NEIS) API 키 설정
              </h3>
              <p className="text-xs text-sky-700/80">
                교육부 나이스 교육정보 개방포털 공식 인증키를 연동합니다.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          
          {/* Status Banner */}
          <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200/80 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
            <div className="text-xs text-sky-900 leading-relaxed">
              <span className="font-bold">현재 연결 상태: </span>
              {apiKey.trim() ? (
                <span className="text-emerald-700 font-extrabold">
                  개인 맞춤 인증키 사용 중 🔑
                </span>
              ) : (
                <span className="text-sky-700 font-medium">
                  공개 기본 모드 (키 없이도 전국의 기본 급식 조회가 가능해요)
                </span>
              )}
            </div>
          </div>

          {/* Key Input Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              나이스 인증키 (API Key)
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setTestResult({ tested: false });
              }}
              placeholder="예: 32자리 나이스 인증키 (공백 시 기본 모드)"
              className="w-full px-4 py-2.5 bg-sky-50/30 border border-sky-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
            />
          </div>

          {/* Test connection button & feedback */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestKey}
              disabled={isTesting}
              className="px-3.5 py-2 text-xs font-bold text-sky-800 bg-sky-100 hover:bg-sky-200 rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isTesting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              )}
              <span>연결 테스트</span>
            </button>

            {apiKey && (
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              >
                기본 모드로 초기화
              </button>
            )}
          </div>

          {/* Test Result Message */}
          {testResult.tested && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 font-medium ${
                testResult.valid
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {testResult.valid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Guide Box */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
              <span>💡 나이스 공식 API 키 발급 방법 (100% 무료)</span>
              <a
                href="https://open.neis.go.kr"
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 hover:text-sky-800 flex items-center gap-0.5 text-[11px] font-semibold"
              >
                <span>나이스 포털 열기</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </h4>
            <ol className="text-[11px] text-slate-500 space-y-1 list-decimal pl-4 leading-relaxed">
              <li>나이스 교육정보 개방포털(open.neis.go.kr)에 접속 후 회원가입/로그인합니다.</li>
              <li>상단 메뉴의 [인증키 신청]에서 무료 일반 인증키를 신청합니다.</li>
              <li>발급받은 인증키를 위 입력창에 붙여넣고 [저장하기]를 누르면 끝!</li>
            </ol>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:scale-95 rounded-xl shadow-xs transition-all"
          >
            저장하고 적용하기
          </button>
        </div>

      </div>
    </div>
  );
};
