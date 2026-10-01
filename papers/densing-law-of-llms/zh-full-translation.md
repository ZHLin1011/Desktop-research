# 大语言模型的稠密定律（Densing Law of LLMs）

> 原文：https://arxiv.org/pdf/2412.04315  
> arXiv:2412.04315v2 [cs.AI] 06 Dec 2024  
> 许可证：CC BY 4.0  
> 说明：以下为论文正文的**逐句中文翻译**（非摘要）。公式、图表标题与参考文献条目保留原文信息；专有名词首次出现时给出中英对照。

---

## 作者

**肖超军（Chaojun Xiao）**  
单位：清华大学  
邮箱：xiaocj20@mails.tsinghua.edu.cn

**蔡杰（Jie Cai）**  
单位：面壁智能（ModelBest Inc.）

**赵伟霖（Weilin Zhao）**  
单位：清华大学

**曾国洋（Guoyang Zeng）**  
单位：面壁智能（ModelBest Inc.）

**林碧园（Biyuan Lin）**  
单位：面壁智能（ModelBest Inc.）

**周杰（Jie Zhou）**  
单位：面壁智能（ModelBest Inc.）

**郑智（Zhi Zheng）**  
单位：面壁智能（ModelBest Inc.）

**韩旭（Xu Han）**  
单位：清华大学  
邮箱：han-xu@tsinghua.edu.cn

**刘知远（Zhiyuan Liu）**  
单位：清华大学  
邮箱：liuzy@tsinghua.edu.cn

**孙茂松（Maosong Sun）**  
单位：清华大学  
邮箱：sms@tsinghua.edu.cn

---

## 摘要（Abstract）

大语言模型（Large Language Models, LLMs）已成为人工智能领域的一座里程碑，并且其性能可以随着模型规模的增大而提升。

然而，这种规模扩张给训练与推理效率带来了巨大挑战，尤其是在资源受限环境中部署大语言模型时；而且，这种持续扩规模的趋势正变得越来越不可持续。

本文引入「**能力密度**（capability density）」这一概念，作为跨不同规模评估大语言模型质量的新指标，并从有效性与效率两方面刻画大语言模型的发展趋势。

为计算给定目标大语言模型的能力密度，我们首先引入一组参考模型，并建立一条缩放定律（Scaling Law），用于根据参数规模预测这些参考模型在下游任务上的表现。

然后，我们将目标大语言模型的**有效参数规模**（effective parameter size）定义为：参考模型要达到同等性能所需的参数规模；并将能力密度形式化为「有效参数规模」与「目标大语言模型实际参数规模」之比。

能力密度为同时评估模型有效性与效率提供了统一框架。

我们对近年来开源基座大语言模型的进一步分析揭示了一条经验定律（**稠密定律**，Densing Law）：大语言模型的能力密度随时间呈指数增长。

更具体地说，在使用若干广泛采用的评测基准时，大语言模型的能力密度大约每三个月翻一番。

该定律为引导未来大语言模型发展提供了新视角，强调应提升能力密度，从而以最小的计算开销取得最优结果。

---

## 要点（Highlights）

我们引入「能力密度」这一概念，用于评估大语言模型（LLMs）的训练质量，并刻画同时考虑有效性与效率的大语言模型发展趋势。

我们揭示了自 2023 年以来发布的开源基座大语言模型在能力密度上的一条经验定律。

图 1 展示了流行大语言模型的能力密度，该密度由其在 5 个广泛使用的评测基准上的表现测得。

对最大能力密度与发布日期之间拟合趋势，得到 \(A \approx 0.007\)，且 \(R^{2} \approx 0.93\)。

这表明大语言模型的最大能力密度大约每 3.3 个月翻一番。[^fn1]

也就是说，大约三个月后，就有可能用参数规模减半的模型，达到与当前最先进大语言模型相当的性能。

**图 1**：开源基座大语言模型的估计能力密度。

[^fn1]: 能力密度增长率会受到具体评测基准与参考模型的影响。

---

## 1 引言（Introduction）

近年来，大语言模型（LLMs）在人工智能领域受到广泛关注，并在各类任务上展现出显著提升（Bommasani et al., 2021; Qiu et al., 2020; Han et al., 2021; Touvron et al., 2023a; OpenAI, 2023）。

大语言模型的缩放定律进一步揭示：随着模型参数与训练数据的增加，模型性能会持续提升（Kaplan et al., 2020; Henighan et al., 2020; Hoffmann et al., 2022）。

这一发现推动了拥有数千亿参数的大语言模型的发展，例如 GPT-3 175B（Brown et al., 2020）、PaLM 540B（Chowdhery et al., 2023）以及 Llama-3.1-405B（Dubey et al., 2024），它们在更广泛的应用中展现出卓越能力。

此外，随着大语言模型的发展，提升推理效率变得日益紧迫：

1）随着大语言模型被部署到越来越多的场景中，推理成本已经超过训练成本，成为实际应用中的主要瓶颈（Sardana et al., 2024; Yun et al., 2024; OpenAI, 2024a）。

2）人们越来越需要把大语言模型部署到智能手机等资源受限的端侧设备上，作为个人助手；这要求模型更高效、更紧凑（Gunter et al., 2024; Xue et al., 2024; Hu et al., 2024）。

3）推理缩放定律表明：在推理阶段让大语言模型生成更多用于「思考」的 token，对于提升复杂推理任务上的表现至关重要（Brown et al., 2024; OpenAI, 2024b; Snell et al., 2024），这进一步增加了对高效推理的需求。

为应对这些挑战，许多工作致力于开发仅有数十亿参数的高效大语言模型，以降低推理开销，例如 OpenAI 的 GPT-4o-mini（OpenAI, 2024a）以及 Apple 的 Apple Intelligence（Gunter et al., 2024）。

面对这两条看似矛盾的路径——为追求有效性而放大模型，与为追求效率而缩小模型——自然会产生如下问题：

我们能否定量评估不同规模大语言模型的质量？

是否存在一条能够反映大语言模型效率趋势的定律，就像缩放定律反映参数与数据规模趋势那样？

为此，我们引入**能力密度**的概念，作为评估与比较不同规模大语言模型训练质量的指标。

准确度量大语言模型能力的各个方面，或其智能水平，相当困难。

