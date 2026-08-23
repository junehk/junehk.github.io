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

약 1달 정도 이용해봤고, 결론부터 말하면 상용 AI (ChatGPT, Codex, Claude, Claude code)가 무조건 옳다. 로컬모델에 비해 압도적으로 빠르고 상세하며 정확하다. 하지만 로컬모델은 내가 원하는 데로 커스텀하는 장난감이라는 측면에서 의미가 있다. 내 데이터 관련 내용들이 외부로 안나가는 것은 덤.

로컬 AI 모델이 그나마 쓸만한 부분은 토큰 사용량 절약 측면이다. Claude $20 구독을 하는 입장에서는 Agentic coding을 할 때마다 토큰이 증발하는 것이 눈에 밟힌다. Claude에서 큰 일감들을 우선 나누고, Local AI에게 코딩 지시, 이후 Claude모델이 다시 그 결과를 평가, 감독하는 루프가 코인 절약 측면에서 그나마 쓸만한 부분일 것이다. 단, 이것도 시간 절약 측면에서는 전혀 쓸모 없고, 그냥 구독을 강화하는 것이 효율적이다.

사용한 로컬모델들은 비교적 작은 (<14 GB) 크기의 모델들이다. 통합메모리 크기가 24GB이지만, 시스템 운영 등의 자원 요소 때문에 실질적으로는 18GB VRAM정도만 이용 가능하다. 모델크기 뿐만 아니라, 대화나 작업 처리 과정에서 사용하는 Context window size또한 중요하기 때문에 더욱 크기가 큰 모델을 이용하기 어렵다.

로컬 모델을 돌리기 위해서 일반적인 GGUF 양자화 모델들은 **LM Studio**를 통해 다운, 채팅을 진행했고, MLX 모델은 **oMLX**를 이용해 관리했다.

대표적으로 사용해본 모델은 아래와 같다.

1. Qwen3.5 9B (Unsloth, Q4_K_S, 5.39GB; Q8_0, 9.53 GB)
2. Gemma 4 12B Instruct QAT (Unsloth, UD-Q4_K_XL, 6.72GB)
3. Qwen3.6-36B-A3B (Unsloth, UD-IQ3_XXS, 14.07GB)
4. Qwen3.8-27B (Unsloth, UD-IQ3_XXS, 10.93 GB; Leonsarmiento 3bit-mtp-mlx, 13.0 GB)

## 1. Qwen3.5 9B (Q8_0)

가장 무난하게 쓰기 좋은 모델이다. 9B이므로 M4 pro chip 정도에서 무난하게 돌아간다.

Context Length는 60,160 tokens, KV cache양자화 없이 실행하였다. 

![01 Qwen3.5 9b hi prompt](/images/post/2026-08-23-local-llm-fisrt-try/01_qwen3.5-9b_hi.png)

단순한 prompt에서 약 25 token/sec의 속도로 나와준다. 준수한 성능이며, 간단한 웹검색까지는 편안하게 된다.

![02 Qwen3.5 9b stock search](/images/post/2026-08-23-local-llm-fisrt-try/02_qwen3.5-9b_stock_search.png)

26년 8월 23일이 일요일인 점을 반영해 휴장일 전인 21일(금)에 대한 간략한 뉴스를 찾아왔다. (LM Studio, `vadimfedenko/duck-duck-go-reworked` tool 이용)

이제 *GLP-1 agonist 에 대한 임상 논문 분석* 같은 보다 복잡한 작업을 주문했다 (`altra/web-search` tool 이용). 

![03 Qwen3.5 9b GLP-1 search](/images/post/2026-08-23-local-llm-fisrt-try/03_qwen3.5-9b_glp1.png)

처음 사고 과정은 중국어가 섞여있다.

![04 Qwen3.5 9b GLP-1 search](/images/post/2026-08-23-local-llm-fisrt-try/04_qwen3.5-9b_glp1.png)

사용한 토큰 수가 28k에 달하지만 일단 결과를 뽑아준다. 검색 플러그인의 검색 결과가 없는 경우, 모델이 계속 검색 결과를 시도하는 경향이 있다. 이 경우 사용 토큰이 브레이크 없이 커지는 경우가 있다. (Qwen3.6-27b IQ2_XXS같은,  모델은 크지만 양자화가 강하게 된 모델은 수 계속 반복 검색을 하다가 토큰 제한에 걸리는 경우도 있었다.)

