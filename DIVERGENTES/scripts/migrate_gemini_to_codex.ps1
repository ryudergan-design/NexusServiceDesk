$ErrorActionPreference = 'Stop'

$srcRoot = 'C:\Users\AMC\.gemini'
$dstRoot = 'C:\Users\AMC\.codex\vendor_imports\gemini'
$skillsRoot = 'C:\Users\AMC\.codex\skills'

$copiedSkillNames = New-Object System.Collections.Generic.List[string]
$convertedLegacySkillNames = New-Object System.Collections.Generic.List[string]
$generatedWrapperNames = New-Object System.Collections.Generic.List[string]

New-Item -ItemType Directory -Force -Path $dstRoot | Out-Null
New-Item -ItemType Directory -Force -Path $skillsRoot | Out-Null

function Write-Utf8File {
  param(
    [string]$Path,
    [string]$Content
  )
  Set-Content -Path $Path -Value $Content -Encoding UTF8
}

# 1) Import relevant Gemini assets into Codex vendor_imports
$pathsToCopy = @('commands', 'get-shit-done', 'agents', 'skills', 'jef', 'GEMINI.md')
foreach ($item in $pathsToCopy) {
  $src = Join-Path $srcRoot $item
  if (Test-Path $src) {
    $dst = Join-Path $dstRoot $item
    if (Test-Path $dst) {
      Remove-Item -Recurse -Force $dst
    }
    Copy-Item -Recurse -Force $src $dst
  }
}

$nestedGeminiSkills = Join-Path $srcRoot '.gemini\skills'
if (Test-Path $nestedGeminiSkills) {
  $nestedDst = Join-Path $dstRoot 'legacy-gemini-skills'
  if (Test-Path $nestedDst) {
    Remove-Item -Recurse -Force $nestedDst
  }
  Copy-Item -Recurse -Force $nestedGeminiSkills $nestedDst
}

# 2) Rewrite hardcoded Gemini paths inside imported files to point at Codex vendor_imports
$textFiles = Get-ChildItem -Path $dstRoot -Recurse -File | Where-Object {
  $_.Extension -in '.md', '.toml', '.json', '.cjs', '.txt' -or $_.Name -match '^[^.]+$'
}

foreach ($file in $textFiles) {
  $content = Get-Content -Raw $file.FullName
  $updated = $content
  $updated = $updated.Replace('C:/Users/AMC/.gemini', 'C:/Users/AMC/.codex/vendor_imports/gemini')
  $updated = $updated.Replace('C:\Users\AMC\.gemini', 'C:\Users\AMC\.codex\vendor_imports\gemini')
  $updated = $updated.Replace('$HOME/.gemini', '$HOME/.codex/vendor_imports/gemini')
  $updated = $updated.Replace('@./.gemini/', '@C:/Users/AMC/.codex/vendor_imports/gemini/')
  $updated = $updated.Replace('./.gemini/', 'C:/Users/AMC/.codex/vendor_imports/gemini/')

  if ($updated -ne $content) {
    Write-Utf8File -Path $file.FullName -Content $updated
  }
}

# 3) Copy Gemini skill directories that already use SKILL.md into Codex skills
$geminiSkillDirs = Get-ChildItem -Path (Join-Path $srcRoot 'skills') -Directory -ErrorAction SilentlyContinue
foreach ($dir in $geminiSkillDirs) {
  $destDir = Join-Path $skillsRoot $dir.Name
  if (-not (Test-Path $destDir)) {
    Copy-Item -Recurse -Force $dir.FullName $destDir
    [void]$copiedSkillNames.Add($dir.Name)
  }
}

# 4) Convert loose Gemini markdown skills into Codex skill directories
$legacySkillFiles = Get-ChildItem -Path $nestedGeminiSkills -File -Filter '*.md' -ErrorAction SilentlyContinue
foreach ($file in $legacySkillFiles) {
  $baseName = [IO.Path]::GetFileNameWithoutExtension($file.Name)
  $skillName = $baseName
  $destDir = Join-Path $skillsRoot $skillName
  New-Item -ItemType Directory -Force -Path $destDir | Out-Null

  $raw = Get-Content -Raw $file.FullName
  $firstLine = ($raw -split "`r?`n" | Where-Object { $_.Trim() -ne '' } | Select-Object -First 1)
  $desc = if ($firstLine) { $firstLine.TrimStart('#').Trim() } else { "Migrated Gemini skill: $skillName" }
  $yamlDesc = $desc.Replace('"', '\"')
  $skillContent = @"
---
name: "$skillName"
description: "$yamlDesc"
metadata:
  short-description: "$yamlDesc"
---

<migration_note>
Migrated from Gemini legacy skill `$($file.FullName)`.
</migration_note>

$raw
"@

  Write-Utf8File -Path (Join-Path $destDir 'SKILL.md') -Content $skillContent
  [void]$convertedLegacySkillNames.Add($skillName)
}

# 5) Generate Codex skill wrappers for Gemini commands that do not already exist in Codex
$adapter = @'
<codex_skill_adapter>
## A. Skill Invocation
- This skill is invoked by mentioning the skill name shown in the frontmatter.
- Treat all user text after the skill mention as {{GSD_ARGS}}.
- If no arguments are present, treat {{GSD_ARGS}} as empty.

## B. AskUserQuestion -> request_user_input Mapping
- Map AskUserQuestion to Codex request_user_input.
- Convert each option to a label plus short description.
- If multiple questions appear, batch them in one request when possible.
- If multi-select is requested, ask sequentially or accept a comma-separated freeform response.