在本文中，我们设计了一种评估**相对能力密度**的方法。[^fn2]

具体而言，我们使用一个参考模型，并估计其在下游任务表现与参数规模之间的缩放函数。

基于该缩放函数，对任意给定模型，我们计算其**有效参数规模**——即参考模型要达到同等性能所需的参数数量。

于是，相对于参考模型的大语言模型密度，被定义为「有效参数规模」与「实际参数规模」之比。

通过引入模型密度的概念，我们旨在更准确地度量模型质量，并使得不同规模模型之间的比较成为可能。

这种评估方法有望为未来大语言模型发展方向提供新洞见，帮助研究者在有效性与效率之间找到最优平衡。

[^fn2]: 为表述方便，本文中用「密度」指代「（相对）能力密度」。

### 1.1 关键发现（Key Findings）

在定义大语言模型密度之后，我们分析了近年来 29 个广泛使用的开源预训练基座模型。

关于模型密度，我们的关键发现是：

基于我们在 5 个广泛使用的评测基准——MMLU（Hendrycks et al., 2020）、BBH（Suzgun et al., 2023）、MATH（Hendrycks et al., 2021）、HumanEval（Chen et al., 2021）与 MBPP（Austin et al., 2021）——上的评测，\(A \approx 0.007\)，这意味着大语言模型的最大密度大约每三个月翻一番。

例如，2024 年 2 月 1 日发布的 MiniCPM-1-2.4B，可以达到与 2023 年 9 月 27 日发布的 Mistral-7B 相当甚至更优的性能。

在大约 4 个月后，我们可以用仅约 35% 参数量的大语言模型，获得大致相当的性能。

值得注意的是，使用不同的评测基准，可能会导致模型密度的估计值与增长率出现轻微差异。

我们鼓励社区开发更全面的大语言模型评测基准，以确保对密度的度量更加准确。

基于「大语言模型密度正以指数趋势持续提升」这一结论，我们还可以进一步推出如下含义：

稠密定律表明：有效参数规模与真实参数规模之比大约每三个月翻一番。

直观地说，在三个月内，我们就可以用参数数量仅为一半的模型，达到与当前最先进模型相当的性能。

因此，在同等下游性能下，推理成本正以指数方式下降。

我们发现，从 2023 年 1 月至今，GPT-3.5 水平模型的推理成本已经下降了 266.7 倍。

摩尔定律（Moore, 1965）指出：相同面积芯片上集成的电路数量呈指数增长。

这意味着算力呈指数增长。

稠密定律表明：大语言模型的密度每 3.3 个月翻一番。

将这两方面结合起来，我们可以得出结论：在同等价格的芯片上可运行的大语言模型的有效参数规模，其增长速度既快于大语言模型密度本身，也快于芯片算力的增长。

我们比较了 ChatGPT 发布前后大语言模型密度的增长趋势。

结果表明，在 ChatGPT 模型发布之后，最大密度的增长率明显加快。

具体而言，ChatGPT 发布后，大语言模型密度的增长率提高了 50%。

为提升模型推理效率，许多研究者投入一系列模型压缩算法的工作，例如剪枝与蒸馏（Ma et al., 2023; Sun et al., 2024; Yang et al., 2024; Xu et al., 2024）。

这些算法通常被认为能够改善所得压缩模型的性能。

然而，通过比较一些模型及其压缩版本，我们可以观察到：广泛使用的剪枝与蒸馏方法通常会产生密度低于原模型的更小模型。

我们鼓励社区进一步探索更有效的模型压缩算法，并更加强调提升小模型的密度。

密度是一个反映有效性与效率之间权衡的指标。

因此，盲目增加模型参数以追求性能提升，可能导致模型密度降低，从而造成不必要的能耗。

例如，尽管 Llama-3.1-405B（Dubey et al., 2024）在开源模型中达到了最先进性能，但它所需的计算资源比其他模型高出数百倍。

因此，模型开发者需要把关注点从仅仅优化性能，转向优化密度。

这一做法旨在以最小计算成本取得最佳结果，从而实现更可持续、更环保的缩放定律。

在本工作中，我们为大语言模型提出了一个新的评估指标——能力密度；它可以为当前两条趋势——提升有效性与提升效率——提供一个新的统一视角。

基于所提出的指标，我们评测了 29 个开源模型，并发现一条经验性经验定律，命名为**稠密定律**：大语言模型的密度呈指数增长趋势。

基于这一经验关系，我们讨论了若干推论，并提供了观察性证据。

通过这一新的评估视角，我们希望为大语言模型的未来发展提供有价值的洞见与指导。

---

## 2 大语言模型的密度（Density for Large Language Models）

在本节中，我们正式定义大语言模型的密度，其计算方式为「有效参数规模」与「实际参数规模」之比。

在后续小节中，我们将首先描述大语言模型密度的整体框架与形式化定义。

然后介绍如何利用缩放定律来估计有效参数规模。

### 2.1 整体框架与定义（Overall Framework and Definition）

大语言模型密度的核心在于**有效参数规模**，即参考模型要达到与给定模型相同性能所需的参数数量。

为此，我们需要拟合一个将参考模型参数规模与其性能联系起来的函数。

具体而言，对于具有 \(N_{\mathcal{M}}\) 个参数的给定模型 \(\mathcal{M}\)，假设其在下游任务上的性能分数为 \(S_{\mathcal{M}}\)。

该分数可以根据下游任务使用不同指标计算，例如准确率、F1 分数等。

为计算有效参数规模，我们训练一系列具有不同参数规模与训练数据规模的参考模型。

基于这些模型，我们拟合参数规模与性能之间的函数：\(S = f(N)\)，其中 \(S\) 表示下游性能，\(N\) 表示参考模型的参数规模。

于是，我们可以将有效参数规模计算为 \(\hat{N}(S) = f^{-1}(S)\)，并将 \(\mathcal{M}\) 的密度定义为：

\[
\rho(\mathcal{M})=\frac{\hat{N}(S_{\mathcal{M}})}{N_{\mathcal{M}}}=\frac{f^{-1}(S_{\mathcal{M}})}{N_{\mathcal{M}}}. \tag{1}
\]

需要注意的是，缩放定律通常用于拟合语言建模损失与参数规模之间的关系（Kaplan et al., 2020），而直接预测下游任务性能并非易事。

