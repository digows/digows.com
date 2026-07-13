import type { Locale } from "../../../i18n/locales";

interface IflessScenario
{
  readonly code: string;
  readonly options: readonly [string, string, string];
  readonly answer: 0 | 1 | 2;
  readonly explanation: string;
}

export interface IflessExperienceContent
{
  readonly eyebrow: string;
  readonly title: string;
  readonly intro: string;
  readonly choose: string;
  readonly reveal: string;
  readonly reset: string;
  readonly score: string;
  readonly scenarios: readonly IflessScenario[];
}

export const iflessExperienceContent: Readonly<Record<Locale, IflessExperienceContent>> = {
  en: {
    eyebrow: "Practical experiment", title: "Find the hidden decision", intro: "Read each contract and identify where a choice is already known. Your answers stay in this browser.", choose: "Where is the hidden decision?", reveal: "Show explanation", reset: "Start over", score: "correct out of 3",
    scenarios: [
      { code: "paymentService.process(invoice, customer, method);", options: ["In the method value", "In customer", "There is no decision"], answer: 0, explanation: "The caller already chose the medium. chargeCard, createPixCharge, or debitWallet makes intent, authorization, and failures explicit." },
      { code: "repository.save(order);", options: ["It is always wrong", "In choosing create versus update", "Only in the database"], answer: 1, explanation: "When the caller knows the lifecycle, insert and update avoid making persistence infer it. If lifecycle is internal, save may remain correct." },
      { code: "order.ship();", options: ["In the paid check inside Order", "In the ship name", "It is not a hidden decision"], answer: 2, explanation: "Checking that an order is paid is an invariant of the order itself. The conditional is in the right place and the contract states intent." },
    ],
  },
  "pt-BR": {
    eyebrow: "Experimento prático", title: "Encontre a decisão escondida", intro: "Leia cada contrato e escolha onde a decisão já é conhecida. A resposta fica somente neste navegador.", choose: "Onde está a decisão escondida?", reveal: "Ver explicação", reset: "Recomeçar", score: "acertos de 3",
    scenarios: [
      { code: "paymentService.process(invoice, customer, method);", options: ["No valor de method", "No customer", "Não há decisão"], answer: 0, explanation: "O chamador já escolheu o meio. chargeCard, createPixCharge ou debitWallet tornam intenção, autorização e falhas explícitas." },
      { code: "repository.save(order);", options: ["Sempre está errada", "Na escolha entre criar e atualizar", "Apenas no banco"], answer: 1, explanation: "Quando o chamador conhece o ciclo de vida, insert e update evitam que a persistência o infira. Se isso for detalhe interno, save pode continuar correto." },
      { code: "order.ship();", options: ["Na verificação de pagamento dentro de Order", "No nome ship", "Não é uma decisão oculta"], answer: 2, explanation: "A verificação de que o pedido está pago é uma invariante do próprio pedido. O if está no lugar correto e o contrato expressa a intenção." },
    ],
  },
  es: {
    eyebrow: "Experimento práctico", title: "Encuentra la decisión oculta", intro: "Lee cada contrato e identifica dónde ya se conoce una elección. Tus respuestas permanecen en este navegador.", choose: "¿Dónde está la decisión oculta?", reveal: "Ver explicación", reset: "Empezar de nuevo", score: "aciertos de 3",
    scenarios: [
      { code: "paymentService.process(invoice, customer, method);", options: ["En el valor de method", "En customer", "No hay una decisión"], answer: 0, explanation: "El llamador ya eligió el medio. chargeCard, createPixCharge o debitWallet hacen explícitos la intención, la autorización y los fallos." },
      { code: "repository.save(order);", options: ["Siempre es incorrecto", "Al elegir entre crear y actualizar", "Solo en la base de datos"], answer: 1, explanation: "Cuando el llamador conoce el ciclo de vida, insert y update evitan que la persistencia tenga que inferirlo. Si el ciclo es un detalle interno, save puede seguir siendo correcto." },
      { code: "order.ship();", options: ["En la comprobación del pago dentro de Order", "En el nombre ship", "No es una decisión oculta"], answer: 2, explanation: "Comprobar que un pedido está pagado es una invariante del propio pedido. El condicional está en el lugar correcto y el contrato expresa la intención." },
    ],
  },
  fr: {
    eyebrow: "Expérience pratique", title: "Trouvez la décision cachée", intro: "Lisez chaque contrat et repérez où un choix est déjà connu. Vos réponses restent dans ce navigateur.", choose: "Où se trouve la décision cachée ?", reveal: "Voir l’explication", reset: "Recommencer", score: "bonnes réponses sur 3",
    scenarios: [
      { code: "paymentService.process(invoice, customer, method);", options: ["Dans la valeur de method", "Dans customer", "Il n’y a pas de décision"], answer: 0, explanation: "L’appelant a déjà choisi le moyen. chargeCard, createPixCharge ou debitWallet rendent explicites l’intention, l’autorisation et les échecs." },
      { code: "repository.save(order);", options: ["C’est toujours incorrect", "Dans le choix entre créer et mettre à jour", "Uniquement dans la base de données"], answer: 1, explanation: "Quand l’appelant connaît le cycle de vie, insert et update évitent à la persistance de devoir le déduire. Si le cycle est un détail interne, save peut rester correct." },
      { code: "order.ship();", options: ["Dans la vérification du paiement au sein de Order", "Dans le nom ship", "Ce n’est pas une décision cachée"], answer: 2, explanation: "Vérifier qu’une commande est payée est un invariant de la commande elle-même. La condition est au bon endroit et le contrat exprime l’intention." },
    ],
  },
  "zh-Hans": {
    eyebrow: "实践实验", title: "找出隐藏的决策", intro: "阅读每个契约，判断哪个选择其实已经明确。答案只保存在此浏览器中。", choose: "隐藏的决策在哪里？", reveal: "查看解释", reset: "重新开始", score: "答对，共 3 题",
    scenarios: [
      { code: "paymentService.process(invoice, customer, method);", options: ["在 method 的值中", "在 customer 中", "不存在决策"], answer: 0, explanation: "调用方已经选择了支付方式。chargeCard、createPixCharge 或 debitWallet 能明确表达意图、授权和失败方式。" },
      { code: "repository.save(order);", options: ["它始终是错的", "在新建与更新的选择中", "只在数据库中"], answer: 1, explanation: "当调用方知道生命周期时，insert 和 update 可以避免让持久化层去推断。如果生命周期属于内部细节，save 仍可能是正确的。" },
      { code: "order.ship();", options: ["在 Order 内部的付款检查中", "在 ship 这个名称中", "这不是隐藏的决策"], answer: 2, explanation: "确认订单已付款是订单自身的不变量。条件判断位于正确的位置，契约也表达了意图。" },
    ],
  },
};
