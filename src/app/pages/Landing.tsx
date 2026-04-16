import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";

// 营销漏斗结构：痛点 → 原因 → 体验入口 → 系统介绍 → 行动
// 每个 section 对应用户心理的一个阶段，不跳步骤

export default function Landing() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      // 后端 waitlist 接口，暂时用 localStorage 兜底
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      }).catch(() => {
        // 接口未上线时静默失败，不影响用户体验
        localStorage.setItem("waitlist_email", email.trim());
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F3EEEA] text-[#1a1a1a]">

      {/* ───── Section 1: 核心原理入口 ───── */}
      {/* 不打痛点，直接陈述一个原理。懂的人会停下来。 */}
      <section className="min-h-screen flex flex-col justify-center px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-sm tracking-widest text-[#8a7a6a] uppercase mb-8">
            转念
          </p>
          <h1 className="text-4xl font-light leading-tight mb-6">
            情绪不是
            <br />
            <span className="font-medium">在头脑里产生的。</span>
          </h1>
          <p className="text-lg text-[#4a3f35] leading-relaxed max-w-sm">
            它发生在身体里，
            <br />
            在你意识到之前，已经开始了。
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16"
        >
          <div className="w-8 h-[1px] bg-[#8a7a6a]" />
          <p className="text-sm text-[#8a7a6a] mt-4">向下继续</p>
        </motion.div>
      </section>

      {/* ───── Section 2: 情绪链条原理 ───── */}
      {/* 科普情绪是如何在身体里形成的，不做价值判断 */}
      <section className="min-h-screen flex flex-col justify-center px-8 py-20 bg-[#EDE8E3]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-light leading-snug mb-8">
            情绪的形成<br />
            <span className="font-medium">有一条链条。</span>
          </h2>

          <div className="space-y-4 text-[#4a3f35]">
            {[
              { step: "事件发生", desc: "外部刺激进入感知系统" },
              { step: "身体感受", desc: "胸口收紧、腹部下沉——发生在意识之前" },
              { step: "判断与评价", desc: "头脑对感受做出解释" },
              { step: "情绪", desc: "感受 + 判断 = 我们称之为「情绪」的东西" },
              { step: "行为反应", desc: "自动启动的应对方式" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-5 h-5 rounded-full bg-[#c4a882]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-[#8a7a6a]">{i + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-sm text-[#1a1a1a]">{item.step}</p>
                  <p className="text-sm text-[#8a7a6a] mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-[#4a3f35] leading-relaxed border-l-2 border-[#c4a882] pl-4">
            大多数训练方法只作用于最后两个环节。
            <br />
            身体感受这一层，通常被忽略了。
          </p>
        </motion.div>
      </section>

      {/* ───── Section 3: 免费体验入口 ───── */}
      {/* 关键转化点：让她用身体感受一次，比任何文案都有力 */}
      <section className="min-h-screen flex flex-col justify-center items-center px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-sm"
        >
          <div className="w-16 h-16 rounded-full bg-[#c4a882]/20 flex items-center justify-center mx-auto mb-8">
            <div className="w-8 h-8 rounded-full bg-[#c4a882]/40" />
          </div>

          <h2 className="text-3xl font-light mb-4">
            先感受一次。
          </h2>
          <p className="text-[#4a3f35] leading-relaxed mb-10">
            不用报名，不用付费。
            <br />
            只需要 3 分钟，你会知道
            <br />
            这和你之前试过的一切有什么不同。
          </p>

          <button
            onClick={() => navigate("/experience")}
            className="w-full py-4 bg-[#1a1a1a] text-[#F3EEEA] rounded-2xl text-base font-medium
                       active:scale-95 transition-transform"
          >
            开始免费体验
          </button>
          <p className="text-xs text-[#8a7a6a] mt-4">约 3 分钟 · 无需注册</p>
        </motion.div>
      </section>

      {/* ───── Section 4: 训练系统介绍 ───── */}
      {/* 从"体验一次"切到"长期训练系统"，卖的是结果路径，不是课程内容 */}
      <section className="min-h-screen flex flex-col justify-center px-8 py-20 bg-[#EDE8E3]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-light leading-snug mb-2">
            身体感受
          </h2>
          <h2 className="text-3xl font-medium leading-snug mb-10">
            是可以被训练的。
          </h2>

          <p className="text-[#4a3f35] leading-relaxed mb-10">
            神经系统有可塑性。
            <br />
            重复接触同一个刺激并做出不同的响应，
            <br />
            身体会形成新的反应路径。
          </p>

          <div className="space-y-4">
            {[
              { label: "身体觉察", desc: "识别感受在哪里、是什么性质（扩张/收缩/中性）" },
              { label: "呼吸与激活", desc: "通过垂直呼吸和脉轮激活调节神经系统状态" },
              { label: "声音打断", desc: "发出声音可以物理性地打断旧程序正在执行的路径" },
              { label: "累积记录", desc: "追踪身体感受的变化轨迹，让变化变得可见" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex gap-4 items-start p-4 bg-[#F3EEEA] rounded-xl"
              >
                <div className="w-2 h-2 rounded-full bg-[#c4a882] mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-[#4a3f35] text-sm mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ───── Section 5: 候补名单收集 ───── */}
      {/* 用户到这里已经走完完整说服链，现在承接流量 */}
      {/* 不要求立刻付费，先留住她——邮件是最低摩擦的转化动作 */}
      <section className="min-h-screen flex flex-col justify-center items-center px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="max-w-sm w-full"
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-3xl font-light mb-2">
                  想第一个知道
                </h2>
                <h2 className="text-3xl font-medium mb-6">
                  开放的时候？
                </h2>
                <p className="text-[#4a3f35] leading-relaxed mb-8">
                  留下邮箱，正式开放时
                  <br />
                  你会第一个收到消息。
                </p>

                <form onSubmit={handleWaitlist} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="你的邮箱"
                    required
                    className="w-full px-5 py-4 bg-[#EDE8E3] rounded-2xl text-base outline-none
                               placeholder:text-[#8a7a6a] focus:bg-[#E5DED7] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-[#1a1a1a] text-[#F3EEEA] rounded-2xl text-base font-medium
                               active:scale-95 transition-all disabled:opacity-50"
                  >
                    {submitting ? "提交中…" : "加入候补名单"}
                  </button>
                </form>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex-1 h-[1px] bg-[#1a1a1a]/10" />
                  <span className="text-xs text-[#8a7a6a]">或者</span>
                  <div className="flex-1 h-[1px] bg-[#1a1a1a]/10" />
                </div>

                <button
                  onClick={() => navigate("/experience")}
                  className="w-full py-4 mt-3 border border-[#1a1a1a]/15 text-[#4a3f35] rounded-2xl text-sm
                             active:scale-95 transition-transform"
                >
                  先体验 3 分钟
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="py-8"
              >
                <div className="w-16 h-16 rounded-full bg-[#c4a882]/20 flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#c4a882]/60" />
                </div>
                <h2 className="text-2xl font-light mb-4">收到了</h2>
                <p className="text-[#4a3f35] leading-relaxed">
                  开放的时候你会第一个知道。
                  <br />
                  在那之前，先去体验一下。
                </p>
                <button
                  onClick={() => navigate("/experience")}
                  className="w-full py-4 mt-8 bg-[#1a1a1a] text-[#F3EEEA] rounded-2xl text-base font-medium
                             active:scale-95 transition-transform"
                >
                  开始免费体验
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-xs text-[#8a7a6a] mt-8">转念 · Love Ego AI</p>
        </motion.div>
      </section>

    </div>
  );
}
