// The roadmap: OSVR (itsbadsignal/osvr README, links checked 2026-11-10/11), Core rows only.
// groups: [heading or '', [[title, url, note], ...]]. checklist: plain steps. unlock: the milestone.
const OST2 = (id) => `https://p.ost2.fyi/courses/course-v1:OpenSecurityTraining2+${id}/about`;

export const ROADMAP = [
  {
    code: 'FND', icon: 'code', name: 'Segfault Survivor', state: 'now', rarity: 'common', flavor: 'You speak C now.',
    meta: 'foundations · programming, linux, c, assembly, debugging',
    groups: [
      ['programming · skip if you can write 100 lines without a tutorial', [
        ['CS50x (Harvard)', 'https://cs50.harvard.edu/x/', 'free · 11 weeks'],
      ]],
      ['linux', [
        ['Linux Luminarium (pwn.college)', 'https://pwn.college/linux-luminarium/', 'free'],
        ['Computing 101 (pwn.college)', 'https://pwn.college/computing-101/', 'free'],
      ]],
      ['c · in this order', [
        ["Beej's Guide to C Programming", 'https://beej.us/guide/bgc/', 'free · book · the introduction'],
        ['Modern C (Jens Gustedt)', 'https://gustedt.gitlabpages.inria.fr/modern-c/', 'free · book'],
        ['Effective C, 2nd ed. (Robert Seacord)', '', 'paid · book · secure, modern C, after Modern C'],
      ]],
      ['systems, assembly, debugging', [
        ['Arch1001: x86-64 Assembly (OST2)', OST2('Arch1001_x86-64_Asm+2021_v1'), 'free'],
        ['Dbg1012: Introductory GDB (OST2)', OST2('Dbg1012_IntroGDB+2024_v1'), 'free'],
        ['CS:APP3e labs: Data, Bomb, Attack', 'https://csapp.cs.cmu.edu/3e/labs.html', 'labs free · book paid'],
        ['Operating Systems: Three Easy Pieces', 'https://pages.cs.wisc.edu/~remzi/OSTEP/', 'free · book'],
      ]],
    ],
    unlock: ['Intro to Cybersecurity (pwn.college) + CS:APP Bomb and Attack labs', 'https://pwn.college/intro-to-cybersecurity/'],
  },
  {
    code: 'RE', icon: 'ghost', name: 'Stripped Bare', rarity: 'rare', flavor: 'Stripped means nothing to you.',
    meta: 'reverse engineering · read code you did not write',
    groups: [
      ['', [
        ['Dbg1102: Introductory Ghidra (OST2)', OST2('Dbg1102_IntroGhidra+2024_v2'), 'free'],
        ['pwn.college Reverse Engineering', 'https://pwn.college/program-security/reverse-engineering/', 'free · 36 challenges'],
        ['Reverse Engineering for Beginners (Yurichev)', 'https://beginners.re/', 'free · book'],
      ]],
    ],
    unlock: ['10 crackmes of rising difficulty, unaided; one written up in full', 'https://crackmes.one/'],
  },
  {
    code: 'BX', icon: 'crosshair', name: 'RIP Control', rarity: 'epic', flavor: 'Crash in, primitive out.',
    meta: 'binary exploitation · memory bug to control, against current mitigations',
    groups: [
      ['', [
        ['pwn.college Program Security', 'https://pwn.college/program-security/', 'free · 162 challenges'],
        ['ROP Emporium', 'https://ropemporium.com/', 'free · 8 challenges'],
        ['pwn.college Software Exploitation', 'https://pwn.college/software-exploitation/', 'free · 90 challenges'],
        ['how2heap (shellphish)', 'https://github.com/shellphish/how2heap', 'free · check the glibc version'],
      ]],
    ],
    unlock: ['Program Security + Software Exploitation through Dynamic Allocator Exploitation; one how2heap technique on its newest glibc with ASLR, PIE, NX and full RELRO on', ''],
  },
  {
    code: 'VD', icon: 'search', name: 'Déjà Vuln', rarity: 'epic', flavor: 'Old bugs, found again by hand.',
    meta: 'vulnerability discovery · audit, fuzzing, variants, patch diffing',
    groups: [
      ['bug classes + audit', [
        ['Vulns1001: C-Family Implementation Vulns (OST2)', OST2('Vulns1001_C-family+2023_v1'), 'free'],
        ['Web Security Academy (PortSwigger)', 'https://portswigger.net/web-security', 'free'],
      ]],
      ['fuzzing', [
        ['Fuzz1001: Intro to AFL++ (OST2)', OST2('Fuzz1001_Intro_AFL+2025_v1'), 'free'],
        ['Fuzzing101 (GitHub Security Lab)', 'https://github.com/antonio-morales/Fuzzing101', 'free · 10 exercises'],
        ['Testing Handbook: Fuzzing (Trail of Bits)', 'https://appsec.guide/docs/fuzzing/', 'free'],
      ]],
      ['variants + patch diffing', [
        ['CodeQL for C and C++', 'https://codeql.github.com/docs/codeql-language-guides/codeql-for-cpp', 'free'],
        ['Patch Diffing with Ghidra', 'https://ihack4falafel.github.io/Patch-Diffing-with-Ghidra', 'free · article'],
      ]],
    ],
    unlock: ['Rediscover a known CVE with your own fuzzer setup, root-cause it to the line, then find it again from the patch alone', ''],
  },
  {
    code: 'PRO', icon: 'id', name: 'On the Record', rarity: 'legendary', flavor: 'Your name on a CVE-ID.',
    meta: 'disclosure · bug to fix, CVE and public write-up',
    groups: [
      ['', [
        ['CERT Guide to Coordinated Vulnerability Disclosure', 'https://certcc.github.io/CERT-Guide-to-CVD/', 'free'],
        ['CWE root cause mapping guidance', 'https://cwe.mitre.org/documents/cwe_usage/guidance.html', 'free'],
        ['CVSS v4.0 specification', 'https://www.first.org/cvss/v4.0/specification-document', 'free'],
        ['MITRE CNA of Last Resort', 'https://mitre.github.io/mitre-cve-roles/CNA-LR/', 'free'],
      ]],
    ],
    unlock: ['A full advisory (summary, versions, root cause, CWE, CVSS, PoC, fix) for the CVE from VD', ''],
  },
  {
    phase: 2, code: 'SPC', icon: 'trophy', name: 'Pick a Lane', rarity: 'legendary', flavor: 'The contest floor. The big stage.',
    meta: 'specialisation · pick one, after disclosure',
    groups: [
      ['linux kernel', [
        ['Arch2001: x86-64 OS Internals (OST2)', OST2('Arch2001_x86-64_OS_Internals+2024_v1'), 'free'],
        ['pwn.college System Security', 'https://pwn.college/system-security/', 'free'],
        ['Learning Linux Kernel Exploitation, part 1 (Midas)', 'https://lkmidas.github.io/posts/20210123-linux-kernel-pwn-part-1/', 'free'],
        ['pwn.college Kernel Exploitation', 'https://pwn.college/software-exploitation/kernel-exploitation/', 'free'],
      ]],
      ['windows', [
        ['Windows Internals, 7th ed.', 'https://learn.microsoft.com/en-us/sysinternals/resources/windows-internals', 'paid · book'],
        ['HackSys Extreme Vulnerable Driver', 'https://github.com/hacksysteam/HackSysExtremeVulnerableDriver', 'free'],
        ['Exp4011: Windows Kernel Race + UAF in KTM (OST2)', OST2('Exp4011_Windows_Kernel_UAF_KTM+2023_v1'), 'free'],
      ]],
      ['browsers', [
        ['Chrome Browser Exploitation series (Jack Halon)', 'https://jhalon.github.io/chrome-browser-exploitation-1/', 'free'],
      ]],
      ['embedded + firmware', [
        ['Azeria Labs: ARM assembly', 'https://azeria-labs.com/writing-arm-assembly-part-1/', 'free'],
        ['Arch4001 (OST2)', 'https://ost2.fyi/Arch4001', 'free'],
        ['binwalk', 'https://github.com/ReFirmLabs/binwalk', 'tool'],
        ['FirmAE', 'https://github.com/pr0v3rbs/FirmAE', 'tool'],
      ]],
      ['mobile', [
        ['Android security overview', 'https://source.android.com/docs/security/overview', 'free'],
        ['OWASP MASTG', 'https://mas.owasp.org/MASTG/', 'free'],
      ]],
      ['hypervisors', [
        ['QEMU developer docs', 'https://www.qemu.org/docs/master/devel/index.html', 'free'],
      ]],
    ],
    unlock: ['The Core list of one lane, done', ''],
  },
  {
    code: '0DAY', icon: 'checkbadge', name: 'Zero Day', rarity: 'mythic', flavor: 'A real vendor said: confirmed.',
    meta: 'final project · find, root-cause and disclose a new bug',
    checklist: [
      'Pick a target you are allowed to test',
      'Map its attack surface: top three entry points, and why',
      'Find a bug by audit, fuzzing or variant analysis; check it is new',
      'Root-cause it to the line, name the CWE and the primitive',
      'Prove impact: a reliable PoC in your own lab (70% over 20 runs)',
      'Disclose through the vendor, their CNA or MITRE, then publish',
    ],
    unlock: ['A previously unknown bug, disclosed', ''],
  },
];

// Line icons (24x24), from the OSVR achievements file.
export const ICONS = {
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  ghost: '<path d="M5 20V11a7 7 0 0 1 14 0v9l-2.5-1.8L14 20l-2-1.6L10 20l-2.5-1.8z"/><circle cx="9.5" cy="11" r=".9"/><circle cx="14.5" cy="11" r=".9"/>',
  crosshair: '<circle cx="12" cy="12" r="8"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><circle cx="12" cy="12" r="1.4"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><line x1="21" y1="21" x2="15.5" y2="15.5"/>',
  id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2.1"/><path d="M5.6 16.4a3.4 3.4 0 0 1 5.8 0"/><line x1="14" y1="10" x2="18" y2="10"/><line x1="14" y1="14" x2="18" y2="14"/>',
  trophy: '<path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 5H4.5v1.5A3.5 3.5 0 0 0 8 10M17 5h2.5v1.5A3.5 3.5 0 0 1 16 10"/><line x1="12" y1="13" x2="12" y2="17"/><path d="M9.5 21l.6-4h3.8l.6 4z"/>',
  checkbadge: '<circle cx="12" cy="12" r="9"/><polyline points="8 12 11 15 16 9"/>',
};
