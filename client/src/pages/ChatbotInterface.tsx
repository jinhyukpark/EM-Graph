import { useState, useRef, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useLanguage } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send, RotateCcw, Bot, User, FileText, Sparkles, MessageSquare, Loader2, ExternalLink
} from "lucide-react";

type Citation = {
  title: string;
  titleKo: string;
  page: number;
  source: string;
};

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  contentKo: string;
  citations?: Citation[];
  timestamp: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "user",
    content: "What was the Q3 2024 cost reduction achievement rate for the steel division?",
    contentKo: "2024년 3분기 철강사업부 원가절감 달성률은 얼마인가요?",
    timestamp: "14:23",
  },
  {
    id: "2",
    role: "bot",
    content: "Based on the analysis of internal reports, the steel division achieved a **92.3% cost reduction rate** in Q3 2024, exceeding the target of 88%. Key contributing factors include:\n\n1. **Raw material procurement optimization** — Achieved 15% savings through long-term contracts with POSCO suppliers\n2. **Energy efficiency improvements** — Pohang plant reduced energy consumption by 8.2% through smart grid implementation\n3. **Logistics cost reduction** — New shipping route optimization saved ₩2.3 billion\n\nThe overall cost savings amounted to approximately **₩45.7 billion**, which is ₩5.2 billion above the quarterly target.",
    contentKo: "내부 보고서 분석 결과, 철강사업부는 2024년 3분기에 **92.3%의 원가절감 달성률**을 기록했으며, 목표치 88%를 초과 달성했습니다. 주요 기여 요인은 다음과 같습니다:\n\n1. **원자재 조달 최적화** — POSCO 공급업체와의 장기 계약을 통해 15% 절감 달성\n2. **에너지 효율 개선** — 포항 공장이 스마트 그리드 도입으로 에너지 소비를 8.2% 절감\n3. **물류비 절감** — 새로운 해운 노선 최적화로 23억 원 절약\n\n전체 원가 절감액은 약 **457억 원**으로, 분기 목표 대비 52억 원 초과 달성했습니다.",
    citations: [
      { title: "Q3 2024 Cost Reduction Report", titleKo: "2024년 3분기 원가절감 보고서", page: 12, source: "Steel Division" },
      { title: "Procurement Strategy Analysis", titleKo: "조달 전략 분석서", page: 34, source: "Supply Chain Team" },
      { title: "Energy Efficiency Dashboard Summary", titleKo: "에너지 효율 대시보드 요약", page: 5, source: "Operations" },
    ],
    timestamp: "14:23",
  },
  {
    id: "3",
    role: "user",
    content: "Which department contributed the most to cost savings?",
    contentKo: "어떤 부서가 원가 절감에 가장 많이 기여했나요?",
    timestamp: "14:25",
  },
  {
    id: "4",
    role: "bot",
    content: "The **Procurement Department** contributed the most to cost savings in Q3 2024, accounting for approximately **38.5%** (₩17.6 billion) of total savings.\n\nHere is the breakdown by department:\n\n| Department | Savings | Share |\n|---|---|---|\n| Procurement | ₩17.6B | 38.5% |\n| Operations | ₩12.1B | 26.5% |\n| Logistics | ₩8.9B | 19.5% |\n| Quality Control | ₩4.2B | 9.2% |\n| Others | ₩2.9B | 6.3% |\n\nNotably, the Procurement Department's performance was largely driven by **김철수 부장**'s initiative to renegotiate supplier contracts across 12 key material categories.",
    contentKo: "**조달부서**가 2024년 3분기 원가 절감에 가장 크게 기여했으며, 전체 절감액의 약 **38.5%**(176억 원)를 차지했습니다.\n\n부서별 내역은 다음과 같습니다:\n\n| 부서 | 절감액 | 비율 |\n|---|---|---|\n| 조달 | 176억 원 | 38.5% |\n| 운영 | 121억 원 | 26.5% |\n| 물류 | 89억 원 | 19.5% |\n| 품질관리 | 42억 원 | 9.2% |\n| 기타 | 29억 원 | 6.3% |\n\n특히 조달부서의 성과는 **김철수 부장**의 12개 주요 자재 카테고리 공급업체 계약 재협상 이니셔티브에 의해 주도되었습니다.",
    citations: [
      { title: "Department Performance Summary Q3", titleKo: "3분기 부서별 성과 요약", page: 8, source: "Finance" },
      { title: "Supplier Contract Renegotiation Report", titleKo: "공급업체 계약 재협상 보고서", page: 22, source: "Procurement" },
    ],
    timestamp: "14:25",
  },
];