## C. Task() -> spawn_agent Mapping
- Map Task(subagent_type="X", prompt="Y") to spawn_agent(agent_type="X", message="Y").
- Omit inline model selection if present.
- Wait for delegated agents only when their result is needed on the critical path.
</codex_skill_adapter>
'@

$commandSets = @(
  @{ Prefix = 'gsd'; Path = Join-Path $srcRoot 'commands\gsd' },
  @{ Prefix = 'jef'; Path = Join-Path $srcRoot 'commands\jef' }
)

foreach ($set in $commandSets) {
  if (-not (Test-Path $set.Path)) { continue }

  $tomlFiles = Get-ChildItem -Path $set.Path -File -Filter '*.toml'
  foreach ($toml in $tomlFiles) {
    $baseName = [IO.Path]::GetFileNameWithoutExtension($toml.Name)
    $skillName = "$($set.Prefix)-$baseName"
    $destDir = Join-Path $skillsRoot $skillName
    $destSkillFile = Join-Path $destDir 'SKILL.md'
    $shouldWrite = $true
    if (Test-Path $destDir) {
      if (Test-Path $destSkillFile) {
        $existing = Get-Content -Raw $destSkillFile
        if ($existing -notmatch 'Migrated from Gemini command') {
          $shouldWrite = $false
        }
      }
    }
    if (-not $shouldWrite) { continue }

    $raw = Get-Content -Raw $toml.FullName
    $descMatch = [regex]::Match($raw, 'description\s*=\s*"([^"]*)"')
    $promptMatch = [regex]::Match($raw, 'prompt\s*=\s*"""(?s)(.*)"""')
    $desc = if ($descMatch.Success) { $descMatch.Groups[1].Value } else { "Migrated Gemini command $skillName" }
    $prompt = if ($promptMatch.Success) { $promptMatch.Groups[1].Value.Trim() } else { "<process>`nUse the imported Gemini command at $($toml.FullName).`n</process>" }
    $prompt = $prompt.Replace('C:/Users/AMC/.gemini', 'C:/Users/AMC/.codex/vendor_imports/gemini')
    $prompt = $prompt.Replace('C:\Users\AMC\.gemini', 'C:\Users\AMC\.codex\vendor_imports\gemini')
    $prompt = $prompt.Replace('$HOME/.gemini', '$HOME/.codex/vendor_imports/gemini')
    $prompt = $prompt.Replace('@./.gemini/', '@C:/Users/AMC/.codex/vendor_imports/gemini/')
    $prompt = $prompt.Replace('./.gemini/', 'C:/Users/AMC/.codex/vendor_imports/gemini/')
    $migratedCommandPath = $toml.FullName.Replace('C:\Users\AMC\.gemini', 'C:\Users\AMC\.codex\vendor_imports\gemini')
    $yamlDesc = $desc.Replace('"', '\"')

    $skillFile = @"
---
name: "$skillName"
description: "$yamlDesc"
metadata:
  short-description: "$yamlDesc"
---

$adapter

<migration_note>
Migrated from Gemini command $migratedCommandPath.
Original command label: `/$($set.Prefix):$baseName`
</migration_note>

$prompt
"@

    New-Item -ItemType Directory -Force -Path $destDir | Out-Null
    Write-Utf8File -Path $destSkillFile -Content $skillFile
    [void]$generatedWrapperNames.Add($skillName)
  }
}

# 6) Write a migration manifest
$skillDirs = Get-ChildItem -Path $skillsRoot -Directory
$copiedSkillLines = if ($copiedSkillNames.Count) {
  ($copiedSkillNames | Sort-Object | ForEach-Object { '- ' + $_ }) -join "`n"
} else {
  '- none (all already existed)'
}
$generatedWrapperLines = if ($generatedWrapperNames.Count) {
  ($generatedWrapperNames | Sort-Object | ForEach-Object { '- ' + $_ }) -join "`n"
} else {
  '- none (all already existed)'
}
$convertedLegacyLines = if ($convertedLegacySkillNames.Count) {
  ($convertedLegacySkillNames | Sort-Object | ForEach-Object { '- ' + $_ }) -join "`n"
} else {
  '- none'
}

$manifest = @"
# Gemini to Codex Migration

Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

Imported into vendor_imports:
- commands
- get-shit-done
- agents
- skills
- jef
- GEMINI.md
- legacy-gemini-skills

Copied Gemini skill directories:
$copiedSkillLines

Generated command wrappers:
$generatedWrapperLines

Converted legacy Gemini skills:
$convertedLegacyLines
"@

Write-Utf8File -Path (Join-Path $dstRoot 'MIGRATION_SUMMARY.md') -Content $manifest

# 7) Print quick summary for verification
$result = [pscustomobject]@{
  vendor_import_root = $dstRoot
  imported_gsd_command_count = (Get-ChildItem -Path (Join-Path $dstRoot 'commands\gsd') -File -Filter '*.toml' -ErrorAction SilentlyContinue | Measure-Object).Count
  imported_jef_command_count = (Get-ChildItem -Path (Join-Path $dstRoot 'commands\jef') -File -Filter '*.toml' -ErrorAction SilentlyContinue | Measure-Object).Count
  copied_skill_dir_count = ($geminiSkillDirs | Measure-Object).Count
  converted_legacy_skill_count = ($legacySkillFiles | Measure-Object).Count
  total_codex_skills = ($skillDirs | Measure-Object).Count
}

$result | ConvertTo-Json -Depth 4
