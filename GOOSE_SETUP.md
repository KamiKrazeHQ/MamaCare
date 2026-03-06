# Goose Setup for forHer

## 1) Install status

Goose CLI is installed on this machine at:

- `C:\Users\nisit\.local\bin\goose.exe`

Verified version:

- `1.23.2`

## 2) PATH setup

User PATH now includes:

- `C:\Users\nisit\.local\bin`

Open a new PowerShell window, then verify:

```powershell
goose --version
```

## 3) Configure your model provider (one-time)

Run:

```powershell
goose configure
```

In the setup flow, choose one:

- Quick setup with API key
- ChatGPT subscription
- Tetrate Agent Router
- OpenRouter
- Manual provider configuration

## 4) Start Goose in this project

From repo root:

```powershell
cd C:\Users\nisit\forHer
goose session
```

This project includes `.goosehints` with repo-specific guardrails and commands.

## 5) Project guardrail already encoded

- In `backend/`, only `app.py` should be modified unless explicitly overridden.
