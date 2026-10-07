---
layout: ../layouts/PageLayout.astro
title: Hacking
description: 'OSVR, from NAND to 0-day: my curriculum for vulnerability research, and how far through it I am.'
---

## OSVR: from NAND to 0-day

A dependency-first curriculum for offensive vulnerability research and exploit development, from zero to published original research. The order comes from what each skill needs before it, not from what is popular.

The spine is **binary / systems vulnerability research**. A **web / cloud fork** runs in parallel with an earlier path to paid work. Phases 0–4 are a common foundation either way; the choice between them is made at Phase 5, once the foundation shows which one I'm drawn to, and not before.

## Progress

**Now:** Phase 1, The Machine.

- [ ] Phase 0: Prerequisites
- [ ] Phase 1: The Machine
- [ ] Phase 2: The Program
- [ ] Phase 3: The Instruction Stream
- [ ] Phase 4: The System
- [ ] Phase 5a: The Boundary
- [ ] Phase 5b: The Application Surface (fork)
- [ ] Phase 6: The Bug
- [ ] Phase 7: The Defended Target
- [ ] Phase 8: The Theory
- [ ] Phase 9: The Research
- [ ] Phase 10: The Frontier

A phase is ticked when its gate is passed, not when its resources are finished.

## The rules

1. **Gates are the only exit.** Not "I covered it", not "I get it". Pass the unaided test or stay in the phase.
2. **Ship something public every 14 days.** A commit, a writeup, a patch, a note. With no degree, this is the degree.
3. **Pass the gate, not the syllabus.** Finishing the resources and passing the gate are different events. Only one counts.
4. **Written authorization or nothing** against any system I don't own, from Phase 5 on.
5. **One primary domain at a time**, at most one secondary.

From Phase 6 on, a gate means finding something nobody pointed me at. Reproducing a writeup is study, not a pass. Every gate doubles as a skip test: pass it cold and the phase is done.

## The dependency graph

```
LAYER 0  Linux+CLI ...... programming literacy ...... math
                                                      (algebra -> proofs/induction -> discrete)
LAYER 1  shell-as-adversary   machine model (gates -> CPU -> memory)   CS theory [deferred to L8]
LAYER 2  C + memory model ... data structures (implement, don't import)
LAYER 3  x86-64 asm (read fluently) <--- architecture
LAYER 4  toolchain/loader/formats --- OS internals --- concurrency --- networking
LAYER 5a LAW + authorization + lab (HARD GATE, blocks everything below)
LAYER 5b access control --- crypto (build before break) --- web + browser model --- [FORK]
LAYER 6  static+dynamic RE -> bug classes -> primitives + shellcode (mitigations OFF)
LAYER 7  mitigations + bypass -> heap -> code reuse -> reliability -> ARM64
LAYER 8  automata + decidability -> compilers + dataflow + SSA -> static analysis
LAYER 9  source auditing --- fuzzing --- symbolic exec --- n-day/patch-diff
         triage + exploitability --- disclosure --- Rust/Go FFI boundary
LAYER 10 one or two branches: kernel / browser+JIT / windows / hypervisor / firmware /
         mobile / smart contracts / program analysis / RF / cloud+web VR
```

The hard edges:

- **No C before the machine model.** Pointers are trivial once addresses are real.
- **No exploitation before assembly fluency and OS internals.** You cannot exploit what you cannot read.
- **Written authorization before touching anything I don't own** (Phase 5 on).
- **Theory before the work that consumes it:** program analysis, symbolic execution, JIT, deobfuscation.
- **Exploitation competence before original research.** Auditing without knowing what is exploitable produces reports nobody acts on.
- Stack before heap. Heap is the wall.

## The sequence

### Phase 0: Prerequisites

Use the Linux CLI daily, write a small program from scratch, prove a statement by induction. No calculus.

