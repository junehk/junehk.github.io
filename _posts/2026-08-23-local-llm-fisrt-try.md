---
title: "Local LLM 경험하기"
category: coding
tags: [LLM, Pi, Qwen, Gemma]
lang: ko
---

중고로 Macbook Pro (M4 Pro 24GB RAM, Full chip)를 업어왔다. 그리고 한 참 전에 맥미니로 Local AI를 돌리는 것이 유행했었는데, 이제와서 한 번 따라해보기로 했다.

하고싶은 것: 

1. 간단한 회의록 및 메모 요약, 음성인식을 통한 Speech-to-Text 등.
2. 간단한 웹 검색, 논문 검색
3. Agentic Coding (Token 절약)
4. 실험 결과 분석
5. 입력된 실험 결과들을 기반으로 하고 논문 검색한 결과들을 통해 새로운 가설 도출

약 1달 정도 이용해봤고, 결론부터 말하면 상용 AI (ChatGPT, Claude)가 무조건 옳다. 로컬모델에 비해 압도적으로 빠르고 상세하며 정확하다. 하지만 로컬모델은 내가 원하는 데로 커스텀하는 장난감이라는 측면에서 의미가 있다. 내 데이터 관련 내용들이 외부로 안나가는 것은 덤.

로컬 AI 모델이 그나마 쓸만한 부분은 토큰 사용량 절약 측면이다. Claude $20 구독을 하는 입장에서는 Agentic coding을 할 때마다 토큰이 증발하는 것이 눈에 밟힌다. Claude에서 큰 일감들을 우선 나누고, Local AI에게 코딩 지시, 이후 Claude모델이 다시 그 결과를 평가, 감독하는 루프가 코인 절약 측면에서 그나마 쓸만한 부분일 것이다. 단, 이것도 시간 절약 측면에서는 전혀 쓸모 없고, 그냥 구독을 강화하는 것이 효율적이다.

사용한 로컬모델들은 비교적 작은 (<14 GB) 크기의 모델들이다. 통합메모리 크기가 24GB이지만, 시스템 운영 등의 자원 요소 때문에 실질적으로는 18GB VRAM정도만 이용 가능하다. 모델크기 뿐만 아니라, 대화나 작업 처리 과정에서 사용하는 Context window size또한 중요하기 때문에 더욱 크기가 큰 모델을 이용하기 어렵다.

로컬 모델을 돌리기 위해서 일반적인 GGUF 양자화 모델들은 **LM Studio**를 통해 다운, 실행하고, **Pi agent**를 통해 agentic coding을 진행했다.

대표적으로 사용해본 모델은 아래와 같다.

1. Qwen3.5 9B (Unsloth, Q8_0, 9.53 GB)
2. Gemma 4 12B Instruct QAT (Unsloth, UD-Q4_K_XL, 6.72GB)
3. Qwen3.6-36B-A3B (Unsloth, UD-IQ3_XXS, 14.07GB)
4. Qwen3.8-27B (Unsloth, UD-IQ3_XXS, 10.93 GB)

## Agentic Code test

실행 조건:

- LM Studio
- Context Length 64K
- KV cache Quantazation 안함.
- Pi agent

위 모델들로 가상 마우스의 몸무게 세트를 만들어달라고 했다 (통계 코딩 교육용 가상 데이터). R코드를 만들고, CSV파일을 만들라 지시했다.

```
Make R code and csv file. 1. Mouse body weight (weighed once-a-week, for 15 weeks). 2. Chow diet group: BW starts from 20, ends in 25, median. 3. High Fat Diet group: BW starts from 20, ends in 38-40, median. The increase is logarithm, but not so heavily. n=8/group. Add fluctuation in the data. Filename: mouse_bw.r, mouse_bw.csv
```

![Pi agent is runnig Qwen3.8 27b iq3_xxs](/images/post/2026-08-23-local-llm-fisrt-try/01_pi_agent.webp)

> 27B dense 모델을 돌릴 수는 있으나, 속도가 빠르지 않다.

Agentic coding 결과는 아래와 같다.

| Model                      | Time, Token               | Note                                                         |
| -------------------------- | ------------------------- | ------------------------------------------------------------ |
| Qwen3.5-9B Q8              | 11분58초, 43.0%/64K token | 코드 작성하고 실행하다가 계속 문제가 있는지 고치기를 반복함. |
| Gemma 4-12B-IT-QAT Q4_K_XL | 1분44초, 6.9%/64K         | 처음에 코드만 생성하고, CSV를 생성안함. CSV만들어달라고 해서 결과물 나옴. |
| Qwen3.6-35B-a3B IQ3_XXS    | 55초, 8.0%/64K token      | 앞의 두 모델에 비해 압도적으로 빠르고, 가장 그럴듯한 결과를 만들었음. |
| Qwen3.8-27B IQ3_XXS        | 6분5초, 11.6%/64K         | 제일 맥 Fan이 강하게 돌 정도로 연산이 많음. 단순 체팅을 사용할 때 약 10token/s 정도를 생성할 정도의 느린 모델임. |

![Agentic code test](/images/post/2026-08-23-local-llm-fisrt-try/01_Rplot.svg)

> Data Visualisation with R 4.6.1, `ggplot2 4.0.3`, `patchwork 1.3.2`

매우 간단한 작업을 지시했으나, Qwen3.5-9B 모델 Trial-Error가 너무 심했다. 현실적으로 쓸만한 지점은 Qwen3.6-35B MoE 모델. Qwen3.8-27B 모델은 써볼 수는 있다 정도다.

## Local model Web search

로컬모델도 웹검색이 가능은 하다. `Duck Duck Go` 같은 검색 툴을 이용하면 데이터 조사가 가능한데, 간혹 검색결과가 없으면 결과가 나올 때 까지 검색하는 무한루프가 발생하기도 한다. 대부분 더 큰 모델, 더 작은 양자화 (= 용량이 무거운 모델)에서 개선되는 현상이 나타난다.

일부러 할루시네이션을 유발할 수 있는 질문을 물어보고, 검색결과를 확인했다.

`2026년에 벌어진 소련 한국 전쟁에 대해 검색하고 분석해봐`

![Qwen3.8 27b model. web searching non-exsit war](/images/post/2026-08-23-local-llm-fisrt-try/02_web_search.webp)

> 없는 결과를 잘 인지하고 검색을 중단한 모습을 볼 수 있다.

마지막으로 이 작성글을 로컬 모델로 번역해봤다. Gemma 4가 한국어를 잘 한다 하여, 해당 모델로 번역을 시도했으나, 품질이 좋지 못했다. 이번 번역은 Qwen3.8-27B모델로 진행했다.

## 마치며

처음 흥미에 가득찬 상태로 M4 Pro chip을 이용해 로컬 모델을 돌려볼 생각이 가득했었으나, 현실은 냉혹하다. 계륵같은 이 모델은 진짜 극비 자료 돌릴 때나 써먹는게 좋아보인다. 토큰이 갑자기 너무 부족해진 그런 경우 아니면 장난감 삼아서 놀 때나 쓸 것 같다.
