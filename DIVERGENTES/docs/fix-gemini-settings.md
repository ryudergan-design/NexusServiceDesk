# Objetivo
Corrigir o arquivo `settings.json` do Gemini CLI para remover chaves não reconhecidas no tema personalizado "High Tech".

# Arquivos e Contexto
- `C:\Users\AMC\.gemini\settings.json`

# Passos de Implementação
1. Executar um script PowerShell para ler o arquivo `C:\Users\AMC\.gemini\settings.json`.
2. Remover as propriedades inválidas: `background.secondary`, `background.accent`, `border`, `status.info` e `ansi` dentro de `ui.customThemes."High Tech"`.
3. Salvar o JSON corrigido de volta no arquivo.

# Verificação
- Garantir que o script foi executado com sucesso e o arquivo foi atualizado.