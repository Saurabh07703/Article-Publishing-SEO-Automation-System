"use client";

import { useState, useEffect } from "react";
import { submitArticle } from "@/lib/api";
import { Loader2, CheckCircle, AlertCircle, Send, Heading, AlignLeft, LayoutGrid, User, Calendar, Tag } from "lucide-react";

export default function ArticleSubmissionForm() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    author: "",
    published_at: "",
    tags: "",
  });

  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [articleId, setArticleId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setIdempotencyKey(crypto.randomUUID());
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      const result = await submitArticle(payload, idempotencyKey);
      
      setStatus("success");
      setArticleId(result?.article_id || "ARTICLE_UUID_PLACEHOLDER");
      setIdempotencyKey(crypto.randomUUID()); // Reset for next submission
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "Failed to submit article");
    }
  };

  const resetForm = () => {
    setFormData({ title: "", content: "", category: "", author: "", published_at: "", tags: "" });
    setStatus("idle");
    setArticleId("");
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-slate-200 p-6 md:p-12 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text drop-shadow-sm">
            Publishing Portal
          </h1>
          <p className="text-slate-400 text-lg">Seamlessly ingest content into the SEO Automation Pipeline.</p>
        </div>

        <div className="relative group">
          {/* Subtle glow behind form */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative bg-[#11111a] backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-16 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Article Submitted!</h2>
                <p className="text-slate-400 mb-6 text-center max-w-md">
                  Your article has been successfully ingested and is queued for SEO processing.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 mb-8 flex flex-col items-center">
                  <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-1">Article ID</span>
                  <code className="text-indigo-300 font-mono text-lg">{articleId}</code>
                </div>
                <button
                  onClick={resetForm}
                  className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all"
                >
                  Submit Another Article
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {status === "error" && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 animate-in fade-in slide-in-from-top-4">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Submission Failed</h4>
                      <p className="text-sm mt-1 opacity-80">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Heading className="w-4 h-4 text-indigo-400" /> Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full bg-white/5 border ${errors.title ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/10 focus:ring-indigo-500/20'} rounded-xl px-4 py-3 outline-none focus:ring-4 focus:border-indigo-400 transition-all`}
                    placeholder="Enter an engaging title..."
                  />
                  {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <AlignLeft className="w-4 h-4 text-purple-400" /> Content <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={8}
                    className={`w-full bg-white/5 border ${errors.content ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/10 focus:ring-purple-500/20'} rounded-xl px-4 py-3 outline-none focus:ring-4 focus:border-purple-400 transition-all resize-y`}
                    placeholder="Write your amazing article here..."
                  />
                  {errors.content && <p className="text-red-400 text-xs mt-1">{errors.content}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4 text-pink-400" /> Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 focus:ring-4 focus:ring-pink-500/20 focus:border-pink-400 rounded-xl px-4 py-3 outline-none transition-all"
                      placeholder="e.g. Technology, AI..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-400" /> Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-400 rounded-xl px-4 py-3 outline-none transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-400" /> Published At
                    </label>
                    <input
                      type="date"
                      name="published_at"
                      value={formData.published_at}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-400 rounded-xl px-4 py-3 outline-none transition-all text-slate-300 [color-scheme:dark]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-cyan-400" /> Tags
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 rounded-xl px-4 py-3 outline-none transition-all"
                      placeholder="seo, nextjs, marketing (comma separated)"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full group relative overflow-hidden bg-white text-black font-semibold rounded-xl px-4 py-4 flex items-center justify-center gap-2 transition-all hover:bg-slate-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit for Processing
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
                    Protected by Idempotency Key <code>{idempotencyKey.slice(0, 8)}</code>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
