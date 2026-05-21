# Git Commit Message Convention (Angular Style)_Rev1.0

{link_to_translation}`zh_CN:[中文]`

## 1 Revision History

| Version | Date | Author | Reviewer | Revision Content |
| ---- | ---- | ---- | ---- | ---- |
| 1.0 | 2026-04-17 | sxx | zlc | Document created |

## 2 Introduction

This project follows the [Angular Commit Message Convention](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit), aiming to improve project readability and maintainability through a unified commit message format.

Standardized commit messages provide the following benefits:

- **Auto-generate CHANGELOG**: Tools can automatically categorize change logs based on type
- **Quickly locate changes**: Filter specific module history through scope
- **Semantic versioning**: Determine version bump level (major / minor / patch) based on type
- **Improve collaboration efficiency**: Team members can understand the intent of each commit without opening the code

---

## 3 Commit Message Format

Each commit message consists of three parts: **Header**, **Body**, and **Footer**, separated by a blank line.

```
(Required) <type>(<scope>): <subject>
(blank line)
(Optional) <body>
(blank line)
(Optional) <footer>
```

**Example**

```
feat(spi): add DMA transfer mode support

1. Add DMA transfer channel configuration in SPI driver
2. Support high-speed data transfer for large volumes, reducing CPU usage
3. Original polling transfer mode remains unchanged, DMA mode enabled via config parameter

Closes #45
```

> **Note**: Header is the only required part. Body and Footer can be included based on the complexity of the commit.
> For simple changes (e.g., fixing a typo), only the Header is needed; for complex changes, it is recommended to add a Body explaining the reason.

---

## 4 Header Details (Required)

The Header is the first line of the commit message and the most important part. Format:

```
<type>(<scope>): <subject>
```

The Header consists of three fields:

| Field | Required | Description |
| --------- | -------- | ------------------------ |
| `type` | Required | Type of commit, see table below |
| `scope` | Optional | Module or scope affected by this commit |
| `subject` | Required | Brief description of what this commit does |

### 4.1 Type Description

Type identifies the nature of the commit. Only the following values are allowed:

| Type | Description | Version Impact |
| ---------- | ------------------------------------------------------------ | ---------- |
| `feat` | New feature or capability | minor bump |
| `fix` | Fix an existing bug | patch bump |
| `docs` | Documentation only (README, comments, API docs, etc.) | none |
| `style` | Code formatting changes that don't affect logic (spaces, indentation, semicolons, line breaks) | none |
| `refactor` | Code refactoring, neither a new feature nor a bug fix (e.g., extracting functions, renaming) | none |
| `perf` | Code changes aimed at improving performance | patch bump |
| `test` | Adding missing tests or correcting existing tests | none |
| `build` | Changes affecting the build system or external dependencies (e.g., Makefile, linker scripts) | none |
| `ci` | Changes to CI/CD configuration files and scripts (e.g., GitHub Actions, Jenkins) | none |
| `chore` | Other miscellaneous changes not involving source code or test files | none |
| `revert` | Revert a previous commit | depends |

> **How to distinguish `fix` and `refactor`**: If the code change fixes a known issue or abnormal behavior, use `fix`;
> if it only improves code structure without changing functionality, use `refactor`.
>
> **How to distinguish `feat` and `perf`**: If a user-perceivable capability is added, use `feat`;
> if functionality remains the same but runs faster, use `perf`.
>
> **How to distinguish `style` and `refactor`**: `style` only involves formatting (spaces, indentation, line breaks),
> the code's AST (Abstract Syntax Tree) remains unchanged; `refactor` involves adjustments to code logic structure (e.g., extracting functions, renaming variables).

### 4.2 Scope Description

Scope indicates the module or subsystem affected by this commit, helping to quickly filter in git log.
Scope should use lowercase English words and be kept short. Common scopes in this project include:

