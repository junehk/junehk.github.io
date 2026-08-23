---
title: "Getting Started with Blogging"                                                          
category: coding                                                                                
tags: [Jekyll, Claude Code]                                                                     
lang: en                                                                                        

---

I recently picked up a used Macbook Pro (M4 Pro 24GB RAM, Full chip). Since running Local AI on Mac Mini was popular a while ago, I decided to try it out now.

What I want to do:

1. Summarize simple meeting minutes and notes, Speech-to-Text via voice recognition, etc.
2. Simple web search, academic paper search.
3. Agentic Coding (Token saving).
4. Experimental result analysis.
5. Deriving new hypotheses based on input experimental results and academic paper search results.

I've been using it for about a month, and to get straight to the point: commercial AI (ChatGPT, Codex, Claude, Claude Code) is absolutely correct. They are overwhelmingly faster, more detailed, and more accurate than local models. However, local models have meaning as "toys" that I can customize exactly how I want. Plus, my data doesn't go outside.

The most useful part of local AI models is saving on token usage. As someone who subscribes to Claude for $20, it's painful to see tokens evaporate every time I do Agentic coding. A viable way to save coins would be to split large tasks in Claude first, give coding instructions to the Local AI, and then have the Claude model evaluate and supervise the results in a loop. However, this is not useful for saving time at all; it's just more efficient if you strengthen your subscription.

The local models I used are relatively small (<14 GB). Although the unified memory size is 24GB, only about 18GB of VRAM is practically available due to system operation and other resource factors. Since context window size during conversation or task processing is also important, it's difficult to use larger models.

To run local models, I downloaded and chatted with general GGUF quantized models through **LM Studio**, and managed MLX models using **oMLX**.

The representative models I used are as follows:

1. Qwen3.5 9B (Unsloth, Q4_K_S, 5.39GB; Q8_0, 9.53 GB)
2. Gemma 4 12B Instruct QAT (Unsloth, UD-Q4_K_XL, 6.72GB)
3. Qwen3.6-36B-A3B (Unsloth, UD-IQ3_XXS, 14.07GB)
4. Qwen3.8-27B (Unsloth, UD-IQ3_XXS, 10.93 GB; Leonsarmiento 3bit-mtp-mlx, 13.0 GB)

## 1. Qwen3.5 9B (Q8_0)

This is the most versatile model to use. Since it's 9B, it runs smoothly on an M4 Pro chip.

The Context Length is 60,160 tokens, and I ran it without KV cache quantization.

![01 Qwen3.5 9b hi prompt](/images/post/2026-08-23-local-llm-fisrt-try/01_qwen3.5-9b_hi.png)

It outputs at a speed of about 25 tokens/sec for simple prompts. The performance is decent, and it handles simple web searches comfortably.

![02 Qwen3.5 9b stock search](/images/post/2026-08-23-local-llm-fisrt-try/02_qwen3.5-9b_stock_search.png)

Reflecting that August 23, 2026, is a Sunday, I searched for brief news about the 21st (Friday), which was before the holiday. (Used LM Studio and `vadimfedenko/duck-duck-go-reworked` tool).

Next, I ordered a more complex task: *analyzing clinical papers on GLP-1 agonists* (used `altra/web-search` tool).

![03 Qwen3.5 9b GLP-1 search](/images/post/2026-08-23-local-llm-fisrt-try/03_qwen3.5-9b_glp1.png)

The initial thought process includes some Chinese mixed in.

![04 Qwen3.5 9b GLP-1 search](/images/post/2026-08-23-local-llm-fisrt-try/04_qwen3.5-9b_glp1.png)

Although the number of tokens used reached 28k, it eventually produced results. If there are no search results from the search plugin, the model tends to keep trying to search. In such cases, the token usage can increase without a break. (There were also cases where models with large sizes but heavy quantization, like Qwen3.6-27b IQ2_XXS, kept repeating searches until they hit the token limit.)

As for references, since it provides information based on search results, there is less worry about hallucinations in this part. Compared to the time when searching for papers through ChatGPT three years ago—when it would spit out documents that didn't exist in the world—it feels like AI models have advanced so much that it's a stark contrast.

Next, I tested whether Agentic Coding was useful. I asked it to write code to randomly generate mouse weight data. The local model server was run on LM Studio, and the analysis data generation was performed through the Pi agent (you can think of the Pi agent as a terminal program similar to Claude Code).

![05 pi agent](/images/post/2026-08-23-local-llm-fisrt-try/05_qwen3.5-9b_pi.png)

Using an appropriate prompt, I created code to write random mouse weight data.

![06 r code generated](/images/post/2026-08-23-local-llm-fisrt-try/06_qwen3.5-9b_rcode.png)

The written code is very long and messy. I hoped to create a median with noise added by week and use the `rnorm()` function to generate data, but it took a very long time and consumed a lot of tokens (24k tokens). When I asked it to run the generated code, it caught errors, but it also took more tokens and was slow. (This is another point where using commercial AI is much better for coding.)

![07 qwen3.5.-9b is not sufficient for agentic coding](/images/post/2026-08-23-local-llm-fisrt-try/07_qwen3.5-9b_pi.png)

