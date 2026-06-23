# RootMap Security Audit & Compliance Checklist

This document provides a strict, production-grade security checklist for developers working on the RootMap project. It addresses secret management, input sanitization, automated static analysis (Bandit), and dependency auditing for both the Python-based genomic mapping and Node.js-based web dashboard modules.

---

## 🔑 1. Secrets & Environment Variable Management

- [ ] **Zero Hardcoded Secrets**: Ensure no API keys (NCBI, Gemini, Vercel tokens) are ever hardcoded in the codebase.
- [ ] **Dotenv Integration**: Use `python-dotenv` for Python (`antigravity_orchestrator.py`) and `dotenv` for Node.js (`server.js`) to load credentials dynamically.
- [ ] **Config Check**: Validate that `.env` is listed in `.gitignore` and `.env.example` contains only non-sensitive placeholders.
- [ ] **Local Validation**: Implement checks on startup to fail immediately if required API credentials are missing.
- [ ] **CI/CD Injection**: Configure secrets in hosting environments (e.g., Vercel environment variables, GitHub Actions secrets) rather than deployment configurations.

---

## 🧬 2. Bioinformatics & Input Validation Security

Because biological sequences contain arbitrary textual data, genomic parsers can be vulnerable to directory traversal, command injection, and denial of service (DoS).

- [ ] **Allowed Extensions Only**: Restrict incoming file extensions to an explicit whitelist (e.g., `.fasta`, `.fa`, `.fastq`, `.fq`).
- [ ] **Strict Filename Sanitization**: Sanitize sequence filenames using whitelist characters (`[a-zA-Z0-9_-.]`). Reject names containing control characters, shell operators (`;`, `&`, `|`, `$`), or backticks.
- [ ] **Path Traversal Protection**: Resolve input file paths absolutely using `os.path.abspath` and verify that the target path resides strictly within the designated `data/` subdirectory.
- [ ] **File Size Bounds**: Enforce a maximum file size limit (e.g., 50MB) to prevent memory allocation exploits and disk space exhaustion.
- [ ] **Content Integrity Inspection**:
  - Verify headers (e.g., FASTA must begin with `>` and FASTQ must begin with `@`).
  - Scan the initial buffer for binary signatures (`ELF`, `MZ` headers) or scripting languages (`<script>`, `<?php`, `#!/bin/` shell bang lines) and abort if found.
  - Verify character spectra (DNA/RNA/proteins should only consist of standard IUPAC characters and optional whitespace).

---

## 🛡️ 3. Static Analysis & Code Scanning

### Python Code Scanning with Bandit
[Bandit](https://github.com/PyCQA/bandit) is a tool designed to find common security issues in Python code.

1. **Install Bandit**:
   ```bash
   pip install bandit
   ```
2. **Run Security Scan**:
   ```bash
   bandit -r antigravity_orchestrator.py
   ```
3. **Automate**: Run Bandit as a pre-commit hook or part of the CI/CD pipeline. Any vulnerability of medium severity or higher must block build integration.

### Node.js Code Scanning
1. **NPM Audit**: Scan dependencies for known security vulnerabilities.
   ```bash
   npm audit
   ```
2. **ESLint Security Plugin**: Install and configure `eslint-plugin-security` to detect potential vulnerabilities in Javascript code.

---

## 🌐 4. Infrastructure & Running Daemon Safety

- [ ] **Least Privilege Access**: Run the background Python orchestrator (`antigravity_orchestrator.py`) under a dedicated, non-privileged system user (e.g., `rootmap-service`), never as `root` or `Administrator`.
- [ ] **Read/Write Restrictions**: Limit the daemon user's write access strictly to `data/` (for archiving/temporary parsing) and the dashboard's public assets folder (for exporting `genomic_results.json`).
- [ ] **Daemon Isolation**: In containerized environments, use lightweight alpine-based containers with read-only root filesystems where possible.