受 Llama-3（Dubey et al., 2024）启发，我们采用两步估计方法：

（1）**损失估计**：第一步，我们使用一系列参考模型，拟合参数规模与测试集上语言建模损失之间的关系，表示为 \(\mathcal{L}=f_{1}(N)\)。

（2）**性能估计**：由于涌现能力（Wei et al., 2022a）的存在，仅用训练算力有限的参考模型，很难准确估计参数规模与性能之间的关系。

因此，我们引入开源模型，计算它们在测试集上的损失与性能，并拟合关系 \(s=f_{2}(\mathcal{L})\)。

这一两步估计过程使我们能够得到 \(s=f_{2}(f_{1}(N))\)。

在后续小节中，我们将详细描述 \(f_{1}(\cdot)\) 与 \(f_{2}(\cdot)\) 的拟合过程。

### 2.2 损失估计（Loss Estimation）

为预测下游任务性能，第一步是利用大语言模型预训练中广泛采用的缩放定律，拟合参数规模与语言模型损失之间的函数。

以往的缩放定律主要关注整段序列上的语言建模损失，它反映模型估计给定语料概率的能力。

然而，下游任务中的样本通常同时包含输入指令与输出答案，而我们主要关心的是输出答案的概率。

因此，在本工作中，我们关注拟合条件损失 \(\mathcal{L}=-\log(P(\text{answer}\mid\text{instruction}))\)。

具体而言，我们估计条件损失 \(\mathcal{L}\) 与参数规模 \(N\) 以及训练 token 数 \(D\) 之间的幂律函数：

\[
\mathcal{L}=aN^{-\alpha}+bD^{-\beta}, \tag{2}
\]

其中 \(a\)、\(\alpha\)、\(b\) 与 \(\beta\) 是需要拟合的参数。

在以往关于缩放定律的研究中（Kaplan et al., 2020），损失通常需要在某个验证语料上指定，并在该语料的所有 token 上计算平均损失。

在本工作中，我们的目标是拟合模型在下游任务上的表现；这些任务要求模型根据输入指令输出答案。

因此，我们直接在下游任务上计算条件损失，也就是模型在给定任务输入时生成答案所产生的损失。

（1）对于选择题：若仅根据正确选项内容计算损失，可能导致估计不准确，因为忽略了错误选项的内容。

此外，若仅在最终选项标签上计算损失，单个 token 的损失也不稳定。

因此，我们将题目与多个选项拼接作为输入，输出则是对该输入题目的分析以及最终答案标签。

（2）对于大多数复杂问题（例如数学题），我们通常要求模型在给出最终答案之前先生成一系列推理步骤。

对于这类任务，在计算损失时，我们将推理步骤与正确答案一并作为输出，以计算模型损失。

需要注意的是，大多数数据集并不为每个样本提供推理步骤。

对上述两类任务，我们都使用 GPT-4o（OpenAI, 2023）为所有测试样本生成推理步骤。

这些做法使我们能够考虑不同任务的具体要求与格式，从而更好地估计模型性能。

### 2.3 性能估计（Performance Estimation）

第二步，我们需要基于测试集上的损失来预测下游任务性能。

在损失估计步骤中，用有限训练算力训练得到的缩放定律模型，通常无法在下游任务上取得有意义的分数；大多数缩放定律模型的表现仅相当于随机猜测。

因此，仅用这些模型无法预测下游性能。

为解决这一问题，我们引入训练充分的开源模型进行函数拟合，并计算它们在测试集上的损失与性能。

考虑到大多数下游任务的性能是有界的，我们使用 sigmoid 函数进行拟合。

sigmoid 函数自然地将所有输入值映射到 0 到 1 的区间。

此外，当损失特别大时，模型性能应接近随机猜测；当损失特别小时，模型性能应接近上界。

这一特性与 sigmoid 函数在曲线两端都非常平坦的性质相一致。

具体而言，我们用如下函数估计下游性能：

\[
S=\frac{c}{1+e^{-\gamma(\mathcal{L}-l)}}+d, \tag{3}
\]

其中 \(c\)、\(\gamma\)、\(l\) 与 \(d\) 是需要估计的参数。

**表 1**：用于损失估计的小模型的详细超参数。

| Name | # Para | BS | \(n_{layer}\) | \(d\) | \(d_{ffn}\) | \(d_{head}\) | \(n_{head}\) | \(n_{kv}\) |
|------|--------|----|---------------|-------|-------------|--------------|--------------|------------|
| 0.005B | 5,247,232 | 32 | 8 | 256 | 640 | 64 | 4 | 1 |
| 0.03B | 31,470,080 | 32 | 12 | 512 | 1,280 | 64 | 8 | 2 |
| 0.1B | 106,196,736 | 64 | 18 | 768 | 1,920 | 64 | 12 | 3 |
| 0.2B | 245,416,960 | 128 | 24 | 1,024 | 2,560 | 64 | 16 | 2 |
| 0.4B | 476,852,480 | 256 | 30 | 1,280 | 3,200 | 64 | 20 | 2 |
| 0.8B | 828,225,024 | 512 | 36 | 1,536 | 3,840 | 64 | 24 | 3 |

### 2.4 密度（Density）

在拟合公式 (2) 与 (3) 之后，给定模型 \(\mathcal{M}\) 的性能 \(S_{\mathcal{M}}\)，我们就可以利用这些方程的反函数推断有效参数规模。

需要注意的是，在公式 (2) 中，损失 \(\mathcal{L}\) 是参数量 \(N\) 与训练数据规模 \(D\) 的二元函数。

因此，在计算有效参数规模时，有必要指定一个特定的训练数据规模 \(D\)。

此处，为计算有效参数规模，我们默认使用 \(D=D_{0}=1\mathrm{T}\) tokens。

于是，有效参数规模可以解释为：用 \(D_{0}\) tokens 训练的参考模型，要达到同等性能所需的参数规模。

具体而言，我们可以将有效参数规模计算为：

\[
\hat{\mathcal{L}}(S_{\mathcal{M}})=l-\frac{1}{\gamma}\ln\left(\frac{c}{S_{\mathcal{M}}-d}-1\right);\quad
\hat{N}(S_{\mathcal{M}})=\left(\frac{\hat{\mathcal{L}}(S_{\mathcal{M}})-bD_{0}^{-\beta}}{a}\right)^{-\frac{1}{\alpha}}. \tag{4}
\]