| Scope | Applicable Scenario |
| ---------- | ------------------------------------------ |
| `gpio` | GPIO peripheral driver related |
| `i2c` | I2C peripheral driver related |
| `spi` | SPI peripheral driver related |
| `uart` | UART peripheral driver related |
| `adc` | ADC peripheral driver related |
| `pwm` | PWM peripheral driver related |
| `base` | Base package / framework / system initialization |
| `lvgl` | LVGL GUI framework related |
| `examples` | Example code |
| `docs` | Documentation |
| `build` | Build system (Makefile, linker scripts, bat, etc.) |
| `config` | Configuration files (pin config, system parameters, etc.) |
| `tools` | Auxiliary tools and scripts |

> If the commit involves multiple modules, you can omit the scope or choose the most impacted module.
> When the scope of change is too broad, omitting the scope is better than writing an inaccurate one.

### 4.3 Subject Rules

The subject is a one-line summary of the change and must follow these rules:

1. **Length limit**: No more than 72 characters (entire Header line should not exceed 72 characters)
2. **Language**: Chinese or English are both acceptable, but should be consistent within the same project
3. **No period**: Do not end with a period (neither "." nor Chinese "。")
4. **Imperative mood**: In English, start with a verb in its base form (e.g., `add`, `fix`, `remove`), not `added` or `fixes`
5. **Describe what was done**: Not why or how (those belong in the Body)

**Good subject examples**:

```
feat(spi): add DMA transfer mode support
fix(uart): fix baud rate divider overflow at high rates
refactor(config): extract pin mapping table into independent config array
```

**Bad subject examples**:

```
feat(spi): added DMA transfer mode support.    ← don't add period
fix: fixed a bug                               ← don't use past tense, description too vague
update code                                    ← missing type, vague description
```

---

## 5 Body Details (Optional)

The Body supplements the Header's subject, explaining **why this change was made** and **the behavioral differences before and after**.

### 5.1 Writing Rules

1. Must be separated from the Header by a **blank line**
2. Each line should not exceed 72 characters; manually wrap when exceeding
3. Use **numbered lists** (1, 2, 3, ...) to list change points
4. Focus on **motivation (Why)** and **before/after comparison (What changed)**, rather than listing which files were changed line by line
5. Include at least 2 or more description items

### 5.2 When to Write Body

- The reason for the change is not immediately obvious from the code diff
- Background or context needs to be explained
- The change involves performance data changes (recommend including before/after comparison data)
- Alternative approaches exist but the current one was chosen (explain why)

### 5.3 When Body Can Be Omitted

- The change is very simple and the subject is sufficient (e.g., fixing a typo)
- Pure formatting or documentation changes

---

## 6 Footer Details (Optional)

The Footer records two types of information: **Breaking Changes** and **Related Issues**.

### 6.1 Breaking Changes (BREAKING CHANGE)

If this commit introduces changes incompatible with previous versions (e.g., interface signature changes, configuration format changes, removal of existing features), it **must** be declared in the Footer. Format:

```
BREAKING CHANGE: <detailed description of the incompatible change>
```

Additionally, it is recommended to add a `!` after the type in the Header as a prominent marker:

```
feat(base)!: <subject>
```

> `BREAKING CHANGE` must be uppercase, followed by an English colon and a space.
> This is the standard format for tools to identify breaking changes; do not use other formats.

### 6.2 Related Issues

If this commit resolves an Issue, it can be linked in the Footer:

```
Closes #123
```

Multiple Issues can be linked simultaneously:

```
Closes #123, #456, #789
```

> Using the `Closes` keyword will automatically close the corresponding Issue when the commit is merged into the main branch.
> Other supported keywords include: `Fixes`, `Resolves`.

---

## 7 Complete Examples

### 7.1 feat — New Feature

```
feat(spi): add DMA transfer mode support

1. Add DMA transfer channel configuration in SPI driver
2. Support high-speed data transfer for large volumes, reducing CPU usage
3. Original polling transfer mode remains unchanged, DMA mode enabled via config parameter

Closes #45
```

### 7.2 fix — Bug Fix

```
fix(uart): fix baud rate calculation overflow above 115200

1. Original divider coefficient stored as uint16_t
2. When target baud rate exceeds 115200, multiplication intermediate result overflows, causing significant actual baud rate deviation
3. Changed to uint32_t for intermediate calculation results, ensuring accuracy up to 921600 baud rate
```

### 7.3 docs — Documentation Change

