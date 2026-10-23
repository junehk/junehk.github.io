---
title: "Coding and Paper Work with Strata + Qwen3.8 Flash Next"
category: coding
tags: [LLM, Strata, OpenCode, Qwen, Qwen3.8-Flash-Next]
lang: en
---

It is common consensus in the LLM community that the larger the model, the better it performs across tasks. For someone like me who barely owns a gaming PC, Qwen3.8 27B (3-bit quantized) was the limit of what counted as a workhorse LLM. Recently, however, a GitHub project has opened the door for ordinary people to run LLMs well over tens of GBs. The protagonist is [Strata](https://github.com/Niko1221/Strata), a project that has reached 31K stars as of 2026-10-24. Through this project, I can now use the quantized Qwen3.8 Flash Next, a large model weighing over tens of GBs.

![Strata GitHub repository](/images/post/2026-10-24-local-llm-code-work/01_strata_github.webp)

> Source: [Niko1221/Strata Repo](https://github.com/Niko1221/Strata)

## Before Strata, the Models I Used

On the M4 Pro, the best models I could reasonably use with RAG were [Qwen3.8 27B 3Bit MLX-TextOnly](https://huggingface.co/lukaskremla/Qwen3.8-27B-3bit-MLX-TextOnly) (~11.79 GB) or [Qwen3.8 27B GSQ-RCO GGUF](https://huggingface.co/ISTA-DASLab/Qwen3.8-27B-GSQ-RCO-GGUF) (IQ3_XXS, ~10.4 GB) running on my desktop (RTX 5070 Ti, 16GB VRAM). These were already respectable models — enough to be called the minimum bar for agentic coding. Still, the larger the model, the lower the error rate and the more likely it is to work smartly. Qwen3.8 Flash Next is widely said to rival OpenAI's GPT-6 Luna at its baseline quantization level.

![Qwen3.8 Flash Next performance comparison](/images/post/2026-10-24-local-llm-code-work/02_artificial_analysis.webp)

> Source: [Artificial Analysis](https://artificialanalysis.ai/models/qwen3-8-flash-next)

Of course, the unquantized original BF16 model is about 360 GB, and even the aggressively quantized [GSQ-RCO-IQ3_XXS](https://huggingface.co/ISTA-DASLab/Qwen3.8-Flash-Next-GSQ-RCO-GGUF) is still a massive 76 GB. Strata is what makes such massive models runnable on ordinary computers with limited VRAM. Its real significance is that a machine with merely an RTX 3060 (12GB VRAM), given 32~48 GB of system RAM, can run these giant models at genuinely usable speeds.

## Installing Strata

Installation was simple. I downloaded the IQ3_XXS model I intended to run on my RTX 5070 Ti (16GB VRAM) + 64GB system RAM setup in advance, then simply picked one of the free models in [OpenCode](https://opencode.ai/) and asked it to install Strata.

![Asking OpenCode to install Strata](/images/post/2026-10-24-local-llm-code-work/03_strata_setup.webp)

Beyond the prompt provided on the Strata GitHub page, I only had to tell it the location of the model I had already downloaded, and it handled the rest on its own. Then, just by asking the free AI model to connect OpenCode to the running Strata instance, a Strata + OpenCode workflow was ready to use.

## Working Speed and Results

Prefill ran at around 2,000~2,400 t/s and token generation (decoding) at about 70~80 t/s — personally, a very comfortable working speed. At the time, this Strata instance was tidying up several R scripts and drafting the statistical methods for figure legends on its own initiative.

![Tidying R code and drafting statistical descriptions](/images/post/2026-10-24-local-llm-code-work/04_strata_r_work.webp)

## Limits That Showed Up in Long Contexts

Because this is an IQ3_XXS quantized model, once the context size crosses 200K, it often mixes in Japanese and Hanja instead of Korean, my primary language. That said, checking the final deliverables — written in English — showed it works well enough to be used without issues.

![Language mixing as the context grows](/images/post/2026-10-24-local-llm-code-work/05_strata_language_mix.webp)

## My Paper Work Pipeline

In addition, the Strata–Qwen3.8FN pipeline I use these days summarizes around 100 papers on its own; I then ask it to extract the citations it thinks "I will need," and use them to automatically cite while writing the paper. Claude Sonnet 5.5 serves as the main AI, while Strata-QwenFN IQ3_XXS (since I run it on an RTX 3060 at the office, prefill is about 400~500 t/s and decoding about 40~44 t/s) works as the groundwork AI that pre-organizes the papers. Summarizing a single paper takes only around 10K tokens, so saving tokens this way is quite worthwhile. (The fact that running it on local AI is just plain fun is a bonus.)

## How I Use It Now

I currently use it in two ways: running it locally at the office (the RTX 3060 machine), or connecting from outside via Tailscale to my home computer and using Strata–QwenFN from my MacBook. Tailscale is a service that ties your personal devices into a single virtual private network, so even while out, I can reach the desktop at home as if I were on my home's local network.

## Closing Thoughts

Running a model of over 76 GB on an ordinary desktop makes me feel that local LLMs are heading in a rather interesting direction.