至此，我们建立了下游性能与有效参数规模之间的关系。

给定模型 \(\mathcal{M}\) 的密度为 \(\rho(\mathcal{M})=\frac{\hat{N}(S_{\mathcal{M}})}{N_{\mathcal{M}}}\)。

直观地说，如果一个模型能在相同参数规模下取得更好的性能，那么该模型的密度就更高。

因此，在未来，考虑到部署设备的计算资源有限，我们应当大力投入于提升模型密度，而不是仅仅通过增大模型参数规模来追求更好性能。

**(a) 损失估计  (b) 性能估计**

**图 2**：损失估计与性能估计的结果。图中曲线为拟合曲线。(a) 中横轴表示预训练算力，近似为 \(\mathrm{Compute}=6ND\)。(b) 中三角形为用于预测的更大模型。

---

## 3 密度演化（Density Evolution）

### 3.1 评测设置（Evaluation Settings）

**数据集**  
在本工作中，我们采用如下广泛使用的数据集进行评测：用于英语知识密集型任务的 MMLU（Hendrycks et al., 2020），用于具有挑战性的逻辑推理任务的 BBH（Suzgun et al., 2023），用于数学推理任务的 MATH（Hendrycks et al., 2021），以及用于编程任务的 HumanEval（Chen et al., 2021）与 MBPP（Austin et al., 2021）。

我们使用开源工具（OpenCompass, 2023; Liu et al., 2024）进行评测。

此处，我们以少样本上下文学习（few-shot in-context learning）的方式评测所有模型；这些模型需要根据给定示例与测试样本输入生成最终答案标签。

遵循广泛使用的设置，MMLU、BBH、MATH、HumanEval 与 MBPP 分别在 5-shot、3-shot、4-shot、0-shot 与 3-shot 设置下评测。

此外，对 BBH、MATH 与 MBPP，我们采用思维链提示技术（Wei et al., 2022b）。

**损失估计模型**  
在损失估计步骤中，我们需要运行一系列具有不同参数规模与训练数据规模的模型。

这些模型将作为后续密度计算的参考模型。

在本工作中，我们采用 MiniCPM-3-4B（Hu et al., 2024）——一个广泛使用的端侧规模模型——的训练语料来训练这些小模型。

在模型架构方面，我们使用分组查询注意力（grouped query attention）（Ainslie et al., 2023），以及以 SiLU 为激活函数的门控前馈层。

我们使用 Warmup-Stable-Decay 学习率调度器训练模型。

为估计缩放曲线，我们用 \(\{10,15,20,30,40,60\}\times N\) tokens 训练模型，其中 \(N\) 表示参数规模。

我们在表 1 中列出了小型缩放模型的超参数。

**性能估计模型**  
在性能估计步骤中，我们引入额外的训练充分模型来拟合损失–性能曲线。

具体而言，我们使用一系列训练充分的 MiniCPM-3 模型及其中间训练检查点。

它们的参数规模从 5 亿到数十亿不等。

这些模型与我们的缩放模型使用相同词表，但具有不同的参数规模与训练数据集。

**被评测模型**  
此外，为说明密度随时间的变化，我们选择自 Llama-1（Touvron et al., 2023a）发布以来广泛使用的大语言模型进行评测，因为 Llama-1 之前发布的大多数开源模型在我们选定的数据集上无法取得有意义的表现。

具体而言，我们评测如下模型的密度：Llama 系列模型（Touvron et al., 2023a; Touvron et al., 2023b; Dubey et al., 2024）、Falcon（Almazrouei et al., 2023）、MPT（Team, 2023）、Phi 系列模型（Gunasekar et al., 2023; Li et al., 2023; Abdin et al., 2024）、Mistral（Jiang et al., 2023）、StableLM（Bellagente et al., 2024）、TinyLlama（Zhang et al., 2024）以及 MiniCPM 系列模型（Hu et al., 2024）。

我们优先使用各模型技术报告中报告的结果来进行密度计算。

此外，我们只评测未经指令微调的基座预训练模型的密度，因为指令微调数据集可能包含与我们选定测试数据相似的人工标注数据，从而导致密度估计不准确。

值得注意的是，许多预训练模型在预训练阶段也会引入有监督微调数据集，从而导致测试集污染问题（Wei et al., 2023; Dominguez-Olmedo et al., 2024）。

因此，不准确的密度估计问题仍有待解决，我们将其留待未来工作。

值得注意的是，我们只评测未经进一步有监督微调与偏好学习的预训练基座模型的密度，原因如下：

（1）预训练基座模型是模型性能的基础。

若考虑进一步对齐的影响——例如人工标注质量与对齐算法选择——会引入过多与基座模型自身能力无关的混杂因素。

（2）对齐后大语言模型性能的缩放定律仍是一个需要进一步探索的开放问题。

如今，有许多方法可以在推理时提升性能，例如检索增强生成（Lewis et al., 2020），以及面向推理缩放定律的「多思考」（OpenAI, 2024b）。

此处，我们仅考虑对基座大语言模型的基础提示技术进行评测，因为该技术并不能持续提升该基座模型的性能。

我们将基于不同推理 FLOPs 的密度计算留待未来工作，这可能会导向**推理稠密定律**（inference Densing Law）。

### 3.2 损失与性能估计结果（Loss and Performance Estimation Results）

我们在图 2 中展示两步过程的估计结果。

从结果中可以看出，两步估计过程能够有效拟合不同规模模型在三个下游任务上的表现。

随着测试样本上损失的下降，性能以 sigmoid 曲线形式显著提升；并且损失与参数数量及训练 token 数之间存在幂律关系。

为评估我们估计方法的有效性，我们使用参数量小于 40 亿的模型来拟合损失–性能曲线，并保留更大模型用于预测。

图 2(b) 中的三角形是两个拥有数十亿参数的模型。

从结果可以看出，我们能够基于损失值有效预测下游性能。

### 3.3 稠密定律（Densing Law）

在拟合损失缩放曲线与性能缩放曲线之后，我们进一步度量了自 Llama-1（Touvron et al., 2023a）发布以来广泛使用的开源模型的密度。