const MOCK_RESPONSES: Message[] = [
  {
    id: "",
    role: "bot",
    content: "Based on the latest board meeting minutes from December 2024, the supply chain resilience plan includes three main pillars:\n\n1. **Dual-source strategy** — Establishing backup suppliers for all critical materials by Q2 2025\n2. **Inventory buffer optimization** — Increasing safety stock levels for strategic materials from 2 weeks to 4 weeks\n3. **Digital supply chain platform** — Implementing real-time monitoring across all tier-1 suppliers\n\nThe estimated investment for these initiatives is **₩28.5 billion** over 18 months, with an expected ROI of 340% within 3 years.",
    contentKo: "2024년 12월 이사회 회의록에 따르면, 공급망 회복력 계획은 세 가지 주요 축으로 구성됩니다:\n\n1. **이중 소싱 전략** — 2025년 2분기까지 모든 핵심 자재에 대해 백업 공급업체 확보\n2. **재고 버퍼 최적화** — 전략 자재의 안전 재고 수준을 2주에서 4주로 확대\n3. **디지털 공급망 플랫폼** — 모든 1차 공급업체에 대한 실시간 모니터링 구현\n\n이 이니셔티브의 예상 투자액은 18개월에 걸쳐 **285억 원**이며, 3년 내 340%의 ROI가 예상됩니다.",
    citations: [
      { title: "Board Meeting Minutes Dec 2024", titleKo: "2024년 12월 이사회 회의록", page: 15, source: "Executive Office" },
      { title: "Supply Chain Resilience Plan", titleKo: "공급망 회복력 계획서", page: 3, source: "Supply Chain" },
    ],
    timestamp: "",
  },
  {
    id: "",
    role: "bot",
    content: "The Pohang steel plant's production output for 2024 shows a significant improvement trend:\n\n- **Q1**: 1.2M tons (capacity utilization: 85%)\n- **Q2**: 1.35M tons (capacity utilization: 91%)\n- **Q3**: 1.41M tons (capacity utilization: 94%)\n- **Q4 (projected)**: 1.5M tons (target: 96%)\n\nThe improvement is attributed to the **smart manufacturing system** upgrade completed in March 2024, which reduced equipment downtime by 23% and improved yield rate from 96.1% to 98.3%.",
    contentKo: "포항 제철소의 2024년 생산량은 뚜렷한 개선 추세를 보이고 있습니다:\n\n- **1분기**: 120만 톤 (가동률: 85%)\n- **2분기**: 135만 톤 (가동률: 91%)\n- **3분기**: 141만 톤 (가동률: 94%)\n- **4분기 (예상)**: 150만 톤 (목표: 96%)\n\n이 개선은 2024년 3월에 완료된 **스마트 제조 시스템** 업그레이드 덕분으로, 설비 가동 중단 시간이 23% 감소하고 수율이 96.1%에서 98.3%로 향상되었습니다.",
    citations: [
      { title: "Pohang Plant Monthly Report", titleKo: "포항 공장 월간 보고서", page: 7, source: "Operations" },
      { title: "Smart Manufacturing ROI Analysis", titleKo: "스마트 제조 ROI 분석", page: 18, source: "IT Division" },
    ],
    timestamp: "",
  },
];

const SUGGESTED_QUESTIONS_EN = [
  "What is the supply chain resilience plan for 2025?",
  "Show me the Pohang plant production output trends",
  "Summarize the latest board meeting decisions",
  "What are the top 5 risk factors for next quarter?",
];

const SUGGESTED_QUESTIONS_KO = [
  "2025년 공급망 회복력 계획은 무엇인가요?",
  "포항 공장 생산량 추이를 보여주세요",
  "최근 이사회 회의 결정사항을 요약해주세요",
  "다음 분기 상위 5대 리스크 요인은 무엇인가요?",
];

