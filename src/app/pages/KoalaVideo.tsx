import { useEffect, useRef, useState, useCallback } from "react";

// Narration segments with delays (ms)
const NARRATION_SEGMENTS = [
  { delay: 1500, text: "你知道情绪是怎么来的吗？" },
  { delay: 4000, text: "很多人以为情绪是随机的。其实每一次情绪，都有一条完整的链条。" },
  { delay: 9000, text: "一件事发生了，大脑瞬间做出判断，判断触发身体感受，感受变成情绪，情绪驱动你的反应。" },
  { delay: 14500, text: "这条链条跑得非常快。但中间有一个关键环节——判断。而这个判断，大部分不是你当下做出的，是你很早以前就学会的。" },
  { delay: 22000, text: "理解了链条，你就知道——情绪不是敌人，它只是一个结果。" },
];

const TOTAL_DURATION = 40000;

// Chain nodes data
const CHAIN_NODES = [
  { id: "n1", num: "①", label: "事件\n发生", title: "事件发生", desc: "外部刺激进入感知系统" },
  { id: "n2", num: "②", label: "大脑\n判断", title: "大脑做出判断", desc: "在你意识到之前已经发生", isKey: true },
  { id: "n3", num: "③", label: "身体\n感受", title: "身体产生感受", desc: "胸口收紧、腹部下沉" },
  { id: "n4", num: "④", label: "情绪\n形成", title: "感受变成情绪", desc: "感受 + 判断 = 情绪" },
  { id: "n5", num: "⑤", label: "自动\n反应", title: "情绪驱动反应", desc: "旧程序启动，替你做决定" },
];

function speak(text: string) {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "zh-CN";
  u.rate = 0.88;
  u.pitch = 1.0;
  const voices = speechSynthesis.getVoices();
  const zhVoice =
    voices.find((v) => v.lang.startsWith("zh") && v.name.toLowerCase().includes("female")) ||
    voices.find((v) => v.lang.startsWith("zh"));
  if (zhVoice) u.voice = zhVoice;
  speechSynthesis.speak(u);
}