我们在图 1 中展示了各模型的密度及其发布日期。

从图中可以观察到：

（1）大语言模型的密度随时间迅速提升。

值得注意的是，2023 年 2 月发布的 Llama-1 的密度低于 0.1，而更近发布的模型如 Gemma-2-9B 与 MiniCPM-3-4B 的密度已达到 3。

密度的这一提升很大程度上归因于预训练数据规模的增长以及数据质量的改进。

例如，Llama-1 在约 1.4 万亿 tokens 上预训练，而 Llama-3 使用了经过仔细数据清洗的 15 万亿 tokens。

（2）更好的性能并不总是带来更高的密度。

Llama-3.1-405B 因其大规模参数，目前是最先进的开源模型之一。

然而，它并不是密度最高的模型。

这是因为受计算资源与预训练数据规模的约束，我们通常无法为极大规模模型充分优化训练设置，从而使其在性价比方面处于次优。

为进一步说明大语言模型密度的增长趋势，我们对图 1 中的包络线进行线性拟合。

具体而言，我们假设最大密度的对数值随时间线性增长。

形式上，我们拟合如下线性函数：

\[
\ln(\rho_{\mathrm{max}})=A\cdot t+B, \tag{5}
\]

其中 \(t\) 是自 Llama-1 发布日期起的时间间隔（单位：天），\(\rho\) 是时刻 \(t\) 的最大密度值，\(A,B\) 是待拟合参数。

通过拟合过程，我们得到 \(A \approx 0.0073\)，这意味着大模型的密度大约每 \(\frac{\ln(2)}{A} \approx 95\) 天翻一番。

此处，该线性回归函数的 \(R^{2}\) 为 0.912。

模型密度的增长趋势揭示了当前大语言模型发展中的一个重要规律。

尽管缩放定律表明模型性能会随参数规模增大而提升，但参数规模的增长受到部署场景中有限计算资源以及对快速响应需求的约束。

因此，大模型并不是简单地朝更大参数规模演化。

相反，大语言模型的开发者正致力于追求更高的性价比，目标是以最小的推理成本取得最优性能。

这一发现与摩尔定律在集成电路芯片发展中揭示的原则相一致（Moore, 1965），即强调在有限芯片面积上提升晶体管密度。

因此，我们将关于模型密度增长趋势的发现命名为**稠密定律（Densing Law）**。

### 3.4 稠密定律的推论（Corollaries of Densing Law）

基于稠密定律与我们的评测结果，本节讨论若干推论，并希望我们的发现能够推动大语言模型的发展。

#### 推理成本指数下降（Inference Costs Decrease Exponentially）

大语言模型的密度呈指数增长趋势，大约每三个月翻一番。

此处，密度被定义为有效参数规模与实际参数规模之比。

这意味着在三个月内，我们就可以用仅一半的实际参数规模，达到与当前模型相当的性能。

因此，在达到同等性能的条件下，大语言模型的实际参数规模也将指数下降。

实际参数量的减少，会转化为推理阶段计算成本的降低。

因此，大语言模型密度的指数增长，将直接导致「达到同等性能水平的模型」的推理成本指数下降。

**图 3**：能够超过 GPT-3.5 的大语言模型价格。连线连接的是最便宜的模型。

为更好说明大语言模型推理成本的下降趋势，我们在图 3 中展示了自 GPT-3.5 发布以来、性能优于 GPT-3.5 的大语言模型的 API 定价。

从图中可以看出，大语言模型的价格呈指数下降。

具体而言，2022 年 12 月，GPT-3.5 每百万 tokens 花费 20 美元；而到 2024 年 8 月，Gemini-1.5-Flash 同样规模的 tokens 仅花费 0.075 美元，下降了 266.7 倍。

粗略地说，大语言模型的推理成本大约每 2.6 个月减半。

大语言模型 API 定价呈指数下降的趋势，在 Appenzeller（2024）中也被观察到。

此外，我们可以观察到：推理成本的下降速度，快于大语言模型密度的增长速度。

这是因为推理成本不仅取决于实际参数规模，还在很大程度上取决于推理基础设施。

近年来，面向大语言模型的推理系统受到研究者广泛关注，包括自注意力层的显存访问速度优化（Kwon et al., 2023; Dao et al., 2022; Dao, 2023）以及前馈网络的稀疏计算优化（Song et al., 2023; Liu et al., 2023）。

这些进展极大地促进了大语言模型推理成本的降低。

#### 稠密定律遇见摩尔定律（Densing Law Meets Moore’s Law）

稠密定律描述了模型密度随时间指数增长的趋势，关注的是大语言模型算法层面的改进。

另一方面，摩尔定律指出算力呈指数增长，突出的是硬件技术的进步（Moore, 1965）。

这两条原则的结合，预示着一个迅速到来的未来：高质量大语言模型能够在智能手机与 PC 等消费级设备上以低功耗高效运行。

算法效率与硬件能力的这种汇合，正为先进 AI 技术在日常设备中的更易获取与更广泛使用铺平道路。

具体而言，近期观察（Hobbhahn et al., 2023）发现：同等价格芯片的算力大约每 2.1 年翻一番。

稠密定律表明：有效参数规模与实际参数规模之比每三个月翻一番。

因此，在芯片价格固定的情况下，可在其上运行的最大大语言模型的有效参数规模呈指数增长。

该增长率是「模型密度增长率」与「芯片上晶体管密度增长率」的乘积。

基于当前估计，这意味着最大有效参数规模大约每 88 天翻一番。

这一快速增长凸显了算法效率与硬件技术进步的综合影响，表明一个未来图景：日益强大的模型可以比此前预期更快地部署到现有硬件上。

**图 4**：使用 MMLU 评测得到的密度。两条趋势线分别表示 ChatGPT 发布前后大语言模型密度的增长。

#### ChatGPT 发布后密度增长加速（Density Growth Accelerated after ChatGPT’s Release）

2022 年，ChatGPT 在各类任务上取得了巨大性能提升，其零样本泛化能力推动了工业界与学术界共同大力推进大语言模型发展。

为说明 ChatGPT 发布前后模型密度增长趋势的变化，我们评测了自 GPT-3 发布以来典型大语言模型的密度。

