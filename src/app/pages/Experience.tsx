import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";

// 体验入口：5步引导流程
// 核心设计原则：让用户用身体感受一次"旧程序可以被打断"
// 不是讲道理，是让她自己体验到"我停住了"

type BodyState = "收缩" | "中性" | "扩张" | null;

interface StepProps {
  onNext: () => void;
}

// Step 1: 身体感受检测（前测）
function Step1({ onNext, onSetBefore }: StepProps & { onSetBefore: (s: BodyState) => void }) {
  const [selected, setSelected] = useState<BodyState>(null);

  return (
    <div className="flex flex-col h-screen bg-[#F3EEEA] px-8 py-16">
      <StepIndicator current={1} total={5} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col justify-center"
      >
        <p className="text-sm text-[#8a7a6a] mb-3">现在</p>
        <h2 className="text-3xl font-light leading-snug mb-2">
          你的身体
        </h2>
        <h2 className="text-3xl font-medium leading-snug mb-10">
          感觉怎么样？
        </h2>
        <p className="text-[#4a3f35] text-sm mb-8 leading-relaxed">
          不用想太多，凭第一感觉。
          <br />
          注意胸口或腹部的感受。
        </p>

        <div className="space-y-3">
          {(["收缩", "中性", "扩张"] as BodyState[]).map((state) => (
            <button
              key={state}
              onClick={() => setSelected(state)}
              className={`w-full py-4 rounded-2xl text-left px-5 transition-all
                ${selected === state
                  ? "bg-[#1a1a1a] text-[#F3EEEA]"
                  : "bg-[#EDE8E3] text-[#1a1a1a]"
                }`}
            >
              <span className="font-medium">{state}</span>
              <span className="text-sm opacity-60 ml-3">
                {state === "收缩" && "紧、压、沉"}
                {state === "中性" && "平、稳、不确定"}
                {state === "扩张" && "轻、暖、开放"}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      <button
        disabled={!selected}
        onClick={() => onSetBefore(selected)}
        className={`w-full py-4 rounded-2xl text-base font-medium transition-all
          ${selected
            ? "bg-[#1a1a1a] text-[#F3EEEA] active:scale-95"
            : "bg-[#1a1a1a]/20 text-[#1a1a1a]/40 cursor-not-allowed"
          }`}
      >
        继续
      </button>
    </div>
  );
}

// Step 2: 垂直呼吸引导（3轮）
// 垂直呼吸：吸气时胸腔向上扩展，呼气时向下放松
function Step2({ onNext }: StepProps) {
  const [phase, setPhase] = useState<"inhale" | "exhale" | "done">("inhale");
  const [round, setRound] = useState(1);
  const totalRounds = 3;

  useEffect(() => {
    const cycle = () => {
      // 吸气 4s → 呼气 6s → 下一轮
      setPhase("inhale");
      const exhaleTimer = setTimeout(() => {
        setPhase("exhale");
        const nextTimer = setTimeout(() => {
          if (round < totalRounds) {
            setRound((r) => r + 1);
          } else {
            setPhase("done");
          }
        }, 6000);
        return () => clearTimeout(nextTimer);
      }, 4000);
      return () => clearTimeout(exhaleTimer);
    };

    const cleanup = cycle();
    return cleanup;
  }, [round]);

  return (
    <div className="flex flex-col h-screen bg-[#F3EEEA] px-8 py-16 items-center">
      <StepIndicator current={2} total={5} />

      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-sm text-[#8a7a6a] mb-10 text-center">
          第 {Math.min(round, totalRounds)} / {totalRounds} 次呼吸
        </p>

        {/* 呼吸动画圆圈 */}
        <motion.div
          animate={
            phase === "done"
              ? { scale: 1, opacity: 0.5 }
              : phase === "inhale"
              ? { scale: 1.5, opacity: 0.9 }
              : { scale: 0.8, opacity: 0.4 }
          }
          transition={
            phase === "inhale"
              ? { duration: 4, ease: "easeInOut" }
              : { duration: 6, ease: "easeInOut" }
          }
          className="w-40 h-40 rounded-full bg-[#c4a882]/40 flex items-center justify-center"
        >
          <div className="w-20 h-20 rounded-full bg-[#c4a882]/60" />
        </motion.div>

        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-light mt-12 text-[#1a1a1a]"
        >
          {phase === "done" ? "很好" : phase === "inhale" ? "吸气" : "呼气"}
        </motion.p>

        <p className="text-sm text-[#8a7a6a] mt-4 text-center max-w-xs leading-relaxed">
          {phase === "done"
            ? "你刚刚做了三次完整的呼吸。"
            : phase === "inhale"
            ? "胸腔向上扩展，感受空间打开"
            : "身体慢慢放松，让气息流出"}
        </p>
      </div>

      <button
        disabled={phase !== "done"}
        onClick={onNext}
        className={`w-full py-4 rounded-2xl text-base font-medium transition-all
          ${phase === "done"
            ? "bg-[#1a1a1a] text-[#F3EEEA] active:scale-95"
            : "bg-[#1a1a1a]/20 text-[#1a1a1a]/40 cursor-not-allowed"
          }`}
      >
        继续
      </button>
    </div>
  );
}

// Step 3: Body Scan（90秒引导）
// 将注意力从头脑带回身体，是整个课程体系的核心入口
function Step3({ onNext }: StepProps) {
  const [seconds, setSeconds] = useState(90);
  const [started, setStarted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const bodyParts = [
    { at: 90, text: "闭上眼睛，把注意力带到头顶" },
    { at: 75, text: "感受你的肩膀和脖子" },
    { at: 60, text: "注意胸口——是紧还是松？" },
    { at: 45, text: "感受腹部，有什么在那里？" },
    { at: 30, text: "注意双手和手臂的感觉" },
    { at: 15, text: "把注意力扩展到整个身体" },
    { at: 0, text: "就这样，待在这里" },
  ];

  const currentGuide = bodyParts.find((b) => seconds <= b.at + 15 && seconds > b.at - 1)
    || bodyParts[bodyParts.length - 1];

  useEffect(() => {
    if (started && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [started, seconds]);

  const done = seconds === 0;

  return (
    <div className="flex flex-col h-screen bg-[#F3EEEA] px-8 py-16">
      <StepIndicator current={3} total={5} />

      <div className="flex-1 flex flex-col items-center justify-center">
        {!started ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl font-light mb-4">身体扫描</h2>
            <p className="text-[#4a3f35] leading-relaxed mb-10">
              接下来 90 秒，跟着引导
              <br />
              把注意力从头到脚扫描一遍身体。
              <br />
              <br />
              不用做任何事，只是感受。
            </p>
            <button
              onClick={() => setStarted(true)}
              className="px-8 py-3 bg-[#1a1a1a] text-[#F3EEEA] rounded-2xl"
            >
              开始
            </button>
          </motion.div>
        ) : (
          <>
            {/* 计时器 */}
            <div className="relative w-32 h-32 mb-12">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="44"
                  fill="none" stroke="#EDE8E3" strokeWidth="4"
                />
                <circle
                  cx="50" cy="50" r="44"
                  fill="none" stroke="#c4a882" strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 44}`}
                  strokeDashoffset={`${2 * Math.PI * 44 * (seconds / 90)}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-light">{seconds}</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={currentGuide.text}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
                className="text-xl font-light text-center text-[#1a1a1a] max-w-xs leading-relaxed"
              >
                {currentGuide.text}
              </motion.p>
            </AnimatePresence>
          </>
        )}
      </div>

      <button
        disabled={!done}
        onClick={onNext}
        className={`w-full py-4 rounded-2xl text-base font-medium transition-all
          ${done
            ? "bg-[#1a1a1a] text-[#F3EEEA] active:scale-95"
            : "bg-[#1a1a1a]/20 text-[#1a1a1a]/40 cursor-not-allowed"
          }`}
      >
        继续
      </button>
    </div>
  );
}

// Step 4: 身体感受后测 + 对比
function Step4({ onNext, before, onSetAfter }: StepProps & { before: BodyState; onSetAfter: (s: BodyState) => void }) {
  const [selected, setSelected] = useState<BodyState>(null);

  return (
    <div className="flex flex-col h-screen bg-[#F3EEEA] px-8 py-16">
      <StepIndicator current={4} total={5} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col justify-center"
      >
        <p className="text-sm text-[#8a7a6a] mb-3">现在</p>
        <h2 className="text-3xl font-light leading-snug mb-10">
          身体感觉<span className="font-medium">有变化吗？</span>
        </h2>

        {/* 前后对比提示 */}
        {before && (
          <div className="bg-[#EDE8E3] rounded-xl px-5 py-4 mb-6 flex items-center gap-3">
            <span className="text-sm text-[#8a7a6a]">刚才</span>
            <span className="font-medium text-sm">{before}</span>
          </div>
        )}

        <div className="space-y-3">
          {(["收缩", "中性", "扩张"] as BodyState[]).map((state) => (
            <button
              key={state}
              onClick={() => setSelected(state)}
              className={`w-full py-4 rounded-2xl text-left px-5 transition-all
                ${selected === state
                  ? "bg-[#1a1a1a] text-[#F3EEEA]"
                  : "bg-[#EDE8E3] text-[#1a1a1a]"
                }`}
            >
              <span className="font-medium">{state}</span>
              <span className="text-sm opacity-60 ml-3">
                {state === "收缩" && "紧、压、沉"}
                {state === "中性" && "平、稳、不确定"}
                {state === "扩张" && "轻、暖、开放"}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      <button
        disabled={!selected}
        onClick={() => onSetAfter(selected)}
        className={`w-full py-4 rounded-2xl text-base font-medium transition-all
          ${selected
            ? "bg-[#1a1a1a] text-[#F3EEEA] active:scale-95"
            : "bg-[#1a1a1a]/20 text-[#1a1a1a]/40 cursor-not-allowed"
          }`}
      >
        继续
      </button>
    </div>
  );
}

// Step 5: 解释刚才发生了什么 + CTA
// 这是转化关键：把体验接上逻辑，再引导进入系统
function Step5({ before, after }: { before: BodyState; after: BodyState }) {
  const navigate = useNavigate();
  const changed = before !== after;

  return (
    <div className="flex flex-col h-screen bg-[#F3EEEA] px-8 py-16">
      <StepIndicator current={5} total={5} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex-1 flex flex-col justify-center"
      >
        {/* 前后对比展示 */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 bg-[#EDE8E3] rounded-xl px-4 py-3 text-center">
            <p className="text-xs text-[#8a7a6a] mb-1">之前</p>
            <p className="font-medium">{before}</p>
          </div>
          <div className="text-[#8a7a6a]">→</div>
          <div className="flex-1 bg-[#1a1a1a] rounded-xl px-4 py-3 text-center">
            <p className="text-xs text-[#F3EEEA]/60 mb-1">现在</p>
            <p className="font-medium text-[#F3EEEA]">{after}</p>
          </div>
        </div>

        <h2 className="text-2xl font-light leading-snug mb-6">
          {changed
            ? "你刚才不是「想通了」。"
            : "注意力回到身体，就是开始。"}
        </h2>

        <div className="space-y-4 text-[#4a3f35] leading-relaxed">
          <p>
            你把自己从旧程序里拉回来了一点点。
          </p>
          <p>
            这不是因为你"努力"了——
            <br />
            是因为你的注意力回到了身体，
            <br />
            旧的自动反应暂时停止了。
          </p>
          <p className="font-medium text-[#1a1a1a]">
            这就是入口。
          </p>
        </div>
      </motion.div>

      <div className="space-y-3">
        <button
          onClick={() => navigate("/signup")}
          className="w-full py-4 bg-[#1a1a1a] text-[#F3EEEA] rounded-2xl text-base font-medium active:scale-95 transition-transform"
        >
          开始完整训练
        </button>
        <button
          onClick={() => navigate("/landing")}
          className="w-full py-4 text-[#4a3f35] text-sm"
        >
          了解更多
        </button>
      </div>
    </div>
  );
}

// 步骤指示器
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all duration-300
            ${i < current ? "bg-[#1a1a1a]" : "bg-[#1a1a1a]/15"}`}
        />
      ))}
    </div>
  );
}

// 主组件：管理步骤状态
export default function Experience() {
  const [step, setStep] = useState(1);
  const [bodyBefore, setBodyBefore] = useState<BodyState>(null);
  const [bodyAfter, setBodyAfter] = useState<BodyState>(null);

  const next = () => setStep((s) => s + 1);

  return (
    <AnimatePresence mode="wait">
      {step === 1 && (
        <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Step1
            onNext={() => next()}
            onSetBefore={(s) => { setBodyBefore(s); next(); }}
          />
        </motion.div>
      )}
      {step === 2 && (
        <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Step2 onNext={next} />
        </motion.div>
      )}
      {step === 3 && (
        <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Step3 onNext={next} />
        </motion.div>
      )}
      {step === 4 && (
        <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Step4
            onNext={next}
            before={bodyBefore}
            onSetAfter={(s) => { setBodyAfter(s); next(); }}
          />
        </motion.div>
      )}
      {step === 5 && (
        <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Step5 before={bodyBefore} after={bodyAfter} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