| Resource | What for | Hours |
| --- | --- | --- |
| [OverTheWire Bandit](https://overthewire.org/wargames/bandit/) | The shell through a wargame, all levels | 40–80 |
| [The Linux Command Line](https://linuxcommand.org/tlcl.php) | Reference | — |
| [Harvard CS50x](https://cs50.harvard.edu/x/) | Programming literacy, through the C and memory weeks | 60–120 |
| [Khan Academy Algebra 1](https://www.khanacademy.org/math/algebra) → [2](https://www.khanacademy.org/math/algebra2) | The floor: weak algebra sinks induction | 30–60 |
| [Book of Proof](https://richardhammack.github.io/BookOfProof/) | Logic, proof methods, induction | 40–70 |
| [MIT 6.042J](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/) | Graph theory and number theory only | 20–30 |

**Gate:** the three tasks above, cold, no reference.

### Phase 1: The Machine

What a computer physically does, in a fortnight, not a season.

| Resource | What for | Hours |
| --- | --- | --- |
| [*Code*, Petzold, 2nd ed.](https://www.codehiddenlanguage.com/) | NAND to CPU, readable on a bus | 20 |
| [Nand2Tetris](https://www.nand2tetris.org/) projects 1–5 | Build the ALU; numeracy by construction. Stop at 5 | 30 |
| [picoCTF](https://picoctf.org/) | Beginner encoding, forensics, trivial reversing | 5 |

The Hack machine has no cache, MMU or privilege rings: it teaches that computers are comprehensible, not the machine I'll attack.

**Artifact:** base conversion and fixed-width arithmetic from scratch, plus an explainer of two's complement and IEEE-754.

**Gate (1 h):** a 32-bit hex word on paper, read as unsigned, two's-complement, IEEE-754 single and four ASCII bytes, by hand, under 5 minutes. Then what two words overflow to when added, and the bytes in little- vs big-endian.

### Phase 2: The Program

C properly, the process as a laid-out address space, data structures implemented rather than imported.

| Resource | What for | Hours |
| --- | --- | --- |
| [CS50x](https://cs50.harvard.edu/x/) weeks 1–5 | C, first pass. Stop at week 5 | 80 |
| [*Modern C*, Gustedt](https://gustedt.gitlabpages.inria.fr/modern-c/) | C, second pass, never before CS50 | 70 |
| Data structures in C | Dynamic array, linked list, hash table, BST, graph with BFS/DFS | 90 |
| [*Algorithms*, Erickson](https://jeffe.cs.illinois.edu/teaching/algorithms/) | The chapters the data structures touch | 60 |
| [*Discrete Math*, Levin](https://discrete.openmathbooks.org/dmoi3.html) | Prerequisite for theory and crypto | — |
| [Nand2Tetris](https://www.nand2tetris.org/) project 6 | Write the assembler | 15 |
| My own C program | 1,000+ lines, with tests, something I wanted | 25 |
| Valgrind, ASan, UBSan, gdb | From week one | — |
| [cppreference](https://en.cppreference.com/w/c) | Undefined behaviour is a vulnerability class | — |
| [pwn.college](https://pwn.college/dojos) Intro to Cybersecurity | Security thread | 20 |

**Artifact:** the C program, public, with its design decisions and tests.

**Gate (3 h):** draw a recursive function's stack frame at maximum depth and verify it against the compiled binary; classify five behaviours as defined, unspecified, implementation-defined or undefined; prove a data structure's invariant by induction.

### Phase 3: The Instruction Stream

Read compiled x86-64 and reconstruct the source, without a decompiler.

| Resource | What for | Hours |
| --- | --- | --- |
| [pwn.college](https://pwn.college/dojos) Computing 101, Playing With Programs | Hands-on first | 70 |
| [OST2](https://p.ost2.fyi/) Arch1001 | x86-64 assembly, in depth | 80 |
| [OST2](https://p.ost2.fyi/) Dbg1012 | GDB fluency | 15 |
| [CS:APP, 3rd ed.](https://csapp.cs.cmu.edu/) | The bomb lab and attack lab | 60 |
| [Compiler Explorer](https://godbolt.org/) | Source and assembly side by side, always open | — |
| [*Reverse Engineering for Beginners*](https://beginners.re/) | Reference, never front to back | 50 |
| [challenges.re](https://challenges.re/) | Between the ramp and real binaries | 20 |
| [crackmes.one](https://crackmes.one/) | Volume | 25 |
| [Intel SDM](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html) | One instruction at a time, forever | — |

**Artifact:** an annotated disassembly of my own program, every instruction explained.

**Gate (3 h):** an unseen stripped binary: calling convention, argument count and types, the syscall boundary. Disassembler only, no internet.

### Phase 4: The System

Down to the syscall boundary, until loader, instruction stream, kernel and wire are visible at once.

| Resource | What for | Hours |
| --- | --- | --- |
| [*OSTEP*](https://pages.cs.wisc.edu/~remzi/OSTEP/) | Virtualization, concurrency, persistence; do the projects | 110 |
| [MIT 6.1810](https://pdos.csail.mit.edu/6.1810/) | xv6 labs: page tables, traps, threads, a filesystem | 90 |
| [OST2](https://p.ost2.fyi/) Arch2001 | x86-64 OS internals, after Arch1001 | 60 |
| [The Life of Binaries](https://www.opensecuritytraining.info/LifeOfBinaries.html) | Compile, link, load, run as one story | 30 |
| ELF and PE by hand | Write a parser for each | 40 |
| [*Computer Networks: A Systems Approach*](https://book.systemsapproach.org/) | The model | 50 |
| [Stanford CS144](https://cs144.github.io/) | Build a working TCP | 50 |
| [Beej's networking guide](https://beej.us/guide/bgnet/) | Write the clients | 40 |
| [*The Little Book of Semaphores*](https://greenteapress.com/wp/semaphores/) | Races are a bug class | 20 |
| *The Linux Programming Interface* | Syscall reference | — |
| [xv6](https://github.com/mit-pdos/xv6-riscv), [musl](https://musl.libc.org/) or [SQLite](https://www.sqlite.org/src/doc/trunk/README.md) | Read one whole system once | — |

**Artifact:** a loader-to-entry-point teardown of a real binary, and a small syscall-layer tool.

**Gate (4 h):** which mitigations a toolchain applied and how I know; page fault vs segfault, from memory; a race's interleaving and minimal fix; a binary protocol client from spec, accounting for every captured byte.

### Phase 5a: The Boundary (hard gate)

What a trust boundary is, in access control and in law, and a lab that cannot leak. Nothing after this starts until it is passed.

| Resource | What for | Hours |
| --- | --- | --- |
| Saltzer & Schroeder, [*The Protection of Information*](https://web.mit.edu/Saltzer/www/publications/protection/) | Least privilege, fail-safe defaults, complete mediation | 5 |
| Access-control models | Threat-model two systems I depend on | 20 |
| Lei do Cibercrime (Lei 109/2009), [Budapest Convention](https://www.coe.int/en/web/conventions/full-list?module=treaty-detail&treatynum=185) | The law, read directly | 15 |
| Five bug-bounty policies | Read side by side as legal documents | 5 |
| [CERT Guide to CVD](https://certcc.github.io/CERT-Guide-to-CVD/) | Coordinated disclosure | 5 |
| The lab as code | Hypervisor, [Vagrant](https://developer.hashicorp.com/vagrant/docs) or [Ansible](https://docs.ansible.com/), host-only networking, snapshots | 25 |

**Artifact:** a published threat model, and a dated written authorization for my own lab plus a one-page summary of the law that applies to me.

**Gate (4 h):** for five activities against five targets, whether I'm authorized and the specific basis; then destroy the lab, rebuild it from my own scripts and show it can't reach anything I don't own. Any "probably fine" fails.

### Phase 5b: The Application Surface (the fork)

Build deployments before breaking them. Here I choose: binary spine (Phase 6), web/cloud fork, or both side by side.

| Resource | What for | Hours |
| --- | --- | --- |
| [MIT 6.858](https://css.csail.mit.edu/6.858/) | Systems security: isolation, privilege separation, side channels | 60 |
| [PortSwigger Web Security Academy](https://portswigger.net/web-security) | All labs; SSRF, deserialization, auth, smuggling at source level | 80 |
| [flaws.cloud](http://flaws.cloud/), [flaws2.cloud](http://flaws2.cloud/), [CloudGoat](https://github.com/RhinoSecurityLabs/cloudgoat) | IAM privesc, metadata SSRF, tenant isolation | 60 |
| [*Serious Cryptography*, 2nd ed.](https://nostarch.com/serious-cryptography-2nd-edition) | Crypto, and how deployments get it wrong | 45 |
| [CryptoHack](https://cryptohack.org/), [Cryptopals](https://cryptopals.com/) sets 1–3 | Implement the attack | 85 |
| [SEED Labs](https://seedsecuritylabs.org/) | Network, PKI, access control, containers | 30 |

**Artifact:** a crypto-misuse writeup with the maths, and a compromise chain against a target I built or am authorized on.

**Gate (6 h):** map an unfamiliar application's trust boundaries and authorization model before testing, then find an authorization or logic flaw nobody pointed me at.

**Fork gate:** an original, published SSRF or cloud-isolation chain against a named product, plus repeatable income.

### Phase 6: The Bug

Find a memory-corruption bug in something I didn't write, state the primitive precisely, take control. Mitigations off, so the mechanism stays visible.

| Resource | What for | Hours |
| --- | --- | --- |
| [pwn.college](https://pwn.college/dojos) Program Security | Shellcode, memory errors, exploitation | 150 |
| [OST2](https://p.ost2.fyi/) Vulns1001 | C/C++ bug-class taxonomy | 60 |
| [Ghidra](https://ghidra-sre.org/), [pwndbg](https://github.com/pwndbg/pwndbg), [pwntools](https://docs.pwntools.com/) | The tools | 30 |
| [exploit.education Phoenix](https://exploit.education/phoenix/) | Planted bugs in tiny programs | 50 |
| [Nightmare](https://guyinatuxedo.github.io/), [ir0nstone's notes](https://ir0nstone.gitbook.io/notes) | When stuck, after the hint floor | 70 |
| [*Smashing the Stack*](https://phrack.org/issues/49/14), [*Once upon a free()*](https://phrack.org/issues/57/9), [*Basic Integer Overflows*](https://phrack.org/issues/60/10) | The founding papers | 7 |
| *Practical Binary Analysis*, Andriesse | Writing my own analysis tools | 40 |
| *Practical Reverse Engineering*, Dang et al. | RE method across architectures | 40 |
| A real C-heavy open-source project | Hunting, from hour one | 40 |

**Artifact:** a memory-safety bug I found in real software, written up through disclosure.

**Gate (8 h):** a binary with a memory-corruption bug, no source, no hint: find it, characterize the primitive precisely, demonstrate control of execution. The characterization is the skill, not the crash.

### Phase 7: The Defended Target

Everything from Phase 6 against targets that fight back: mitigations on, reliability required, two architectures, no bug handed over. The employability line for the binary track.

| Resource | What for | Hours |
| --- | --- | --- |
| [pwn.college](https://pwn.college/dojos) Software Exploitation | Mitigations on | 180 |
| [Georgia Tech CS6265](https://tc.gts3.org/cs6265/) | Graduate binary exploitation | 70 |
| [how2heap](https://github.com/shellphish/how2heap) | Heap techniques per glibc version (record it: 2.44) | 70 |
| HeapLAB [1](https://www.udemy.com/course/linux-heap-exploitation-part-1/), [2](https://www.udemy.com/course/linux-heap-exploitation-part-2/) | Deriving heap techniques (paid, ~€20–40 each) | 60 |
| [ROP Emporium](https://ropemporium.com/) | Code reuse, 32- and 64-bit | 40 |
| [Azeria Labs](https://azeria-labs.com/) | ARM64, the second architecture | 70 |
| [pwnable.tw](https://pwnable.tw/), [pwnable.kr](http://pwnable.kr/) | CTF-grade practice | 60 |
| Shacham, [*Geometry of Innocent Flesh*](https://dl.acm.org/doi/10.1145/1315245.1315313); [*SoK: Eternal War in Memory*](https://nebelwelt.net/publications/files/13Oakland.pdf) | ROP, and mitigations as a system | 10 |
| Vendor docs: glibc, Intel CET, ARM PAC/BTI/MTE, MS CFG | Current mitigations | 50 |
| [BinDiff](https://github.com/google/bindiff), [Diaphora](https://github.com/joxeankoret/diaphora) | Patch diffing: three CVEs to PoC | 60 |
| [Exploit-DB](https://www.exploit-db.com/) | Ten exploits for one bug class across a decade | 20 |
| [CTFtime](https://ctftime.org/) | A team, one competition per quarter | 40 |

**Artifact:** an end-to-end exploit against modern mitigations, a valid in-scope bounty finding, and a patch-diffing writeup.

**Gate:** reliable code execution against NX, full RELRO, PIE, canary and ASLR at ≥80% over 100 runs (12 h); find and exploit an undisclosed bug with mitigations on (16 h); a known bug class on an unfamiliar binary in 4 hours.

### Phase 8: The Theory

Automata, compilers, dataflow and static analysis, placed late so it never blocks a beginner but comes before the research that needs it.

| Resource | What for | Hours |
| --- | --- | --- |
| [*Models of Computation*, Erickson](https://jeffe.cs.illinois.edu/teaching/algorithms/models/) or [MIT 18.404J](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/) | Automata and undecidability | 50 |
| [*Crafting Interpreters*](https://craftinginterpreters.com/) | Build a parser and bytecode VM once | 60 |
| [*Static Program Analysis*](https://cs.au.dk/~amoeller/spa/) | Dataflow, lattices, abstract interpretation | 60 |
| [LLVM passes](https://llvm.org/docs/WritingAnLLVMNewPMPass.html) | Instrumentation, how fuzzing works | 40 |
| A hand-written parser | For a real attacker-controlled format | 20 |

**Artifact:** a small analysis tool, with what it computes and what it soundly cannot.

**Gate (4 h):** recover a flattened control-flow graph; a dataflow analysis by hand with its lattice and fixed point; why no analyser can decide whether an arbitrary program has a given bug.

### Phase 9: The Research

Pick a target on my own reasoning, audit adversarially, fuzz as engineering, triage, disclose.

| Resource | What for | Hours |
| --- | --- | --- |
| *The Art of Software Security Assessment* | Auditing as a method | 100 |
| Codebases with their CVE histories | Supervised audit practice, approximated | 120 |
| [Fuzzing101](https://github.com/antonio-morales/fuzzing101) | Fuzzing real software to real CVEs | 60 |
| [AFL++](https://github.com/AFLplusplus/AFLplusplus) | Read the engine; write harnesses | 80 |
| [*The Fuzzing Book*](https://www.fuzzingbook.org/) | Grammar, coverage, mutation, reduction | 60 |
| [OSS-Fuzz](https://google.github.io/oss-fuzz/) | A harness in a real project | 60 |
| [libFuzzer](https://github.com/google/fuzzing/blob/master/tutorial/libFuzzerTutorial.md), [honggfuzz](https://github.com/google/honggfuzz) | Second and third engines | 30 |
| Klees et al., [*Evaluating Fuzz Testing*](https://dl.acm.org/doi/10.1145/3243734.3243804) | Before believing any benchmark | 5 |
| [angr](https://docs.angr.io/) | Symbolic and concolic execution | 60 |
| [CodeQL](https://codeql.github.com/) | Turn one bug into a query for its variants | 50 |
| [Project Zero](https://googleprojectzero.blogspot.com/), [RCAs](https://googleprojectzero.github.io/0days-in-the-wild/rca.html) | Finished research as a model, one per fortnight | 60 |
| C–Rust FFI boundary | `cargo-fuzz`, unsafe-block auditing | 40 |
| [CERT Guide to CVD](https://certcc.github.io/CERT-Guide-to-CVD/), [security.txt](https://securitytxt.org/) | Disclosure | 20 |

**Artifact:** a coordinated disclosure with a published timeline.

**Gate:** a previously unknown defect in software I chose myself, triaged unaided and carried through disclosure to resolution.

### Phase 10: The Frontier

One or two branches, never more.

| Branch | Note | Needs |
| --- | --- | --- |
| Linux kernel | The most direct extension of Phase 7 | Phase 7 |
| Browser + JIT | Highest ceiling, no structured course | Phases 5b + 8 |
| Windows | Half the field | Phase 7 |
| Program analysis | Theory into tools nobody else has | Phase 8 |
| Hypervisors | Small field, brutal entry | Kernel |
| Firmware / hardware | A complete free path nobody knows about | Phase 4 |
| Mobile | Large paid surface | Phase 7 |
| Smart contracts | Shortest path from study to paid work | Phase 9 |
| Cloud / web | The fork's deep end | Fork gate |
| RF / SDR | The only branch that needs calculus | Calculus |

**Gate:** original research in the branch that a stranger cites, adopts or builds on.