我们使用 MMLU 基准来刻画密度变化。

结果如图 4 所示。

从图中可以看出，ChatGPT 发布后，模型密度的提升速度显著加快。

在 ChatGPT 之前，趋势线斜率约为 \(A \approx 0.0048\)；而在其发布之后，斜率提升到 \(A \approx 0.0073\)，表明模型密度的增长率加快了 50%。

促成这一加速增长的因素有若干：

（1）**投资增加**：ChatGPT 的成功凸显了大语言模型的潜力，从而促使流向大语言模型开发的投资显著增加。

（2）**更多高质量开源模型**：高质量开源模型的增多，降低了大语言模型研发的门槛。

在 ChatGPT 发布之后，仅有数十亿参数的高质量小大语言模型显著增多；它们的可获得性使许多研究者能够用相对较小的 GPU 集群开展大语言模型研究。

因此，我们鼓励社区开源其前沿算法与模型，这可以显著促进密度提升。

#### 高效压缩 ≠ 密度提升（Efficient Compression ≠ Density Improvement）

大语言模型往往受制于高推理成本，因而难以在消费级设备上运行。

为解决这一问题，许多开发者采用剪枝与蒸馏技术来压缩大语言模型。

在图 5 中，我们也展示了若干压缩模型的密度。

例如，Llama-3.2-3B/1B 与 Llama-3.1-minitron-4B（Muralidharan et al., 2024）由对 Llama-3.1-8B（Dubey et al., 2024）进行剪枝与蒸馏得到；而 Gemma-2-9B/2B 则由 Gemma-2-27B（Team et al., 2024）蒸馏得到。

**图 5**：压缩模型与其更大原模型之间的比较。

结果表明：只有 Gemma-2-9B 的密度高于原模型，而其他所有压缩模型的密度都低于其对应原模型。

直观上，剪枝是从大语言模型中移除不重要神经元，这意味着这些神经元可能比其他神经元存储更少的知识。

这会暗示压缩模型按理应达到更高密度。

然而，结果恰恰相反。

这种差异可能是因为压缩过程中对更小模型训练不足，使其未能达到最优密度。

因此，我们鼓励社区在未来工作中应对这一挑战，确保压缩模型在压缩过程中得到充分训练。

#### 迈向密度最优训练——绿色缩放定律（Towards Density-Optimal Training - Green Scaling Law）

自 GPT-3（Brown et al., 2020）发布以及缩放定律（Kaplan et al., 2020）提出以来，许多研究者聚焦于训练参数规模极大的语言模型，以持续提升模型性能。

在这一趋势指引下，PaLM-540B（Chowdhery et al., 2023）与 Gopher-280B（Rae et al., 2021）在各类自然语言处理任务上取得了巨大提升。

鉴于预训练计算资源的约束，「最大化利用预训练集群，以开发训练算力最优的大语言模型」已成为关键焦点（Hoffmann et al., 2022）。

此外，推理计算成本已超过训练计算成本，成为主要关切，从而推动了用越来越大的训练数据去预训练更小模型的转向（Hu et al., 2024; Gunter et al., 2024）。

鉴于稠密定律的发现，我们现在鼓励转向**密度最优**的大语言模型预训练。

随着全球范围内大语言模型开发的持续投入，模型密度正快速提升，导致每个模型的生命周期变短。

单纯增大大语言模型预训练语料规模，会导致更长的开发周期与更高的训练成本。

然而，在一个模型发布后不久，预计三个月内就会出现性能相当、推理成本更低的新模型。

在此背景下，大语言模型开发者必须考虑模型密度的增长趋势，并采用更高效、更通用的训练技术来提升模型密度。

这一做法有助于避免过度成本投入，以及由短利润回收周期带来的损失。

---

## 4 讨论（Discussion）

### 准确的能力度量（Accurate Capability Measurement）

能力密度反映的是大语言模型「单位参数」所具有的能力。

然而，以当前技术，我们无法准确评估大语言模型的绝对能力水平，这意味着「量化智能」仍然是一项重大挑战。

因此，在本工作中，我们设计了一种度量大语言模型**相对密度值**的方法。

此外，我们使用广泛采用的基准来评估大语言模型的性能。

然而，基准数量有限以及潜在的数据污染问题，会在性能评估中引入偏差。

因此，未来推进对大语言模型能力或智能水平的准确度量，将有助于更好地计算其密度。

### 稠密定律与缩放定律之间的联系（Connection between Densing Law and Scaling Law）

大语言模型的缩放定律揭示了大语言模型性能与其参数规模、数据规模之间的关系，反映了由海量神经元构成的复杂系统的内在特征。

稠密定律进一步凸显了大语言模型效率与有效性随时间发展的趋势，标志着人类在追求高水平 AI 模型过程中的一种技术进步趋势。

形式上，在训练数据充足的条件下，缩放定律将模型损失与参数规模的关系解释为：\(\mathcal{L}=AN^{-\alpha}\)，这对所有基于 Transformer 的模型训练都适用。

进一步地，稠密定律表明：大语言模型的开发者可以通过持续改进数据、算法与架构来增大 \(\alpha\)，从而在给定参数规模下降低模型损失。

### 稠密定律的有效期（Period of Validity of Densing Law）

稠密定律揭示了大语言模型算法的快速发展。

在本段中，我们讨论如下问题：模型密度的这种指数增长还会持续多久？

我们认为，模型密度的快速提升，是由人员与资源方面的大量投入所驱动的。

大语言模型通用智能能力的提升，可以为各行各业带来巨大收益，从而进一步鼓励对模型研发的投资。

鉴于大语言模型的巨大潜力，我们认为稠密定律在相当长一段时间内仍将有效。

然而，有必要持续更新用于评估模型密度的评测数据集，因为大语言模型很快就会在现有数据集上达到令人满意的表现。

若实现通用人工智能，大语言模型本身或许能够自主开展科学研究，探索进一步提升密度的新路径。

届时，在模型能够自我创新与优化其自身发展过程的驱动下，大语言模型密度的增长甚至可能进一步加速。

---

## 5 局限与未来方向（Limitations and Future Directions）

在本节中，我们讨论所提出的、用于评估大语言模型能力密度的方法的局限与未来方向。

### 公平且全面的评测（Fair and Comprehensive Evaluation）