I clearly told it to increase the weight up to 45g with a high-fat diet (HFD), but it seems to have modified the code strangely.

![08 Rplot generataed](/images/post/2026-08-23-local-llm-fisrt-try/08_Rplot.png)

Additionally, I asked Qwen3.5-9b if this data showed appropriate weight gain, but it failed to catch the part where the high-fat diet group gained *less* weight.

**Conclusion: The Qwen3.5-9b model is usable for basic search functions but is not suitable for agentic coding or deep reasoning.**

## 2. Gemma 4 12B IT QAT (UD-Q4_K_XL)

This time, it's the Gemma 4 12B model. It is known to be proficient in Korean compared to other models. However, since I only wanted to test Agentic Coding, I wrote and executed prompts in English.

- Code for creating a virtual mouse weight dataset
- KV cache not quantized (Context window 60k)

![09 gemma 4 coding](/images/post/2026-08-23-local-llm-fisrt-try/09_gemma4_code_generation.png)

This time, less tokens were used and the code produced was less messy.

![10 gemma 4 rplot](/images/post/2026-08-23-local-llm-fisrt-try/10_Rplot_gemma4.png)

The appropriate temporary data I requested was also created.

## Qwen3.6-35b-a3b-mtp (UD-IQ3_XXS)

This is a MoE model from the latest Qwen3.6 series. This time, I ordered a slightly more difficult Agentic coding task.

- Mouse weight increases sigmoidally (doesn't increase well at first, then linearly in the middle, and seems to saturate at the end, but not completely saturated—some linear growth should still remain.)

![11 qwen3.6 35b pi agent](/images/post/2026-08-23-local-llm-fisrt-try/11_qwen3.6_35b_pi.png)

Since it's a model that activates only 3B out of the total 35B parameters, its generation speed is the fastest among today's experiments.

![12 qwen 3.6 35b rplot](/images/post/2026-08-23-local-llm-fisrt-try/12_qwen3.6_35b_rplot.png)

The intended graph is created.

## Qwen3.8 27B

This is a brand new model. According to [Artificial analysis](https://artificialanalysis.ai/models/qwen3-8-27b), it's said to have intelligence comparable to the OpenAI GPT-5.6 Luna model.

![13 AA results](/images/post/2026-08-23-local-llm-fisrt-try/13_AA_qwen3.8_27b.png)

While there are many reviews saying it's an intelligence score obtained by repeatedly fixing things in a reasoning environment with the `xhigh` option, it is highly evaluated as a very strengthened model for coding.

The usage conditions are as follows:

- Qwen3.8-27B-UD-IQ3_XXS.gguf (Unsloth, UD3.0, 10.93GB)
  - LM Studio, KV cache Quant Q8_0, Context Length 64k
- Qwen3.8-27B MLX 3bit MTP (Leonsarmiento, 13.04GB)
  - oMLX Context size 32K

First, I must state that the 27B dense model is not a model suitable to run on a weak GPU like the M4 Pro. Even for a simple `Hi` prompt, it can drop to 10-14 tokens/s. Also, while the Gold standard quantized model Q4_K_M (16.5 GB) can be executed, it has strong Context Length limitations, making it difficult to use in practice.

![14 qwen3.8 hi](/images/post/2026-08-23-local-llm-fisrt-try/14_qwen3.8_hi.png)

The biggest problem with searching through local models is *entering an infinite loop of searching when there are no results*. The smaller the model size or the heavier the quantization, the more likely it is to fall into an infinite search loop (I had experience where the Tool calling function was unsatisfactory in Qwen3.6-27b_iq3_xxs). I decided to check if these models were okay. (Used LM Studio and `vadimfedenko/duck-duck-go-reworked` tool)

![15 qwen3.8 hallucination search test](/images/post/2026-08-23-local-llm-fisrt-try/15_qwen3.8_hallucination_test.png)

Although it was a one-time test, it seems to catch it better than expected. The token usage also seems appropriately controlled at 1664 tokens.

![16 oMLX qwen3.8 quite faster](/images/post/2026-08-23-local-llm-fisrt-try/16_oMLX_qwen3.8.png)

I tried a slightly complex coding instruction using the oMLX system by running the Qwen3.8-27b 3bit MLX version with default oMLX settings and inputting a `Hi` prompt. It seems to be faster than the LMstudio + IQ3_XXS GGUF version.

![17 oMLX tetris](/images/post/2026-08-23-local-llm-fisrt-try/17_oMLX_tetris.png)

In terms of speed, I tried a slightly complex coding instruction using the oMLX system. I asked it to make Tetris, but it failed because memory usage was full. It seems that more KV cache adjustment or additional adjustments are needed.

![18 translation pi](/images/post/2026-08-23-local-llm-fisrt-try/18_gemma4_translate.png)

Finally, I instructed it to translate this markdown file into English. In the Qwen3.8 oMLX-Pi environment, it failed due to the same memory problem. Since it's a Korean-to-English translation, I used the Gemma 4 12b model for the translation.

## Conclusion

I was full of interest at first and had many thoughts about running local models using the M4 Pro chip, but reality is harsh. This "useless yet useful" (gyereuk) model seems better suited for when you need to run truly top-secret data. Unless tokens suddenly become very scarce, I think it'll only be used as a toy to play with.