export default function ChatbotInterface() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mockResponseIndex = useRef(0);

  const suggestedQuestions = language === "ko" ? SUGGESTED_QUESTIONS_KO : SUGGESTED_QUESTIONS_EN;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText || isThinking) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      contentKo: messageText,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsThinking(true);

    setTimeout(() => {
      const responseTemplate = MOCK_RESPONSES[mockResponseIndex.current % MOCK_RESPONSES.length];
      mockResponseIndex.current++;

      const botMessage: Message = {
        ...responseTemplate,
        id: (Date.now() + 1).toString(),
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsThinking(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleReset = () => {
    setMessages([]);
    setIsThinking(false);
    mockResponseIndex.current = 0;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessageContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      let processed = line
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\|/g, '<span class="text-muted-foreground/50">|</span>');

      if (line.startsWith("- ") || line.startsWith("| ")) {
        return <div key={i} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: processed }} />;
      }
      if (line.match(/^\d+\./)) {
        return <div key={i} className="text-sm leading-relaxed ml-2" dangerouslySetInnerHTML={{ __html: processed }} />;
      }
      if (line.trim() === "") {
        return <div key={i} className="h-2" />;
      }
      return <div key={i} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: processed }} />;
    });
  };

  return (
    <Layout>
      <div className="flex flex-col h-full bg-background" data-testid="chatbot-interface-page">
        <div className="border-b border-border bg-card/50 px-6 py-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold" data-testid="text-page-title">{t("chatInterface")}</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="outline" className="text-[10px] h-5" data-testid="badge-context">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {t("currentContext")}: {language === "ko" ? "철강사업부 Q3 2024" : "Steel Division Q3 2024"}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2"
              data-testid="button-reset-conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t("resetConversation")}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col max-w-4xl mx-auto w-full">
          <ScrollArea className="flex-1 px-6" ref={scrollRef}>
            <div className="py-6 space-y-6">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="empty-state">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm">{t("conversationReset")}</p>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`} data-testid={`message-${msg.role}-${msg.id}`}>
                  {msg.role === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${msg.role === "user" ? "order-first" : ""}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted/50 border border-border rounded-bl-md"
                      }`}
                    >
                      {renderMessageContent(language === "ko" ? msg.contentKo : msg.content)}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 px-1">
                      <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                    </div>

                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 px-1">
                          <FileText className="w-3 h-3" />
                          {t("sourceCitations")} ({msg.citations.length})
                        </div>
                        <div className="grid gap-2">
                          {msg.citations.map((citation, idx) => (
                            <Card key={idx} className="bg-card/80 border-border/50 shadow-none hover:bg-accent/30 transition-colors cursor-pointer" data-testid={`citation-card-${msg.id}-${idx}`}>
                              <CardContent className="p-3 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-8 h-8 rounded bg-primary/5 flex items-center justify-center shrink-0">
                                    <FileText className="w-4 h-4 text-primary/70" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-sm font-medium truncate">
                                      {language === "ko" ? citation.titleKo : citation.title}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground">
                                      {citation.source} · {t("page")} {citation.page}
                                    </div>
                                  </div>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {isThinking && (
                <div className="flex gap-3 justify-start" data-testid="thinking-indicator">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-muted/50 border border-border rounded-bl-md">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("thinking")}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="px-6 pb-4 pt-2 space-y-3">
            {messages.length > 0 && !isThinking && (
              <div data-testid="suggested-questions">
                <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  {t("suggestedQuestions")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((q, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 rounded-full hover:bg-primary/5 hover:border-primary/30"
                      onClick={() => handleSendMessage(q)}
                      data-testid={`button-suggested-question-${idx}`}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 bg-muted/30 border border-border rounded-xl p-2 focus-within:border-primary/50 transition-colors">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("chatPlaceholder")}
                className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm h-9"
                disabled={isThinking}
                data-testid="input-chat-message"
              />
              <Button
                size="sm"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isThinking}
                className="rounded-lg h-9 px-4 gap-2 shrink-0"
                data-testid="button-send-message"
              >
                <Send className="w-4 h-4" />
                {t("sendMessage")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