大语言模型能力密度的度量依赖于现有基准来评估模型性能。

因此，基准质量会极大影响密度度量结果。

在本工作中，我们使用那些被研究者广泛采用的基准来评估各类大语言模型。

然而，仍存在若干挑战：

（1）**全面评测**：随着大语言模型的发展，其能力显著扩展，例如处理复杂推理任务的能力（OpenAI, 2024b）。

因此，能力密度度量需要通过纳入更多反映能力演进的全面评测数据集，来持续更新。

（2）**公平评测**：随着预训练数据规模增大以及合成数据的构建，一些大语言模型针对基准过度优化，导致分数虚高。

为应对这一问题，我们计划使用新构建的数据集来评估模型性能，从而缓解过拟合风险并确保密度估计准确。

### 多模态密度（Multi-modal Density）

在本工作中，我们聚焦于度量语言模型的能力密度。

然而，随着多模态应用增多，度量大型多模态模型的密度及其趋势同样至关重要。

未来，为多模态模型设计合理的密度评估方法，将是一个重要研究方向。

### 推理稠密定律（Inference Densing Law）

近期研究表明：更多的推理计算成本使大语言模型能够进行更深的推理，从而有效提升其在复杂任务上的表现（OpenAI, 2024b）。

在本工作中，我们以参数规模作为评估模型能力密度的基础。

然而，随着思维链推理的重要性持续提升，密度评估应当转向基于推理 FLOPs。

具体而言，能力密度可以被形式化为「有效推理 FLOPs」与「实际推理 FLOPs」之比。

通过这种方式，我们希望大语言模型以最少的推理步数取得最优结果。

---

## 6 结论（Conclusion）

为说明近期朝向高效大语言模型的趋势，并定量度量大语言模型的训练质量，本文引入了一种评估大语言模型能力密度的方法。

通过度量自 2023 年以来发布的开源基座大语言模型的能力密度，我们展示了一条经验定律：大语言模型的能力密度随时间呈指数增长。

在一些广泛使用的大语言模型基准上的评测结果表明：大语言模型的密度每三个月翻一番。

这意味着，在三个月内，一个参数量仅为一半的模型就可以达到与当前最先进模型相当的性能。

这一发现凸显了大语言模型的快速发展与日益提升的效率。

我们基于该定律讨论了若干推论，并希望该定律及其推论能够激励大语言模型社区继续提升模型能力密度，并以最小计算成本取得最优性能。

---

## 参考文献（References）

> 参考文献条目保留原文著录信息（作者、题名、出处、年份等），不做逐条意译；仅在题名后酌情附简短中文译名供检索。

1. **Abdin et al. (2024).** Marah Abdin et al. *Phi-3 technical report: A highly capable language model locally on your phone.*（Phi-3 技术报告：可在手机本地运行的高能力语言模型）arXiv:2404.14219, 2024.

2. **Ainslie et al. (2023).** Joshua Ainslie et al. *GQA: Training generalized multi-query transformer models from multi-head checkpoints.* EMNLP 2023, pp. 4895–4901.

3. **Almazrouei et al. (2023).** Ebtesam Almazrouei et al. *The Falcon series of open language models.* arXiv:2311.16867, 2023.

4. **Appenzeller (2024).** Guido Appenzeller. *Welcome to LLMflation – LLM inference cost is going down fast.* Blog, 2024. https://a16z.com/llmflation-llm-inference-cost/

5. **Austin et al. (2021).** Jacob Austin et al. *Program synthesis with large language models.* arXiv:2108.07732, 2021.

6. **Bellagente et al. (2024).** Marco Bellagente et al. *Stable LM 2 1.6B technical report.* arXiv:2402.17834, 2024.

7. **Bommasani et al. (2021).** Rishi Bommasani et al. *On the opportunities and risks of foundation models.* CoRR, abs/2108.07258, 2021.

8. **Brown et al. (2024).** Bradley C. A. Brown et al. *Large language monkeys: Scaling inference compute with repeated sampling.* CoRR, abs/2407.21787, 2024.

9. **Brown et al. (2020).** Tom B. Brown et al. *Language models are few-shot learners.* NeurIPS, 2020.

10. **Chen et al. (2021).** Mark Chen et al. *Evaluating large language models trained on code.* arXiv:2107.03374, 2021.

11. **Chowdhery et al. (2023).** Aakanksha Chowdhery et al. *PaLM: Scaling language modeling with pathways.* JMLR, 24(240):1–113, 2023.

12. **Dao (2023).** Tri Dao. *FlashAttention-2: Faster attention with better parallelism and work partitioning.* arXiv:2307.08691, 2023.

13. **Dao et al. (2022).** Tri Dao et al. *FlashAttention: Fast and memory-efficient exact attention with IO-awareness.* NeurIPS, 35:16344–16359, 2022.

14. **Dominguez-Olmedo et al. (2024).** Ricardo Dominguez-Olmedo et al. *Training on the test task confounds evaluation and emergence.* arXiv:2407.07890, 2024.

15. **Dubey et al. (2024).** Abhimanyu Dubey et al. *The Llama 3 herd of models.* arXiv:2407.21783, 2024.

16. **Gunasekar et al. (2023).** Suriya Gunasekar et al. *Textbooks are all you need.* arXiv:2306.11644, 2023.

17. **Gunter et al. (2024).** Tom Gunter et al. *Apple intelligence foundation language models.* CoRR, abs/2407.21075, 2024.

18. **Han et al. (2021).** Xu Han et al. *Pre-trained models: Past, present and future.* AI Open, 2:225–250, 2021.

19. **Hendrycks et al. (2020).** Dan Hendrycks et al. *Measuring massive multitask language understanding.* ICLR, 2020.

20. **Hendrycks et al. (2021).** Dan Hendrycks et al. *Measuring mathematical problem solving with the MATH dataset.* NeurIPS Datasets and Benchmarks, 2021.

21. **Henighan et al. (2020).** Tom Henighan et al. *Scaling laws for autoregressive generative modeling.* CoRR, abs/2010.14701, 2020.

22. **Hobbhahn et al. (2023).** Marius Hobbhahn et al. *Trends in machine learning hardware.* https://epoch.ai/blog/trends-in-machine-learning-hardware, 2023.

