# AI.md — FireWatch · Null Squad · Web Development

Registro de uso de Inteligência Artificial, conforme exigido pelo Prof. Daniel Cintra.

---

## Interação 1

**Solicitado:** Slideshow em JavaScript puro com 3 slides SVG temáticos, autoplay e swipe mobile.

**Retornado:** Código de slideshow com `querySelectorAll`, `classList`, `setInterval` e eventos `touchstart`/`touchend`. SVGs inline para os 3 slides: cena de queimadas, mapa orbital e gráfico de barras.

**Alterações:** Cores dos SVGs ajustadas para as variáveis CSS do projeto. Textos revisados com dados reais do INPE 2023.

---

## Interação 2

**Solicitado:** Quiz dinâmico com 10 perguntas sobre queimadas e FireWatch, barra de progresso, feedback visual e tela de resultado com revisão.

**Retornado:** Array de objetos com pergunta, opções, índice correto e explicação. Renderização via `createElement`/`appendChild`. Resultado com ícone por faixa de pontuação.

**Alterações:** Perguntas revisadas com fontes do INPE e NASA FIRMS. Cores de acerto/erro vinculadas às variáveis CSS.

---

## Interação 3

**Solicitado:** Formulário com validação em JS puro: campos obrigatórios, regex de e-mail, checkbox de termos e feedback visual inline.

**Retornado:** Função `validarForm()` com array de campos, regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, validação em tempo real e tela de sucesso via `style.display`.

**Alterações:** Botão "Novo cadastro" adicionado pela equipe. Estilização adaptada à identidade do FireWatch.

---

## Interação 4

**Solicitado:** Theme switcher com 3 temas (Fogo, Oceano, Floresta) via CSS custom properties e persistência com `localStorage`.

**Retornado:** Objeto com variáveis por tema, `document.documentElement.style.setProperty()` e `localStorage.setItem/getItem`.

**Alterações:** Cores do tema Oceano ajustadas para maior contraste (acessibilidade). Tema Floresta mantido com verde escuro.

---

## Pesquisa independente da equipe (sem uso de IA)

As funcionalidades abaixo foram implementadas pela equipe com base em pesquisa autônoma na documentação MDN Web Docs, fora do conteúdo obrigatório da disciplina, como iniciativa de aprimoramento do projeto:

**Canvas API (`<canvas>` + `requestAnimationFrame`)**
Utilizada para o fundo animado com estrelas e nebulosas. A equipe estudou os métodos `getContext('2d')`, `createRadialGradient`, `arc` e o loop de animação com `requestAnimationFrame` diretamente na documentação MDN. Nenhuma IA foi utilizada para esta parte — o código foi escrito e testado manualmente pela equipe.

**IntersectionObserver API**
Utilizada para o efeito de scroll reveal (elementos aparecem ao entrar na viewport). A equipe pesquisou o construtor `new IntersectionObserver()`, as opções `threshold` e `rootMargin`, e o método `observe()` na documentação MDN.