레퍼런스의 경우, 검색결과 기반으로 알려주는 것이기 때문에 이 부분에 대한 할루시네이션 걱정은 덜해도 된다. 3년 전에 ChatGPT를 통해 논문 검색을 하면 세상에 존재하지 않던 문서만 내뿜었던 시기가 있었는데, 그 시기와 비교하면 격새지감이라고 할 만큼 AI 모델들이 발전한 것 같다.

다음은 Agentic Coding이 쓸만한지 테스트했다. 마우스 체중 데이터를 임의로 만드는 코딩을 시켰다.Local model server는 LM studio에서 진행하고, 분석할 데이터 생성은 PI agent를 통해 진행한다 (Pi agent는 Claude code 비슷한 터미널 프로그램이라고 보면 된다).

![05 pi agent](/images/post/2026-08-23-local-llm-fisrt-try/05_qwen3.5-9b_pi.png)

적당한 프롬프트를 이용하여 임의의 마우스 체중 작성 코드를 만들었다. 

![06 r code generated](/images/post/2026-08-23-local-llm-fisrt-try/06_qwen3.5-9b_rcode.png)

작성된 코드는 매우 길고, 난잡하다. 간단하게 주차 별로 noise를 첨가한 중앙값을 만들고, `rnorm()`함수 이용해서 데이터를 만들길 희망했지만, 매우 오래걸리고, 토큰도 아주 많이 잡아먹는다(24k token). 생성된 코드 실행해보라고 하니, 에러 있다며 잡아주기도 하지만, 더 많은 토큰을 잡아먹으며, 오래걸린다. (코딩의 경우 그냥 상용 ai를 쓰는 것이 훨씬 낫다는 이야기가 여기에서도 나온다.)

![07 qwen3.5.-9b is not sufficient for agentic coding](/images/post/2026-08-23-local-llm-fisrt-try/07_qwen3.5-9b_pi.png)

난 분명히 고지방식이 (HFD)는 45g 까지 찌우라고 했는데, 뭘 이상하게 코드를 수정했나보다. 

![08 Rplot generataed](/images/post/2026-08-23-local-llm-fisrt-try/08_Rplot.png)

추가로 이 데이터가 적절한 체중 증가인지 Qwen3.5-9b에 물어봤으나, 고지방식이 군이 *적게* 체중이 증가한 부분을 잡아내지 못했다. 

**결론: Qwen3.5-9b 모델은 최소한도의 검색 기능 정도로 이용가능하고, agentic coding, 깊은 추론에는 적합하지 않다.**

## 2. Gemma 4 12B IT QAT (UD-Q4_K_XL)

이번에는 Gemma 4 12B 모델이다. 다른 모델들에 비해 Gemma 4는 한국어에 능통하다 알려져 있다. 하지만 Agentic Coding 만 테스트 해볼 것 이므로 영어로 프롬프트를 작성하고 실행했다.

- 마우스 가상 몸무게 데이터 세트 작성 코드
- KV cache 양자화 안함. (Context window 60k)

![09 gemma 4 coding](/images/post/2026-08-23-local-llm-fisrt-try/09_gemma4_code_generation.png)

이번에는 보다 적게 토큰을 쓰면서 덜 요란한 코드가 만들어졌다. 

![10 gemma 4 rplot](/images/post/2026-08-23-local-llm-fisrt-try/10_Rplot_gemma4.png)

내가 요구한 정도의 적당한 임시 데이터도 만들어졌다.

## Qwen3.6-35b-a3b-mtp (UD-IQ3_XXS)

직전 최신 모델인 Qwen3.6 시리즈에서 MoE 모델이다. 이번엔 조금 난이도를 높인 Agentic coding을 주문했다.

- 마우스의 몸무게가 sigmoid하게 증가 (처음엔 잘 증가 안하다가, 중간엔 linear하게, 마지막은 포화된 것 같게, 단 완전히 포화는 아니고 아직 linear 증가가 어느정도는 남아있어야 함.)

![11 qwen3.6 35b pi agent](/images/post/2026-08-23-local-llm-fisrt-try/11_qwen3.6_35b_pi.png)

전체 35B 패러미터에서 3B만 활성화 하는 모델인 만큼, 생성속도는 오늘 진행한 실험 중 가장 빠르다.