23. **Hoffmann et al. (2022).** Jordan Hoffmann et al. *Training compute-optimal large language models.* CoRR, abs/2203.15556, 2022.

24. **Hu et al. (2024).** Shengding Hu et al. *MiniCPM: Unveiling the potential of small language models with scalable training strategies.* CoRR, abs/2404.06395, 2024.

25. **Jiang et al. (2023).** Albert Q. Jiang et al. *Mistral 7B.* arXiv:2310.06825, 2023.

26. **Kaplan et al. (2020).** Jared Kaplan et al. *Scaling laws for neural language models.* CoRR, abs/2001.08361, 2020.

27. **Kwon et al. (2023).** Woosuk Kwon et al. *Efficient memory management for large language model serving with PagedAttention.* SOSP, pp. 611–626, 2023.

28. **Lewis et al. (2020).** Patrick Lewis et al. *Retrieval-augmented generation for knowledge-intensive NLP tasks.* NeurIPS, 33:9459–9474, 2020.

29. **Li et al. (2023).** Yuanzhi Li et al. *Textbooks are all you need II: phi-1.5 technical report.* arXiv:2309.05463, 2023.

30. **Liu et al. (2024).** Jiawei Liu et al. *Is your code generated by ChatGPT really correct? Rigorous evaluation of large language models for code generation.* NeurIPS, 36, 2024.

31. **Liu et al. (2023).** Zichang Liu et al. *Deja Vu: Contextual sparsity for efficient LLMs at inference time.* ICML, pp. 22137–22176, 2023.

32. **Ma et al. (2023).** Xinyin Ma et al. *LLM-Pruner: On the structural pruning of large language models.* NeurIPS, 36:21702–21720, 2023.

33. **Moore (1965).** Gordon E. Moore. *Cramming more components onto integrated circuits.* Electronics, 1965.

34. **Muralidharan et al. (2024).** Saurav Muralidharan et al. *Compact language models via pruning and knowledge distillation.* arXiv:2407.14679, 2024.

35. **OpenAI (2023).** *GPT-4 technical report.* CoRR, abs/2303.08774, 2023.

36. **OpenAI (2024a).** *GPT-4o mini: advancing cost-efficient intelligence.* https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/

37. **OpenAI (2024b).** *Learning to reason with LLMs.* https://openai.com/index/learning-to-reason-with-llms/

38. **OpenCompass (2023).** *OpenCompass: A universal evaluation platform for foundation models.* https://github.com/open-compass/opencompass

39. **Qiu et al. (2020).** Xipeng Qiu et al. *Pre-trained models for natural language processing: A survey.* CoRR, abs/2003.08271, 2020.

40. **Rae et al. (2021).** Jack W. Rae et al. *Scaling language models: Methods, analysis & insights from training Gopher.* arXiv:2112.11446, 2021.

41. **Sardana et al. (2024).** Nikhil Sardana et al. *Beyond Chinchilla-optimal: Accounting for inference in language model scaling laws.* ICML 2024.

42. **Snell et al. (2024).** Charlie Snell et al. *Scaling LLM test-time compute optimally can be more effective than scaling model parameters.* CoRR, abs/2408.03314, 2024.

43. **Song et al. (2023).** Yixin Song et al. *PowerInfer: Fast large language model serving with a consumer-grade GPU.* arXiv:2312.12456, 2023.

44. **Sun et al. (2024).** Mingjie Sun et al. *A simple and effective pruning approach for large language models.* ICLR, 2024.

45. **Suzgun et al. (2023).** Mirac Suzgun et al. *Challenging BIG-Bench tasks and whether chain-of-thought can solve them.* Findings of ACL 2023, pp. 13003–13051.

46. **Team et al. (2024).** Gemma Team et al. *Gemma 2: Improving open language models at a practical size.* arXiv:2408.00118, 2024.

47. **Team (2023).** MosaicML NLP Team. *Introducing MPT-30B: Raising the bar for open-source foundation models.* www.mosaicml.com/blog/mpt-30b, 2023.

48. **Touvron et al. (2023a).** Hugo Touvron et al. *LLaMA: Open and efficient foundation language models.* CoRR, abs/2302.13971, 2023a.

49. **Touvron et al. (2023b).** Hugo Touvron et al. *Llama 2: Open foundation and fine-tuned chat models.* arXiv:2307.09288, 2023b.

50. **Wei et al. (2022a).** Jason Wei et al. *Emergent abilities of large language models.* TMLR, 2022a.

51. **Wei et al. (2022b).** Jason Wei et al. *Chain-of-thought prompting elicits reasoning in large language models.* NeurIPS, 35:24824–24837, 2022b.

52. **Wei et al. (2023).** Tianwen Wei et al. *Skywork: A more open bilingual foundation model.* arXiv:2310.19341, 2023.

53. **Xu et al. (2024).** Xiaohan Xu et al. *A survey on knowledge distillation of large language models.* arXiv:2402.13116, 2024.

54. **Xue et al. (2024).** Zhenliang Xue et al. *PowerInfer-2: Fast large language model inference on a smartphone.* CoRR, abs/2406.06282, 2024.

55. **Yang et al. (2024).** Chuanpeng Yang et al. *Survey on knowledge distillation for large language models: Methods, evaluation, and application.* ACM TIST, 2024.

56. **Yun et al. (2024).** Longfei Yun et al. *Toward inference-optimal mixture-of-expert large language models.* CoRR, abs/2404.02852, 2024.

57. **Zhang et al. (2024).** Peiyuan Zhang et al. *TinyLlama: An open-source small language model.* arXiv:2401.02385, 2024.

---

## 术语对照（Translation Glossary）

| 英文 | 中文 |
|------|------|
| Densing Law | 稠密定律 |
| capability density / density | 能力密度 / 密度 |
| effective parameter size | 有效参数规模（有效参数量） |
| Scaling Law | 缩放定律 |
| reference model | 参考模型 |
| base (pre-trained) model | 基座（预训练）模型 |
| loss estimation | 损失估计 |
| performance estimation | 性能估计 |
| conditional loss | 条件损失 |
| chain-of-thought | 思维链 |
| pruning / distillation | 剪枝 / 蒸馏 |
| Green Scaling Law | 绿色缩放定律 |
| Inference Densing Law | 推理稠密定律 |
