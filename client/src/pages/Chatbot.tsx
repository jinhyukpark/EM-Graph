import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/i18n";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, RotateCcw, Bot, User, FileText, ExternalLink, Sparkles, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: SourceCitation[];
  suggestedQuestions?: string[];
}

interface SourceCitation {
  id: string;
  title: string;
  department: string;
  relevance: number;
}

const INITIAL_SUGGESTIONS_KO = [
  "산업자재 원가 동향을 요약해줘",
  "PET 필름 품질관리 기준이 뭐야?",
  "화학사업부 Q3 실적은 어때?",
  "2025 S/S 패션 소재 트렌드 분석해줘",
  "글로벌 공급망 리스크 현황 알려줘",
  "에틸렌 스프레드 추이 분석",
];

const INITIAL_SUGGESTIONS_EN = [
  "Summarize industrial materials cost trends",
  "What are PET film quality control standards?",
  "How was Q3 performance for Chemicals division?",
  "Analyze 2025 S/S fashion material trends",
  "Show global supply chain risk status",
  "Analyze ethylene spread trends",
];

const MOCK_RESPONSES: Record<string, { ko: string; en: string; sources: SourceCitation[]; followUp: { ko: string[]; en: string[] } }> = {
  default: {
    ko: `분석 결과를 공유드립니다.

**산업자재 원가 현황**
• 철강 원자재 가격이 전년 대비 12.3% 상승하였습니다
• POSCO, 현대제철 납품단가 조정이 예상됩니다
• 동박 원자재의 경우 배터리 수요 증가로 15.8% 상승

**화학 부문**
• 에틸렌 스프레드가 배럴당 $320으로 회복세를 보이고 있습니다
• ABS 수지 수출물량이 전분기 대비 8.7% 증가했습니다
• NCC 가동률은 92%를 유지하고 있습니다

**필름/전자재료**
• 광학용 PET 필름 수요가 디스플레이 시장 성장과 함께 증가 중입니다
• 편광필름 원가구조 개선이 필요한 상황입니다

**패션 부문**
• 리사이클 폴리에스터 혼방 원단이 2025 S/S 주력 소재로 선정되었습니다
• GRS(글로벌 리사이클 표준) 인증 획득을 위한 공급망 재편이 진행 중입니다`,
    en: `Here are the analysis results:

**Industrial Materials Cost Status**
• Steel raw material prices rose 12.3% year-over-year
• POSCO and Hyundai Steel supply price adjustments expected
• Copper foil prices up 15.8% due to battery demand growth

**Chemicals Division**
• Ethylene spread recovering to $320/barrel
• ABS resin export volume up 8.7% quarter-over-quarter
• NCC utilization rate maintained at 92%

**Film/Electronic Materials**
• Optical PET film demand growing with display market expansion
• Polarizing film cost structure improvement needed

**Fashion Division**
• Recycled polyester blend fabrics selected as 2025 S/S primary material
• Supply chain restructuring underway for GRS certification`,
    sources: [
      { id: "s1", title: "2024년 산업자재 원가분석 보고서", department: "산업자재사업부", relevance: 96 },
      { id: "s2", title: "화학사업부 Q3 실적 리뷰", department: "화학사업부", relevance: 91 },
      { id: "s3", title: "PET 필름 제조공정 품질관리 매뉴얼", department: "필름/전자재료사업부", relevance: 87 },
      { id: "s4", title: "2025 S/S 컬렉션 소재 기획안", department: "패션사업부", relevance: 84 },
    ],
    followUp: {
      ko: ["각 사업부별 상세 원가 분석을 보여줘", "공급처별 납품단가 비교해줘", "전년 동기 대비 수익성 추이는?"],
      en: ["Show detailed cost analysis by division", "Compare supplier delivery prices", "What's the profitability trend vs last year?"],
    },
  },
  pet: {
    ko: `PET 필름 품질관리 기준에 대해 안내드립니다.

**두께 관리 기준**
• 광학용 PET 필름 두께 편차 허용 범위: ±1.5μm
• 일반 산업용: ±3.0μm
• 식품 포장용: ±2.0μm

**표면 품질 기준**
• 표면 결함(피쉬아이, 겔) 검출 시 즉시 라인 중단
• 광학용 제품의 경우 10cm² 당 결함 0건 기준 적용
• 헤이즈(Haze) 기준: 광학용 ≤0.8%, 일반용 ≤2.0%

**공정 관리 포인트**
• 연신 온도: 85~95°C (종연신), 100~110°C (횡연신)
• 열고정 온도: 220~235°C
• 권취 장력: 제품 두께에 따라 차등 적용`,
    en: `Here are the PET film quality control standards:

**Thickness Control Standards**
• Optical PET film thickness tolerance: ±1.5μm
• General industrial use: ±3.0μm
• Food packaging: ±2.0μm

**Surface Quality Standards**
• Immediate line stop upon detection of surface defects (fisheyes, gels)
• Zero defects per 10cm² for optical products
• Haze standard: Optical ≤0.8%, General ≤2.0%

**Process Control Points**
• Stretching temp: 85~95°C (MD), 100~110°C (TD)
• Heat setting temp: 220~235°C
• Winding tension: Applied differentially by product thickness`,
    sources: [
      { id: "s5", title: "PET 필름 제조공정 품질관리 매뉴얼 v3.2", department: "필름/전자재료사업부", relevance: 98 },
      { id: "s6", title: "광학필름 품질 검사 SOP", department: "필름/전자재료사업부", relevance: 93 },
    ],
    followUp: {
      ko: ["광학용 PET 필름 불량률 추이는?", "경쟁사 대비 품질 수준 비교해줘", "최근 클레임 현황을 알려줘"],
      en: ["What's the defect rate trend for optical PET?", "Compare quality vs competitors", "Show recent claim status"],
    },
  },
  costAnalysis: {
    ko: `각 사업부별 상세 원가 분석 결과입니다.

**산업자재사업부**
• 철강 코일 매입단가: 톤당 ₩892,000 (전년 대비 +12.3%)
• 동박 매입단가: kg당 ₩18,400 (전년 대비 +15.8%)
• 주요 원가 상승 요인: 글로벌 원자재 가격 인상, 물류비 증가
• 원가율: 68.2% → 72.1% (3.9%p 악화)

**화학사업부**
• 에틸렌 원료비: 톤당 $1,080 (전분기 대비 +5.2%)
• ABS 수지 제조원가: kg당 ₩2,340 (전분기 대비 -2.1%, 공정 개선 효과)
• NCC 가동률 92% 기준 손익분기 에틸렌 스프레드: $280/톤
• 원가율: 71.5% → 70.8% (0.7%p 개선)

**필름/전자재료사업부**
• 광학용 PET 필름 제조원가: ㎡당 ₩4,520 (전년 대비 +3.8%)
• 편광필름 원가: ㎡당 ₩12,800 (전년 대비 +6.1%)
• 원료(PTA/MEG) 가격 안정세, 그러나 에너지 비용 상승이 부담
• 원가율: 62.4% → 64.1% (1.7%p 악화)

**패션사업부**
• 리사이클 폴리에스터 원단: 야드당 ₩8,900 (일반 대비 +22%)
• 나일론 원사: kg당 ₩6,200 (전년 대비 +4.5%)
• GRS 인증 관련 추가 비용: 매출 대비 약 1.2%
• 원가율: 58.3% → 60.7% (2.4%p 악화)`,
    en: `Here is the detailed cost analysis by division:

**Industrial Materials Division**
• Steel coil purchase price: ₩892,000/ton (+12.3% YoY)
• Copper foil purchase price: ₩18,400/kg (+15.8% YoY)
• Key cost drivers: Global raw material price increases, logistics cost rise
• Cost ratio: 68.2% → 72.1% (3.9%p deterioration)

**Chemicals Division**
• Ethylene feedstock cost: $1,080/ton (+5.2% QoQ)
• ABS resin manufacturing cost: ₩2,340/kg (-2.1% QoQ, process improvement)
• Breakeven ethylene spread at 92% NCC utilization: $280/ton
• Cost ratio: 71.5% → 70.8% (0.7%p improvement)

**Film/Electronic Materials Division**
• Optical PET film manufacturing cost: ₩4,520/㎡ (+3.8% YoY)
• Polarizing film cost: ₩12,800/㎡ (+6.1% YoY)
• Raw materials (PTA/MEG) prices stable, but energy cost increase is a burden
• Cost ratio: 62.4% → 64.1% (1.7%p deterioration)

**Fashion Division**
• Recycled polyester fabric: ₩8,900/yard (+22% vs conventional)
• Nylon yarn: ₩6,200/kg (+4.5% YoY)
• GRS certification additional cost: ~1.2% of revenue
• Cost ratio: 58.3% → 60.7% (2.4%p deterioration)`,
    sources: [
      { id: "s7", title: "2024년 산업자재 원가분석 보고서", department: "산업자재사업부", relevance: 96 },
      { id: "s8", title: "화학사업부 Q3 실적 리뷰 및 Q4 전망", department: "화학사업부", relevance: 93 },
      { id: "s9", title: "편광필름 원가구조 분석", department: "필름/전자재료사업부", relevance: 89 },
      { id: "s10", title: "2025 S/S 컬렉션 소재 기획안", department: "패션사업부", relevance: 84 },
    ],
    followUp: {
      ko: ["원가율 개선 방안을 제안해줘", "공급처별 납품단가 비교해줘", "전년 동기 대비 수익성 추이는?"],
      en: ["Suggest cost ratio improvement plans", "Compare supplier delivery prices", "What's the profitability trend vs last year?"],
    },
  },
};