![12 qwen 3.6 35b rplot](/images/post/2026-08-23-local-llm-fisrt-try/12_qwen3.6_35b_rplot.png)

의도한 정도의 그래프가 작성된다.

## Qwen3.8 27B

따끈따끈한 최신 모델이다. [Artificial analysis](https://artificialanalysis.ai/models/qwen3-8-27b)에 따르면 OpenAI GPT-5.6 Luna 모델과 비벼볼만한 지능이라고 한다. 

![13 AA results](/images/post/2026-08-23-local-llm-fisrt-try/13_AA_qwen3.8_27b.png)

`xhigh` 옵션을 넣은 추론 환경에서 계속 고치고 고쳐서 얻은 지능 점수라는 평이 많지만, 코딩 한정 매우 강화된 모델이라는 평가가 많다.

사용 조건은 아래와 같다.

- Qwen3.8-27B-UD-IQ3_XXS.gguf (Unsloth, UD3.0, 10.93GB)
  - LM Studio, KV cache Quant Q8_0, Context Length 64k
- Qwen3.8-27B MLX 3bit MTP (Leonsarmiento, 13.04GB)
  - oMLX Context size 32K

우선 27B dense 모델은 M4 Pro 같은 빈약한 GPU로 돌릴만한 모델은 아님을 밝힌다. 단순한 `Hi` prompt정도만 해도 10-14 token/s까지 떨어지기도 한다. 또한 Gold standard 한 양자화 모델인 Q4_K_M(16.5 GB)은 실행은 할 수 있으나 Context Length제한이 강하게 걸려 실사용에 어렵다.

![14 qwen3.8 hi](/images/post/2026-08-23-local-llm-fisrt-try/14_qwen3.8_hi.png)

로컬모델을 통한 검색에서의 가장 큰 문제는 *없는 결과가 나올 시 무한 루프하여 검색*하는 것이다. 모델 크기가 작거나, 양자화가 심하게 된 모델일 수록 무한 검색하는 루프에 빠진다 (Tool calling 기능이 Qwen3.6-27b_iq3_xxs에서 만족스럽지 않았던 경험이 있다). 이 모델들은 괜찮은지 확인해보기로 했다.  (LM Studio, `vadimfedenko/duck-duck-go-reworked` tool 이용)

![15 qwen3.8 hallucination search test](/images/post/2026-08-23-local-llm-fisrt-try/15_qwen3.8_hallucination_test.png)

1회성 테스트긴 하나, 생각보다는 잘 잡아주는 것 같다. 토큰 사용량도 1664 tok으로 적절하게 제어된 것 같다.

![16 oMLX qwen3.8 quite faster](/images/post/2026-08-23-local-llm-fisrt-try/16_oMLX_qwen3.8.png)

oMLX 기본 설정을 통해 Qwen3.8-27b 3bit MLX 버전을 구동하여 `Hi` 프롬프트를 입력해봤다. LMstudio + IQ3_XXS GGUF 버전보단 보다 빠른 속도인 듯하다. 

![17 oMLX tetris](/images/post/2026-08-23-local-llm-fisrt-try/17_oMLX_tetris.png)

속도 측면에서 oMLX 체계를 이용해 조금 복잡한 코딩 지시를 해봤다. Tetris만들어보라고 했는데, Memory usage가 꽉차서 실패. KV cache 조절을 더 하거나 추가적인 조절이 필요해 보인다.

![18 translation pi](/images/post/2026-08-23-local-llm-fisrt-try/18_gemma4_translate.png)

마지막으로 이 마크다운 파일을 영어로 번역해보라고 지시했다. Qwen3.8 oMLX-Pi 환경에서는 똑같은 메모리 문제로 인해 실패했다. 한국어-영어 번역이므로 Gemma 4 12b 모델을 통해 번역했다.

## 마치며

처음 흥미에 가득찬 상태로 M4 Pro chip을 이용해 로컬 모델을 돌려볼 생각이 가득했었으나, 현실은 냉혹하다. 계륵같은 이 모델은 진짜 극비 자료 돌릴 때나 써먹는게 좋아보인다. 토큰이 갑자기 너무 부족해진 그런 경우 아니면 장난감 삼아서 놀 때나 쓸 것 같다.
