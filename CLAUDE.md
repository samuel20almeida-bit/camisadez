# Camisadez — Figurinha Personalizada Copa 2026

Next.js 14 App Router + TypeScript + Tailwind CSS + Supabase + Stripe + OpenAI.

## Stack resumida

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 App Router |
| Estilo | Tailwind CSS (tema `brasil.*`) |
| Banco | Supabase (PostgreSQL + Storage) |
| Pagamento | Stripe (checkout + webhook) |
| IA de imagem | OpenAI `gpt-image-1` via `images.edit` |
| Processamento | Sharp (resize, PNG) |
| Animações | Framer Motion |

## Comandos úteis

```bash
npm run dev        # servidor local
npm run build      # build de produção
npm run lint       # ESLint
```

## Branch de desenvolvimento

Sempre desenvolver em `claude/peaceful-bell-TsplY` e fazer push para esse branch.

## UI/UX Pro Max skill

O script de busca de design está disponível localmente:

```bash
python3 .claude/plugins/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain> --stack nextjs
```

Domínios: `product`, `style`, `typography`, `color`, `landing`, `chart`, `ux`

Exemplo:
```bash
python3 .claude/plugins/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py "e-commerce landing page conversion" --domain landing --stack nextjs
```

## Anthropic Skills disponíveis

Clonados em `.claude/plugins/anthropics-skills/skills/`:
- `frontend-design` — interfaces web de alta qualidade
- `canvas-design` — componentes visuais
- `theme-factory` — sistemas de tema/cores
- `web-artifacts-builder` — artefatos web interativos
- e outros (docx, xlsx, pdf, mcp-builder…)
