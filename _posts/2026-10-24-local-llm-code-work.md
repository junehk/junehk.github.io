---
title: "Strata + Qwen3.8 Flash Next로 코딩·논문 작업하기"
category: coding
tags: [LLM, Strata, OpenCode, Qwen, Qwen3.8-Flash-Next]
lang: ko
---

큰 LLM 모델일수록 여러 작업에 쓰기 좋다는 것이 LLM 커뮤니티의 중론이다. 게임용 컴퓨터나 겨우 갖춘 필자에게 작업용 LLM의 입문이란 Qwen3.8 27B (3비트 양자화 모델)가 그 한계였다. 그러나 최근, 일반인들에게도 수십 GB가 넘는 LLM을 돌릴 수 있는 길을 연 GitHub 프로젝트가 나타났다. 2026-10-24 기준 31K Star를 받은 [Strata](https://github.com/Niko1221/Strata)라는 프로젝트가 그 주인공이다. 이 프로젝트를 통해 수십 GB가 넘는 대형 모델인 Qwen3.8 Flash Next 양자화 모델을 사용할 수 있게 되었다.

![Strata GitHub 저장소](/images/post/2026-10-24-local-llm-code-work/01_strata_github.webp)

> 출처: [Niko1221/Strata Repo](https://github.com/Niko1221/Strata)

## Strata 이전, 사용했던 모델들

M4 Pro에서 RAG로 그나마 이용할 만했던 모델은 [Qwen3.8 27B 3Bit MLX-TextOnly](https://huggingface.co/lukaskremla/Qwen3.8-27B-3bit-MLX-TextOnly) (약 11.79GB)이거나, 데스크톱 (RTX 5070 Ti, 16GB VRAM)에서 돌릴 만한 [Qwen3.8 27B GSQ-RCO GGUF](https://huggingface.co/ISTA-DASLab/Qwen3.8-27B-GSQ-RCO-GGUF) (IQ3_XXS 모델, 약 10.4GB) 정도가 최선이었다. 이들도 Agentic Coding의 최소치라 불릴 정도로 준수한 모델이다. 그러나 모델이 클수록 오류 확률은 낮아지고, 똑똑하게 일을 할 확률은 높아진다. Qwen3.8 Flash Next 모델은 기본 양자화 기준으로 OpenAI의 GPT-6 Luna와 견줄 만하다는 평이 자자하다.

![Qwen3.8 Flash Next 성능 비교](/images/post/2026-10-24-local-llm-code-work/02_artificial_analysis.webp)

> 출처: [Artificial Analysis](https://artificialanalysis.ai/models/qwen3-8-flash-next)

물론 양자화가 없는 원본 BF16 모델은 약 360GB이며, 꽤나 강력한 양자화 모델인 [GSQ-RCO-IQ3_XXS](https://huggingface.co/ISTA-DASLab/Qwen3.8-Flash-Next-GSQ-RCO-GGUF)만 하더라도 76GB의 거대한 모델이다. Strata는 VRAM이 부족한 일반인의 컴퓨터에도 이런 거대한 모델이 돌아가게 만든 프로젝트이다. RTX 3060 (12GB VRAM) 정도의 컴퓨터에서 시스템 RAM만 32~48GB로 충분하면 이런 거대 모델을 꽤나 쓸 만한 속도로 돌려 쓸 수 있게 한 것에 의의가 있다.

## Strata 설치

설치법은 간단했다. RTX 5070 Ti (16GB VRAM) + 64GB 시스템 RAM 구성에서 돌릴 IQ3_XXS 모델을 미리 다운로드해 둔 다음, [OpenCode](https://opencode.ai/ko)의 무료 모델 중 하나를 골라서 Strata를 설치해 달라고 하기만 하면 된다.

![OpenCode로 Strata 설치 요청](/images/post/2026-10-24-local-llm-code-work/03_strata_setup.webp)

Strata GitHub 페이지에 있는 프롬프트에 추가로, 미리 다운로드해 둔 모델의 위치 정도만 알려주니 알아서 잘 설치해 준다. 추가로 OpenCode가 실행 중인 Strata를 연결할 수 있게 해 달라고만 무료 AI 모델에 요청하면, Strata + OpenCode 활용이 가능하다.

## 작업 속도와 결과

Prefill은 2000~2400 t/s 정도, 토큰 생성 (Decoding)은 약 70~80 t/s 정도로 개인적으로 매우 쾌적한 작업 속도를 보여 주었다. 당시 이 Strata는 여러 R 코드를 정리하고 "알아서 Figure legend용 통계 처리 기법을 서술해 달라"고 작업시킨 상태였다.

![R 코드 정리·통계 서술 작업 수행 중](/images/post/2026-10-24-local-llm-code-work/04_strata_r_work.webp)

## 긴 Context에서 드러난 한계

IQ3_XXS 양자화 모델이다 보니 Context 사이즈가 200K를 넘어감에 따라 주 언어인 한국어 말고 일본어·한자 혼입이 종종 발생한다. 그러나 영어로 된 최종 작업물을 확인해 보니 문제없이 쓸 만한 정도로 잘 작동한다.

![Context가 길어지며 나타난 언어 혼입 현상](/images/post/2026-10-24-local-llm-code-work/05_strata_language_mix.webp)

## 논문 작업 파이프라인

추가적으로 요즘 사용하는 Strata–Qwen3.8FN 작업 파이프라인은 100여 편의 논문을 알아서 요약해 주고, '내가 필요할 것'이라 생각한 인용 부분을 뽑아 달라고 한 뒤, 그것들을 바탕으로 논문 작성에 자동 인용하도록 하고 있다. Claude Sonnet 5.5를 메인 AI로, Strata-QwenFN IQ3_XXS (사무실에서는 RTX 3060으로 돌리는 관계로 Prefill은 400~500 t/s, decode는 40~44 t/s 정도)가 논문을 미리 정리하는 밑 작업 AI로 활용 중이다. 논문 한 편 요약만 하더라도 10K token 내외를 사용하니, 이 부분을 절약하는 것도 나름 쏠쏠하다고 생각한다. (로컬 AI로 하는 것 자체가 재미있다는 것은 덤이다.)

## 지금 사용 방식

지금 사용 방식은 두 가지다. 사무실에서 로컬로 돌리거나 (RTX 3060 머신), 외부에서는 Tailscale 등으로 집컴퓨터에 접속해 MacBook에서 Strata–QwenFN을 활용하는 방식이다. Tailscale는 개인 디바이스들을 하나의 가상 사설망으로 묶어 주는 서비스로, 외출 중에서도 집에 있는 데스크톱에 집 안 로컬 네트워크에 접속하듯 연결할 수 있다.

## 마치며

76GB가 넘는 모델을 일반 데스크톱에서 돌린다는 것 자체가, 로컬 LLM의 방향이 꽤 재미있는 쪽으로 가고 있음을 느끼게 한다. 