let responseCounter = 0;

function getResponse(query: string, lang: "en" | "ko") {
  const q = query.toLowerCase();
  if (q.includes("pet") || q.includes("필름") || q.includes("품질")) {
    return MOCK_RESPONSES.pet;
  }
  if (q.includes("원가") || q.includes("cost") || q.includes("상세") || q.includes("detail") || q.includes("사업부별")) {
    return MOCK_RESPONSES.costAnalysis;
  }
  responseCounter++;
  if (responseCounter % 2 === 0) {
    return MOCK_RESPONSES.costAnalysis;
  }
  return MOCK_RESPONSES.default;
}

export default function Chatbot() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [contextTopic, setContextTopic] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = useCallback((text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: msg,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    if (!contextTopic) {
      const topic = msg.length > 30 ? msg.substring(0, 30) + "..." : msg;
      setContextTopic(topic);
    }

    setTimeout(() => {
      const resp = getResponse(msg, language);
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-resp`,
        role: "assistant",
        content: resp[language],
        timestamp: new Date(),
        sources: resp.sources,
        suggestedQuestions: resp.followUp[language],
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200);
  }, [input, language, contextTopic]);

  const handleReset = useCallback(() => {
    setMessages([]);
    setContextTopic("");
    setInput("");
    inputRef.current?.focus();
  }, []);

  const initialSuggestions = language === "ko" ? INITIAL_SUGGESTIONS_KO : INITIAL_SUGGESTIONS_EN;

  return (
    <Layout>
      <div className="h-full flex flex-col">
        <div className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold" data-testid="text-chatbot-title">{t("intelliChatbot")}</h1>
              {contextTopic && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge variant="secondary" className="text-[10px] gap-1 h-5" data-testid="badge-context">
                    <Sparkles className="w-2.5 h-2.5" />
                    {contextTopic}
                  </Badge>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-1.5 text-xs"
            data-testid="button-conversation-reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t("resetConversation")}
          </Button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 py-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-6">
                <Bot className="w-8 h-8 text-violet-500" />
              </div>
              <h2 className="text-xl font-bold mb-2" data-testid="text-chatbot-welcome">{t("chatbotWelcome")}</h2>
              <p className="text-sm text-muted-foreground mb-8 max-w-md text-center">{t("chatbotWelcomeDesc")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
                {initialSuggestions.map((q, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="justify-start text-left h-auto py-2.5 px-3.5 text-xs hover:bg-primary/5 hover:border-primary/30 transition-all"
                    onClick={() => handleSend(q)}
                    data-testid={`button-suggested-${i}`}
                  >
                    <Sparkles className="w-3 h-3 mr-2 shrink-0 text-violet-500" />
                    <span className="truncate">{q}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={cn("max-w-[80%] space-y-3", msg.role === "user" ? "items-end" : "items-start")}>
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-md"
                          : "bg-muted/60 border border-border rounded-tl-md"
                      )}
                      data-testid={`message-${msg.id}`}
                    >
                      {msg.content}
                    </div>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{t("referenceSources")}</span>
                        {msg.sources.map((src) => (
                          <Card key={src.id} className="hover:shadow-sm transition-shadow cursor-pointer group" data-testid={`card-source-${src.id}`}>
                            <CardContent className="p-2.5 flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                                <FileText className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">{src.title}</p>
                                <p className="text-[10px] text-muted-foreground">{src.department} · {t("relevance")} {src.relevance}%</p>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                    {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedQuestions.map((q, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            className="text-[11px] h-7 px-2.5 gap-1 hover:bg-primary/5 hover:border-primary/30"
                            onClick={() => handleSend(q)}
                            data-testid={`button-followup-${msg.id}-${i}`}
                          >
                            <Sparkles className="w-2.5 h-2.5 text-violet-500" />
                            {q}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-muted/60 border border-border rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0ms]" />
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:150ms]" />
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-border bg-card/80 backdrop-blur-sm px-4 py-3 shrink-0">
          <div className="max-w-3xl mx-auto flex gap-2">
            <Input
              ref={inputRef}
              className="h-11 text-sm bg-background"
              placeholder={t("chatInputPlaceholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isTyping}
              data-testid="input-chat"
            />
            <Button
              className="h-11 px-4"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              data-testid="button-chat-send"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