export default function KoalaVideo() {
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Visibility states
  const [showBrand, setShowBrand] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showNodes, setShowNodes] = useState<boolean[]>([false, false, false, false, false]);
  const [showArrows, setShowArrows] = useState<boolean[]>([false, false, false, false]);
  const [highlightNode2, setHighlightNode2] = useState(false);
  const [koalaState, setKoalaState] = useState<"hidden" | "show" | "pointing">("hidden");
  const [showHighlightNote, setShowHighlightNote] = useState(false);
  const [shrinkChain, setShrinkChain] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const [showEndCard, setShowEndCard] = useState(false);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const clearAll = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    cancelAnimationFrame(rafRef.current);
    speechSynthesis.cancel();
  }, []);

  const runTimeline = useCallback(() => {
    const t = (delay: number, fn: () => void) => {
      timersRef.current.push(setTimeout(fn, delay));
    };

    const showNode = (idx: number) =>
      setShowNodes((prev) => {
        const next = [...prev];
        next[idx] = true;
        return next;
      });

    const showArrow = (idx: number) =>
      setShowArrows((prev) => {
        const next = [...prev];
        next[idx] = true;
        return next;
      });

    t(300, () => setShowBrand(true));
    t(800, () => setKoalaState("show"));
    t(1500, () => setShowQuestion(true));
    t(3800, () => setShowQuestion(false));
    t(4200, () => showNode(0));
    t(5400, () => showArrow(0));
    t(6000, () => showNode(1));
    t(7200, () => showArrow(1));
    t(7800, () => showNode(2));
    t(9000, () => showArrow(2));
    t(9600, () => showNode(3));
    t(10800, () => showArrow(3));
    t(11400, () => showNode(4));
    t(13200, () => {
      setHighlightNode2(true);
      setKoalaState("pointing");
    });
    t(14200, () => setShowHighlightNote(true));
    t(20500, () => {
      setShowHighlightNote(false);
      setHighlightNode2(false);
      setKoalaState("show");
      setShrinkChain(true);
    });
    t(21500, () => setShowInsight(true));
    t(28000, () => setShowInsight(false));
    t(33000, () => {
      setShrinkChain(false);
      setShowEndCard(true);
    });
    t(TOTAL_DURATION + 500, () => {
      clearAll();
      window.location.reload();
    });
  }, [clearAll]);

  const scheduleNarration = useCallback(() => {
    NARRATION_SEGMENTS.forEach(({ delay, text }) => {
      timersRef.current.push(setTimeout(() => speak(text), delay));
    });
  }, []);

  const startPlayback = useCallback(() => {
    setStarted(true);
    startTimeRef.current = performance.now();

    // Progress bar animation
    const tick = (ts: number) => {
      const elapsed = ts - startTimeRef.current;
      setProgress(Math.min((elapsed / TOTAL_DURATION) * 100, 100));
      if (elapsed < TOTAL_DURATION) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    runTimeline();

    // Schedule narration (voices may load async)
    if (speechSynthesis.getVoices().length > 0) {
      scheduleNarration();
    } else {
      speechSynthesis.addEventListener("voiceschanged", scheduleNarration, { once: true });
    }
  }, [runTimeline, scheduleNarration]);

  useEffect(() => {
    return () => clearAll();
  }, [clearAll]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#111]">
      {/* 9:16 frame */}
      <div
        className="relative overflow-hidden rounded-3xl shadow-2xl"
        style={{
          width: 390,
          height: 844,
          background: "#1a1a2e",
          fontFamily: '"Source Han Sans SC", "PingFang SC", "Noto Sans CJK SC", "思源黑体", -apple-system, sans-serif',
        }}
      >
        {/* Click-to-start overlay */}
        {!started && (
          <button
            onClick={startPlayback}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 cursor-pointer"
            style={{ background: "rgba(26,26,46,0.95)" }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #c4a882, #e8c99a)",
                boxShadow: "0 0 40px rgba(196,168,130,0.4)",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M10 6l18 10-18 10V6z" fill="white" />
              </svg>
            </div>
            <p style={{ color: "#c4a882", fontSize: 14, letterSpacing: 2 }}>点击开始播放</p>
          </button>
        )}

        {/* Brand */}
        <p
          className="absolute"
          style={{
            top: 36,
            left: 28,
            fontSize: 10,
            letterSpacing: 3,
            color: "#c4a882",
            opacity: showBrand ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        >
          LOVE EGO AI
        </p>

        {/* Opening question */}
        <h1
          className="absolute"
          style={{
            top: 80,
            left: 28,
            right: 28,
            fontSize: 22,
            fontWeight: 300,
            color: "#F3EEEA",
            lineHeight: 1.4,
            opacity: showQuestion ? 1 : 0,
            transform: showQuestion ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          你知道
          <br />
          <strong style={{ fontWeight: 600, color: "#e8c99a" }}>情绪是怎么来的吗？</strong>
        </h1>

        {/* Chain area */}
        <div
          className="absolute flex flex-col"
          style={{
            top: 160,
            left: 28,
            right: 28,
            gap: 0,
            transform: shrinkChain ? "translateY(-60px) scale(0.85)" : "translateY(0) scale(1)",
            opacity: showEndCard ? 0 : shrinkChain ? 0.5 : 1,
            transition: "transform 0.8s ease, opacity 0.8s ease",
          }}
        >
          {CHAIN_NODES.map((node, idx) => (
            <div key={node.id}>
              {/* Node row */}
              <div
                className="flex items-center"
                style={{
                  opacity: showNodes[idx] ? 1 : 0,
                  transform: showNodes[idx] ? "translateX(0)" : "translateX(-16px)",
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                }}
              >
                {/* Circle node */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    border: `2px solid ${node.isKey && highlightNode2 ? "#e8c99a" : "#c4a882"}`,
                    background: node.isKey && highlightNode2
                      ? "linear-gradient(135deg, #c4a882, #e8c99a)"
                      : "rgba(255,255,255,0.05)",
                    display: "flex",
                    flexDirection: "column" as const,
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transform: node.isKey && highlightNode2 ? "scale(1.2)" : "scale(1)",
                    boxShadow: node.isKey && highlightNode2 ? "0 0 0 6px rgba(196,168,130,0.25)" : "none",
                    transition: "background 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease",
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      color: node.isKey && highlightNode2 ? "white" : "#c4a882",
                      fontWeight: 500,
                    }}
                  >
                    {node.num}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color: node.isKey && highlightNode2 ? "white" : "#e8d5bc",
                      fontWeight: 500,
                      textAlign: "center",
                      lineHeight: 1.2,
                      marginTop: 1,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {node.label}
                  </span>
                </div>
                {/* Description */}
                <div style={{ marginLeft: 12 }}>
                  <strong
                    style={{
                      display: "block",
                      fontSize: 13,
                      color: "#F3EEEA",
                      fontWeight: 500,
                      marginBottom: 1,
                    }}
                  >
                    {node.title}
                  </strong>
                  <span style={{ fontSize: 12, color: "#9a8a7a", lineHeight: 1.4 }}>{node.desc}</span>
                </div>
              </div>

              {/* Arrow between nodes */}
              {idx < CHAIN_NODES.length - 1 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 25,
                    height: 20,
                    opacity: showArrows[idx] ? 1 : 0,
                    transition: "opacity 0.4s ease",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div
                      style={{
                        width: 1,
                        height: 14,
                        background: "linear-gradient(to bottom, #c4a882, rgba(196,168,130,0.5))",
                      }}
                    />
                    <div
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: "4px solid transparent",
                        borderRight: "4px solid transparent",
                        borderTop: "6px solid #c4a882",
                        marginLeft: -3.5,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Highlight note */}
        <div
          className="absolute"
          style={{
            top: 390,
            left: 28,
            right: 28,
            background: "rgba(196,168,130,0.10)",
            borderLeft: "2px solid #c4a882",
            borderRadius: "0 8px 8px 0",
            padding: "10px 12px",
            fontSize: 12,
            color: "#d4c4b0",
            lineHeight: 1.6,
            opacity: showHighlightNote ? 1 : 0,
            transform: showHighlightNote ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          这个判断，大部分不是你当下做出的——
          <br />
          <strong style={{ color: "#e8c99a" }}>是你很早以前就学会的。</strong>
        </div>

        {/* Insight */}
        <div
          className="absolute"
          style={{
            top: 540,
            left: 28,
            right: 120,
            fontSize: 18,
            fontWeight: 300,
            color: "#F3EEEA",
            lineHeight: 1.5,
            opacity: showInsight ? 1 : 0,
            transform: showInsight ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          看见链条，
          <br />
          才有机会
          <br />
          在某个环节
          <br />
          <em style={{ fontStyle: "normal", color: "#e8c99a", fontWeight: 500 }}>停下来。</em>
        </div>

        {/* Koala IP */}
        <img
          src="/koala-ip.png"
          alt="考拉"
          style={{
            position: "absolute",
            bottom: -50,
            right: -20,
            width: 200,
            opacity: koalaState === "hidden" ? 0 : 1,
            transform:
              koalaState === "pointing"
                ? "scaleX(-1) translateX(-20px) translateY(0)"
                : koalaState === "show"
                ? "translateX(0) translateY(0)"
                : "translateX(60px) translateY(50px)",
            transition: "opacity 0.9s cubic-bezier(0.34,1.56,0.64,1), transform 0.9s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        />

        {/* End card */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, #0d0d1a 0%, #1a1a2e 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            opacity: showEndCard ? 1 : 0,
            transition: "opacity 0.8s ease",
            pointerEvents: showEndCard ? "auto" : "none",
          }}
        >
          <p style={{ fontSize: 11, letterSpacing: 4, color: "#c4a882" }}>LOVE EGO AI</p>
          <p
            style={{
              fontSize: 20,
              fontWeight: 300,
              color: "#F3EEEA",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            情绪不是敌人
            <br />
            它只是一个结果
          </p>
          <p style={{ fontSize: 11, color: "#6a5a4a", letterSpacing: 1, marginTop: 4 }}>关注了解更多</p>
        </div>

        {/* Progress bar */}
        {started && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: 3,
              width: `${progress}%`,
              background: "linear-gradient(to right, #c4a882, #e8c99a)",
              borderRadius: "0 2px 2px 0",
              transition: "width 0.1s linear",
            }}
          />
        )}
      </div>
    </div>
  );
}