```
docs: add OTA upgrade process description and common error code list

1. Add OTA chapter under docs directory
2. Cover upgrade package creation, transfer protocol, and verification process
3. Compile 20 common error codes and their troubleshooting methods
```

### 7.4 style — Code Formatting

```
style(gpio): unify header file indentation to 4 spaces

1. Replace tab indentation with 4-space indentation in all gpio module header files
2. Maintain consistency with other project modules
3. No logic changes involved
```

### 7.5 refactor — Refactoring

```
refactor(config): extract hardcoded pin mapping table into independent config array

1. Previously, pin mappings for each model were scattered across multiple switch-case branches
2. Now unified into pin_map_table array
3. Adding new models only requires adding one line to the array, no driver logic changes needed
```

### 7.6 perf — Performance Optimization

```
perf(lvgl): optimize partial screen refresh algorithm to reduce SPI transfer volume

1. Previous implementation transferred full screen data (240x320) on every refresh
2. Now only transfers dirty region pixels
3. In typical UI scenarios, frame rate improved from 12fps to 24fps, SPI bus usage reduced by ~60%
```

### 7.7 test — Testing

```
test(i2c): add unit test cases for slave address scanning

1. Correctly returns address when single slave exists on bus
2. Returns complete address list when multiple slaves exist on bus
3. Returns empty list when bus is idle
4. Timeout handling when SDA line is pulled low
```

### 7.8 build — Build Related

```
build: upgrade GCC cross-compilation toolchain to arm-none-eabi-gcc 12.3

1. Old version 10.3 has a known register allocation bug with -O2 optimization (GCC Bugzilla #98702)
2. Issue is fixed after upgrading to 12.3
3. Simultaneously update toolchain path and compilation parameters in Makefile
```

### 7.9 chore — Miscellaneous

```
chore: clean up expired build artifacts in gccout directory

1. Delete .o and .bin files left over from 3 months ago
2. Free approximately 120MB of disk space
3. All files in this directory are build-generated and can be restored by recompiling
```

### 7.10 revert — Revert Commit

```
revert: revert "feat(spi): add DMA transfer mode support"

This reverts commit a1b2c3d.

1. DMA channel conflicts with low-power wake-up interrupt resources
2. DMA transfer loses data after deep sleep wake-up
3. Temporarily reverted, will resubmit after conflict is resolved
```

### 7.11 BREAKING CHANGE — Incompatible Change

```
feat(base)!: change system initialization to phased callback mechanism

1. Original single entry function AppMain() split into three phase callbacks
2. AppEarlyInit(): peripheral clock and pin initialization (interrupts disabled)
3. AppInit(): driver and middleware initialization (interrupts enabled)
4. AppReady(): application logic startup (all subsystems ready)

BREAKING CHANGE: AppMain() has been removed, all application code needs to
migrate to the new three-phase callback interface. See docs/migration-v2.md
for migration guide.
```

---

## 8 Special Cases

### 8.1 One Commit Involves Multiple Types

In principle, **each commit should do only one thing**. If a single change includes both a new feature and a bug fix, it should be split into two independent commits. If splitting is truly not possible, use the type of the **primary change**.

### 8.2 Commit Message Needs Modification

If you find the most recent commit message is incorrect, use `git commit --amend` to modify it.
If you need to modify an earlier commit, use `git rebase -i` (only for commits not yet pushed to remote).

> **Warning**: Do not perform amend or rebase on commits already pushed to remote,
> as this will cause conflicts in other team members' local repositories.

### 8.3 Merge Commits

Merge commits generated when merging branches can retain Git's auto-generated message and do not need to follow this convention.

---

## 9 Recommendations

1. **Atomic commits**: Each commit should do only one thing; avoid mixing unrelated changes together
2. **Write Header before coding**: Think about the type and subject before making changes to help keep commits focused
3. **Concise Header, detailed Body**: Things that can't be explained in one sentence go in the Body
4. **Always declare breaking changes**: When interfaces change, BREAKING CHANGE must be written in the Footer
5. **Commit frequently**: Don't accumulate large amounts of changes for a single commit; small frequent commits are easier to trace and locate issues
6. **Use scope wisely**: Make `git log --oneline` output clear at a glance
