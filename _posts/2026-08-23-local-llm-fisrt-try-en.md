---
title: "Trying Out Local LLMs"
category: coding
tags: [LLM, Pi, Qwen, Gemma]
lang: en
---

I bought a used MacBook Pro (M4 Pro, 24GB RAM, full chip). A while back there was a trend of running local AI on Mac Minis, so I decided to finally give it a try myself.

What I wanted to do with it:

1. Simple meeting notes and memo summarization, speech-to-text via voice recognition, etc.
2. Basic web search and paper search
3. Agentic coding (with token savings)
4. Analysis of experimental results
5. Deriving new hypotheses based on the entered experimental results combined with literature search findings

After using it for about a month, I'll get straight to the conclusion: commercial AI (ChatGPT or Claude) is unconditionally better. It's overwhelmingly faster, more detailed, and more accurate than local models. But local models do have value in that they're toys you can customize however you want. The fact that my data-related content never leaves my machine is a bonus.

The one area where local AI models are somewhat useful is saving token usage. As someone on the $20 Claude subscription, it stings to watch tokens evaporate every time I do agentic coding. A loop where Claude handles the big tasks first, then delegates coding instructions to the local AI, and afterward the Claude model re-evaluates and supervises those results — that's probably the only somewhat useful setup from a cost-saving perspective. But even that is completely useless in terms of saving time; it's more efficient to just upgrade your subscription.

The local models I used were relatively small ones (<14 GB). The unified memory is 24GB, but due to system overhead and other resource factors, only about 18GB of VRAM is practically usable. Not only model size matters — the context window size used during conversations and task processing also matters, which makes it even harder to use larger models.

To run local models, I downloaded and ran standard GGUF quantized models via **LM Studio**, and did agentic coding through the **Pi agent**.

The main models I tried are as follows:

1. Qwen3.5 9B (Unsloth, Q8_0, 9.53 GB)
2. Gemma 4 12B Instruct QAT (Unsloth, UD-Q4_K_XL, 6.72GB)
3. Qwen3.6-36B-A3B (Unsloth, UD-IQ3_XXS, 14.07GB)
4. Qwen3.8-27B (Unsloth, UD-IQ3_XXS, 10.93 GB)

## Agentic Code Test

Running conditions:

- LM Studio
- Context Length 64K
- No KV cache quantization.
- Pi agent

I asked the models above to generate a virtual mouse body weight dataset. I instructed them to create R code and a CSV file.

```
Make R code and csv file. 1. Mouse body weight (weighed once-a-week, for 15 weeks). 2. Chow diet group: BW starts from 20, ends in 25, median. 3. High Fat Diet group: BW starts from 20, ends in 38-40, median. The increase is logarithm, but not so heavily. n=8/group. Add fluctuation in the data. Filename: mouse_bw.r, mouse_bw.csv
```

![Pi agent is runnig Qwen3.8 27b iq3_xxs](/image/posts/2026-08-23-local-llm-fisrt-try/01_pi_agent.png)

> I can just **run** a 27B dense model, but it's not fast.

The agentic coding results are as follows.

| Model                      | Time, Token               | Note                                                         |
| -------------------------- | ------------------------- | ------------------------------------------------------------ |
| Qwen3.5-9B Q8              | 11 min 58 sec, 43.0%/64K token | Wrote code and ran it, then kept finding problems and fixing them in a loop. |
| Gemma 4-12B-IT-QAT Q4_K_XL | 1 min 44 sec, 6.9%/64K         | Initially only generated the code without creating the CSV. After asking for the CSV to be made, it produced the output. |
| Qwen3.6-35B-a3B IQ3_XXS    | 55 sec, 8.0%/64K token      | Overwhelmingly faster than the two models above, and produced the most plausible results. |
| Qwen3.8-27B IQ3_XXS        | 6 min 5 sec, 11.6%/64K         | The heaviest computation — the Mac fan spun up hard. A slow model that generates only about 10 tokens/s for simple chatting. |

![Agentic code test](/image/post/2026-08-23-local-llm-fisrt-try/01_rplot.svg)

> Data Visualisation with R 4.6.1, `ggplot2 4.0.3`, `patchwork 1.3.2`

Even though I gave a very simple task, the Qwen3.5-9B model had way too much trial-and-error. The realistically usable one is the Qwen3.6-35B MoE model. The Qwen3.8-27B model is at the level of "usable if you try it."

## Local Model Web Search

Local models can do web search, too. Using a search tool like `Duck Duck Go` makes data investigation possible, but occasionally when there are no search results, an infinite loop occurs where it keeps searching until results come out. This issue tends to improve with larger models and smaller quantization (= heavier model files).

I deliberately asked a question that could induce hallucination and checked the search results.

`Search for and analyze the Soviet–Korean War that took place in 2026`

![Qwen3.8 27b model. web searching non-exsit war](/image/post/2026-08-23-local-llm-fisrt-try/02_web_search.png)

> You can see it correctly recognizing that no results exist and stopping the search.

Finally, I tried translating this post with a local model. Since Gemma 4 is said to be good at Korean, I first attempted translation with that model, but the quality wasn't good. This translation was done with the Qwen3.8-27B model instead.

## Closing Thoughts

At first, full of curiosity, I had all sorts of plans for running local models on the M4 Pro chip — but reality is harsh. This awkward, in-between model seems best reserved for when you really need to run top-secret data locally. Otherwise, it's something I'll probably only use as a toy to play with, unless tokens suddenly become extremely scarce.
